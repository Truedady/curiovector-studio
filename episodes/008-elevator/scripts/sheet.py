"""Contact sheet of review stills: python3 scripts/sheet.py L out/stills/sheet.png"""
import glob, os, sys
from PIL import Image, ImageDraw
tag, out = sys.argv[1], sys.argv[2]
files = sorted(glob.glob(os.path.join(os.path.dirname(out), f"{tag}_*.png")))
L = tag == "L"
tw, th = (640, 360) if L else (270, 480)
cols = 3 if L else 6
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (tw * cols, th * rows), (0, 0, 0))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((tw, th))
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im, (x, y))
    d.text((x + 6, y + 6), os.path.basename(f), fill=(255, 255, 0))
sheet.save(out)
