"""Ensure jhs_iwork_math1 portal cover is portrait (title upright)."""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "images" / "jhs_iwork_math1" / "page_0001.png"
OUT = ROOT / "images" / "jhs_iwork_math1_cover.png"


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    im = ImageOps.exif_transpose(im)
    # Landscape export → 90°（反時計回り）で縦向きに。以前の -90 だと表紙が上下逆になるため +90 を使用
    if im.width > im.height:
        im = im.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, format="PNG", optimize=True)
    print(OUT, im.size)


if __name__ == "__main__":
    main()
