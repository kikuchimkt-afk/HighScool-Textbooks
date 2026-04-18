"""Generate PWA/favicon icons from iワーク中1数学 cover (page_0001.png)."""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "images" / "jhs_iwork_math1" / "page_0001.png"
OUT_DIR = ROOT / "icons"
PREFIX = "jhs_iwork_math1"
SIZES = (32, 180, 192, 512)


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source: {SRC}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    for size in SIZES:
        thumb = ImageOps.fit(im, (size, size), method=Image.Resampling.LANCZOS)
        dest = OUT_DIR / f"{PREFIX}_{size}.png"
        thumb.save(dest, format="PNG", optimize=True)
        print(dest)


if __name__ == "__main__":
    main()
