#Requires -Version 5.1
<#
.SYNOPSIS
  Git 履歴から大きなバイナリ（既定: images/ 以下）を除去し、リポジトリを軽くします。

.DESCRIPTION
  - git filter-repo が必要です（未インストール時は pip で入れる案内を表示）。
  - filter-repo は既定で origin を削除するため、実行前に URL を保存し、終了後に復元します。
  - 作業ツリーに未コミットの変更があると失敗することがあるため、先に commit / stash してください。

.PARAMETER Force
  確認プロンプトを省略します。

.PARAMETER DryRun
  実行するコマンドだけ表示し、何もしません（-WhatIf とは別。PowerShell 予約との競合を避けるため DryRun 名）。

.PARAMETER MirrorBackup
  実行前に、親フォルダへ git clone --mirror のバックアップを作ります（容量を大きく使います）。

.PARAMETER BackupParent
  -MirrorBackup 時の保存先フォルダ（既定: リポジトリの親ディレクトリ）。

.PARAMETER ExtraInvertPath
  追加で履歴から消すパス（複数可）。例: -ExtraInvertPath 'old_pdfs','*.pdf'

.NOTES
  履歴書き換え後は必ず force push が必要です:
    git push origin --force --all
    git push origin --force --tags
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [switch]$Force,
    [switch]$DryRun,
    [switch]$MirrorBackup,
    [string]$BackupParent = "",
    [string[]]$ExtraInvertPath = @()
)

# git は stderr にメッセージを出すため Stop にしない（NativeCommandError を避ける）
$ErrorActionPreference = "Continue"

function Test-GitFilterRepo {
    $null = & git filter-repo --version 2>&1
    return ($LASTEXITCODE -eq 0)
}

# --- リポジトリルート判定 ---
$gitDir = & git rev-parse --git-dir 2>$null
if (-not $gitDir) {
    Write-Error "Git リポジトリ内で実行してください。"
    exit 1
}
$repoRoot = & git rev-parse --show-toplevel
Set-Location $repoRoot
Write-Host "Repository: $repoRoot" -ForegroundColor Green

# --- origin URL 保存（filter-repo が origin を消すため） ---
$originUrl = & git remote get-url origin 2>$null
if (-not $originUrl) {
    Write-Error "remote 'origin' が設定されていません。先に git remote add origin で URL を登録してください。"
    exit 1
}
Write-Host "origin: $originUrl" -ForegroundColor DarkGray

# --- 作業ツリー簡易チェック（DryRun では対話しない） ---
$status = & git status --porcelain
if ($status -and -not $Force -and -not $DryRun) {
    Write-Warning "未コミットの変更があります。続行すると失敗することがあります。commit または stash してから -Force を付けるか、変更を片付けてください。"
    if (-not $PSCmdlet.ShouldContinue("未コミット変更があります。続行しますか?", "確認")) {
        exit 0
    }
}
if ($status -and $DryRun) {
    Write-Warning "未コミットの変更があります（DryRun のため続行）。本番実行前に commit / stash を推奨します。"
}

if (-not (Test-GitFilterRepo)) {
    Write-Host ""
    Write-Host "git filter-repo が見つかりません。次のいずれかでインストールしてください。" -ForegroundColor Yellow
    Write-Host "  py -m pip install git-filter-repo" -ForegroundColor White
    Write-Host "  pip install git-filter-repo" -ForegroundColor White
    Write-Host ""
    exit 1
}

if (-not $Force -and -not $DryRun) {
    Write-Host ""
    Write-Host "【警告】全コミットの履歴から次を削除します: images/ 配下（既定）" -ForegroundColor Yellow
    if ($ExtraInvertPath.Count -gt 0) {
        Write-Host "  追加: $($ExtraInvertPath -join ', ')" -ForegroundColor Yellow
    }
    Write-Host "続行後は git push --force が必要です。バックアップ推奨（-MirrorBackup）。" -ForegroundColor Yellow
    Write-Host ""
    if (-not $PSCmdlet.ShouldContinue("履歴を書き換えます。よろしいですか?", "確認")) {
        exit 0
    }
}

# --- オプション: ミラーバックアップ ---
if ($MirrorBackup -and -not $DryRun) {
    if (-not $BackupParent) {
        $BackupParent = Split-Path $repoRoot -Parent
    }
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $mirrorPath = Join-Path $BackupParent "HighScool-Textbooks-backup-$stamp.git"
    Write-Host "Mirror backup -> $mirrorPath" -ForegroundColor Cyan
    & git clone --mirror "$repoRoot" "$mirrorPath"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ミラーバックアップに失敗しました。"
        exit 1
    }
}

# --- filter-repo 引数 ---
$filterArgs = @(
    "--force",
    "--invert-paths",
    "--path", "images/"
)
foreach ($p in $ExtraInvertPath) {
    if ($p -match '\*') {
        $filterArgs += "--path-glob"
        $filterArgs += $p
    } else {
        $filterArgs += "--path"
        $filterArgs += $p
    }
}

if ($DryRun) {
    Write-Host "[DryRun] git filter-repo $($filterArgs -join ' ')" -ForegroundColor Cyan
} else {
    Write-Host "Running: git filter-repo $($filterArgs -join ' ')" -ForegroundColor Cyan
    & git @('filter-repo') + $filterArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "git filter-repo が失敗しました。"
        exit 1
    }
}

# --- origin 復元 ---
if (-not $DryRun) {
    $hasOrigin = & git remote 2>$null | Where-Object { $_ -eq "origin" }
    if (-not $hasOrigin) {
        Write-Host "Restoring remote origin..." -ForegroundColor Cyan
        & git remote add origin $originUrl
    }
}

# --- GC ---
if (-not $DryRun) {
    Write-Host "Running git gc..." -ForegroundColor Cyan
    & git reflog expire --expire=now --all
    & git gc --prune=now --aggressive
}

Write-Host ""
if ($DryRun) {
    Write-Host "DryRun のため履歴は変更していません。" -ForegroundColor Cyan
    exit 0
}
Write-Host "完了しました。" -ForegroundColor Green
Write-Host "次を実行してリモートを更新してください:" -ForegroundColor White
Write-Host "  git push origin --force --all" -ForegroundColor Gray
Write-Host "  git push origin --force --tags" -ForegroundColor Gray
Write-Host ""
Write-Host "作業ツリーの images/ は最新コミットからも消えています。必要なら手元のバックアップから戻すか、別ストレージに置いてください。" -ForegroundColor DarkYellow
