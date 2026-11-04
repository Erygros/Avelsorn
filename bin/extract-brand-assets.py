"""Extract supplied artwork. Authoring dependencies: PyMuPDF, Pillow.
Not used by the web server. The source PDF remains unchanged.
"""
from pathlib import Path
import hashlib
import json
import pymupdf
from PIL import Image

root = Path(__file__).resolve().parent.parent
source = root / "Avelsorn_Markenblatt.pdf"
destination = root / "public/brand"
destination.mkdir(parents=True, exist_ok=True)
document = pymupdf.open(source)
assets = [
    (3, 4, "avelsorn-logo"), (5, 4, "avelsorn-logo-white"),
    (7, 8, "avelsorn-signet"), (9, 10, "avelsorn-icon-16"),
    (11, 12, "avelsorn-icon-32"), (13, 14, "avelsorn-icon-48"),
    (15, 16, "avelsorn-profile"),
]
for image, mask, name in assets:
    pixmap = pymupdf.Pixmap(pymupdf.Pixmap(document, image), pymupdf.Pixmap(document, mask))
    pixmap.save(str(destination / f"{name}.png"))

icons = {size: Image.open(destination / f"avelsorn-icon-{size}.png") for size in (16, 32, 48)}
icons[48].save(root / "src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
               append_images=[icons[16], icons[32]])
icons[32].save(root / "src/app/icon.png")
Image.open(destination / "avelsorn-profile.png").resize((180, 180), Image.Resampling.LANCZOS).save(root / "src/app/apple-icon.png")
sharing = Image.new("RGBA", (1200, 630), "#F5F6F2")
logo = Image.open(destination / "avelsorn-logo.png")
logo.thumbnail((900, 300), Image.Resampling.LANCZOS)
sharing.alpha_composite(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2))
sharing.convert("RGB").save(root / "src/app/opengraph-image.png")
(destination / "source.json").write_text(json.dumps({
    "source": source.name,
    "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "format": "Original embedded raster images with soft masks; no vector paths supplied",
    "assets": [{"file": name + ".png", "imageObject": image, "maskObject": mask} for image, mask, name in assets],
}, indent=2) + "\n", encoding="utf-8")
