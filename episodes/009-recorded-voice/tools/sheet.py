import sys
from PIL import Image, ImageDraw
# usage: sheet.py out.png cols scale img...
out, cols, scale = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
ims = [Image.open(p) for p in sys.argv[4:]]
w, h = int(ims[0].width * scale), int(ims[0].height * scale)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (w * cols, h * rows), 'white')
for i, (im, p) in enumerate(zip(ims, sys.argv[4:])):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im.convert('RGB').resize((w, h)), (x, y))
    ImageDraw.Draw(sheet).text((x + 8, y + 8), p.split('/')[-1], fill='yellow')
sheet.save(out)
