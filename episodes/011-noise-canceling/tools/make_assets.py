"""Pre-rasterize every expensive soft-light layer for Episode 011.

All blurs are baked once here so the Remotion compositions only animate
transform/opacity of cached bitmaps (see docs/RENDER_PERFORMANCE.md).
Run:  python3 -I tools/make_assets.py   (from the episode folder)
"""
import os
import random

from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
os.makedirs(OUT, exist_ok=True)

NAVY = (8, 19, 47)
CYAN = (67, 197, 245)
ORANGE = (255, 146, 62)
WHITE = (248, 250, 255)


def radial_glow(name, color, size=512, power=2.2):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    c = (size - 1) / 2
    for y in range(size):
        for x in range(size):
            d = (((x - c) ** 2 + (y - c) ** 2) ** 0.5) / c
            a = max(0.0, 1.0 - d) ** power
            px[x, y] = (*color, int(255 * a))
    img.save(os.path.join(OUT, name))


def blob_layer(w, h, blobs, blur):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for (cx, cy, rx, ry, col, a) in blobs:
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(*col, a))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def background(name, w, h, blobs):
    base = Image.new("RGBA", (w, h), NAVY + (255,))
    grad = ImageDraw.Draw(base)
    for y in range(h):
        t = y / h
        r = int(NAVY[0] * (1 - t) + 4 * t)
        g = int(NAVY[1] * (1 - t) + 10 * t)
        b = int(NAVY[2] * (1 - t) + 28 * t)
        grad.line([(0, y), (w, y)], fill=(r, g, b, 255))
    base = Image.alpha_composite(base, blob_layer(w, h, blobs, max(w, h) // 12))
    # faint painterly speckle so flat navy never bands
    rnd = random.Random(11)
    speck = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(speck)
    for _ in range(w * h // 900):
        x, y = rnd.randrange(w), rnd.randrange(h)
        a = rnd.randrange(6, 22)
        sd.point((x, y), fill=(*WHITE, a))
    base = Image.alpha_composite(base, speck)
    # vignette
    vig = Image.new("L", (w, h), 0)
    vd = ImageDraw.Draw(vig)
    vd.ellipse([-w * 0.15, -h * 0.15, w * 1.15, h * 1.15], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(max(w, h) // 8))
    dark = Image.new("RGBA", (w, h), (2, 6, 18, 255))
    base = Image.composite(base, dark, vig)
    base.convert("RGB").save(os.path.join(OUT, name), quality=95)


def beam(name, w, h, color, alpha=120):
    """Soft window light shaft (trapezoid) baked with blur."""
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.polygon([(w * 0.38, 0), (w * 0.62, 0), (w * 0.95, h), (w * 0.05, h)], fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(w // 10))
    fade = Image.new("L", (w, h), 0)
    fd = ImageDraw.Draw(fade)
    for y in range(h):
        fd.line([(0, y), (w, y)], fill=int(255 * (1 - y / h) ** 1.4))
    r, g, b, a = layer.split()
    a = Image.composite(a, Image.new("L", (w, h), 0), fade)
    Image.merge("RGBA", (r, g, b, a)).save(os.path.join(OUT, name))


def soft_shadow(name, w, h):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([w * 0.1, h * 0.3, w * 0.9, h * 0.7], fill=(0, 0, 0, 170))
    layer.filter(ImageFilter.GaussianBlur(h // 6)).save(os.path.join(OUT, name))


radial_glow("glow_cyan.png", CYAN)
radial_glow("glow_orange.png", ORANGE)
radial_glow("glow_white.png", WHITE, power=3.0)
background(
    "bg_landscape.jpg", 1920, 1080,
    [(1500, 220, 520, 300, CYAN, 46), (300, 900, 600, 280, ORANGE, 26), (960, 540, 700, 360, (30, 60, 120), 70)],
)
background(
    "bg_shorts.jpg", 1080, 1920,
    [(820, 360, 420, 380, CYAN, 46), (200, 1650, 520, 380, ORANGE, 26), (540, 980, 520, 700, (30, 60, 120), 70)],
)
beam("beam_warm.png", 400, 900, (255, 214, 170), 110)
soft_shadow("shadow.png", 600, 200)
print("assets written to", os.path.abspath(OUT))
