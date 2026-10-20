"""Pre-rasterize the expensive static light layers for episode 008.

Every soft glow, vignette and textured background is baked once into a PNG so
the Remotion compositions only animate transforms/opacity of cached bitmaps
(no runtime blur filters). Run: python3 scripts/make_assets.py
"""
import os
import random

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public")
os.makedirs(OUT, exist_ok=True)

NAVY = np.array([8, 19, 47], dtype=np.float32)
DEEP = np.array([4, 10, 26], dtype=np.float32)
CYAN = (67, 197, 245)
ORANGE = (255, 146, 62)
WHITE = (248, 250, 255)


def save(arr, name):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), optimize=True)
    print("wrote", name)


def glow(name, color, size=512, power=2.2):
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    c = (size - 1) / 2
    r = np.sqrt((x - c) ** 2 + (y - c) ** 2) / c
    a = np.clip(1 - r, 0, 1) ** power
    img = np.zeros((size, size, 4), dtype=np.float32)
    img[..., 0], img[..., 1], img[..., 2] = color
    img[..., 3] = a * 255
    save(img, name)


def background(name, w, h, light_xy, seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    lx, ly = light_xy
    d = np.sqrt(((x - lx * w) / w) ** 2 + ((y - ly * h) / h) ** 2)
    t = np.clip(d / 0.95, 0, 1)[..., None]
    base = NAVY * (1 - t) + DEEP * t
    # faint cyan bloom near the light source
    bloom = np.clip(1 - d / 0.55, 0, 1)[..., None] ** 2
    base = base + bloom * np.array([18, 52, 74], dtype=np.float32) * 0.55
    # vignette
    vx = (x / w - 0.5) * 2
    vy = (y / h - 0.5) * 2
    v = np.clip(1 - 0.32 * (vx**2 + vy**2), 0.55, 1)[..., None]
    base = base * v
    # paper grain
    base = base + rng.normal(0, 2.2, (h, w, 1)).astype(np.float32)
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    # dust motes
    draw = ImageDraw.Draw(img, "RGBA")
    random.seed(seed)
    for _ in range(int(w * h / 9000)):
        px, py = random.random() * w, random.random() * h
        rr = random.choice([0.8, 1.0, 1.3, 1.8])
        al = random.randint(14, 60)
        draw.ellipse([px - rr, py - rr, px + rr, py + rr], fill=(140, 200, 240, al))
    img.save(os.path.join(OUT, name), quality=92)
    print("wrote", name)


def blueprint_grid(name, w, h, step=60):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for gx in range(0, w, step):
        d.line([(gx, 0), (gx, h)], fill=(67, 197, 245, 16 if gx % (step * 4) else 30), width=1)
    for gy in range(0, h, step):
        d.line([(0, gy), (w, gy)], fill=(67, 197, 245, 16 if gy % (step * 4) else 30), width=1)
    img.save(os.path.join(OUT, name), optimize=True)
    print("wrote", name)


def skyline(name, w, h, seed):
    """Night skyline silhouette with lit windows, baked once."""
    random.seed(seed)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    # far layer
    x = -20
    while x < w:
        bw = random.randint(int(w * 0.04), int(w * 0.09))
        bh = random.randint(int(h * 0.25), int(h * 0.55))
        d.rectangle([x, h - bh, x + bw, h], fill=(16, 34, 72, 255))
        x += bw + random.randint(2, 10)
    # near layer with windows
    x = -30
    while x < w:
        bw = random.randint(int(w * 0.05), int(w * 0.11))
        bh = random.randint(int(h * 0.35), int(h * 0.9))
        top = h - bh
        d.rectangle([x, top, x + bw, h], fill=(9, 22, 52, 255))
        d.line([(x + 1, top), (x + 1, h)], fill=(67, 197, 245, 70), width=2)
        if random.random() < 0.35:
            d.rectangle([x + bw * 0.4, top - bh * 0.08, x + bw * 0.6, top], fill=(9, 22, 52, 255))
            d.line([(x + bw * 0.5, top - bh * 0.16), (x + bw * 0.5, top - bh * 0.08)], fill=(40, 70, 120, 255), width=3)
        for wy in range(int(top + 14), h - 10, 18):
            for wx in range(int(x + 8), int(x + bw - 8), 14):
                r = random.random()
                if r < 0.18:
                    d.rectangle([wx, wy, wx + 6, wy + 8], fill=(255, 196, 130, random.randint(90, 200)))
                elif r < 0.30:
                    d.rectangle([wx, wy, wx + 6, wy + 8], fill=(150, 210, 245, random.randint(50, 120)))
        x += bw + random.randint(4, 18)
    img.save(os.path.join(OUT, name), optimize=True)
    print("wrote", name)


def crowd(name, w, h, seed):
    """Silhouetted 1850s crowd (top hats, bonnets) baked once."""
    random.seed(seed)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")
    for row, (col, yb, sc) in enumerate([((22, 34, 66, 255), 0.55, 0.8), ((12, 22, 48, 255), 0.78, 1.0), ((6, 13, 32, 255), 1.0, 1.25)]):
        x = -20 + row * 17
        while x < w + 40:
            s = sc * random.uniform(0.85, 1.1)
            cx = x
            base = h * yb + 30
            head_y = base - 120 * s
            d.ellipse([cx - 40 * s, head_y + 30 * s, cx + 40 * s, base + 80 * s], fill=col)  # shoulders
            d.ellipse([cx - 15 * s, head_y, cx + 15 * s, head_y + 34 * s], fill=col)  # head
            kind = random.random()
            if kind < 0.45:  # top hat
                d.rectangle([cx - 12 * s, head_y - 34 * s, cx + 12 * s, head_y + 6 * s], fill=col)
                d.rectangle([cx - 21 * s, head_y + 2 * s, cx + 21 * s, head_y + 8 * s], fill=col)
            elif kind < 0.7:  # bonnet
                d.ellipse([cx - 21 * s, head_y - 8 * s, cx + 21 * s, head_y + 30 * s], fill=col)
            elif kind < 0.85:  # bowler
                d.ellipse([cx - 15 * s, head_y - 14 * s, cx + 15 * s, head_y + 12 * s], fill=col)
                d.rectangle([cx - 20 * s, head_y + 2 * s, cx + 20 * s, head_y + 7 * s], fill=col)
            x += random.uniform(52, 78) * sc
    img.save(os.path.join(OUT, name), optimize=True)
    print("wrote", name)


if __name__ == "__main__":
    glow("glow_cyan.png", CYAN)
    glow("glow_orange.png", ORANGE)
    glow("glow_white.png", WHITE, power=2.8)
    background("bg_landscape.jpg", 1920, 1080, (0.62, 0.28), 8)
    background("bg_portrait.jpg", 1080, 1920, (0.5, 0.3), 9)
    blueprint_grid("grid_landscape.png", 1920, 1080)
    blueprint_grid("grid_portrait.png", 1080, 1920)
    skyline("skyline_landscape.png", 2200, 700, 21)
    skyline("skyline_portrait.png", 1400, 1100, 22)
    crowd("crowd_landscape.png", 2000, 300, 31)
    crowd("crowd_portrait.png", 1200, 300, 32)
