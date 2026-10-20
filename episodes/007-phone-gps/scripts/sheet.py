"""Contact sheet of review stills: python3 -I scripts/sheet.py out.jpg cols img1 img2 ..."""
import sys
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert("RGB") for f in files]
w, h = ims[0].size
s = 900 / (w * cols) if w > h else 900 / (w * cols)
tw, th = int(w * s * 1.0 * cols / cols), int(h * s)
tw = int(w * s)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (tw * cols, th * rows), (0, 0, 0))
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im.resize((tw, th)), (x, y))
    d.text((x + 6, y + 4), f.split("_")[-1][:-4], fill=(255, 255, 0))
sheet.save(out, quality=88)
