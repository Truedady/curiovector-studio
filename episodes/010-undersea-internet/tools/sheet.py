"""Contact sheet of rendered stills: python3 -I tools/sheet.py out.jpg a.jpg b.jpg ..."""
import sys
from PIL import Image
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f) for f in files]
w, h = ims[0].size
cols = 3 if w > h else 4
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (w * cols, h * rows), (0, 0, 0))
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
scale = 1800 / sheet.size[0]
sheet.resize((int(sheet.size[0] * scale), int(sheet.size[1] * scale))).save(out, quality=85)
