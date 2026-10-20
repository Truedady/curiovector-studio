"""Pre-rasterize every expensive static layer for episode 010.

All soft light, blur and glow is baked here ONCE so the Remotion
compositions only animate transforms/opacity of cached bitmaps.

Run:  python3 -I tools/make_assets.py   (from the episode folder)
Output: public/img/*.jpg|png
"""
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img")
os.makedirs(OUT, exist_ok=True)

NAVY = np.array([8, 19, 47], dtype=np.float32)
CYAN = np.array([67, 197, 245], dtype=np.float32)
ORANGE = np.array([255, 146, 62], dtype=np.float32)
WHITE = np.array([248, 250, 255], dtype=np.float32)


def save_rgb(arr, name, q=90):
    # light dither to avoid banding in smooth gradients
    noise = np.random.default_rng(7).normal(0, 1.1, arr.shape)
    img = Image.fromarray(np.clip(arr + noise, 0, 255).astype(np.uint8), "RGB")
    img.save(os.path.join(OUT, name), quality=q, optimize=True, progressive=True)


def grid(w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return x / w, y / h


def radial(w, h, cx, cy, r, aspect=1.0):
    x, y = grid(w, h)
    d = np.sqrt(((x - cx) * aspect) ** 2 + (y - cy) ** 2) / r
    return np.clip(1 - d, 0, 1) ** 2


def vignette(w, h, strength=0.55):
    x, y = grid(w, h)
    d = np.sqrt(((x - 0.5) * 1.2) ** 2 + (y - 0.5) ** 2)
    return 1 - strength * np.clip((d - 0.25) / 0.6, 0, 1) ** 1.6


def mix(base, color, a):
    return base * (1 - a[..., None]) + color * a[..., None]


# ---------------------------------------------------------------- ocean
def ocean(w, h, name, shafts=9):
    x, y = grid(w, h)
    top = np.array([16, 58, 104], dtype=np.float32)
    mid = np.array([9, 30, 66], dtype=np.float32)
    deep = np.array([4, 10, 28], dtype=np.float32)
    t = y[..., None]
    arr = np.where(t < 0.45, top * (1 - t / 0.45) + mid * (t / 0.45),
                   mid * (1 - (t - 0.45) / 0.55) + deep * ((t - 0.45) / 0.55))
    # god rays, drawn small then blurred and upscaled (cheap, offline)
    sw, sh = w // 4, h // 4
    rays = Image.new("L", (sw, sh), 0)
    d = ImageDraw.Draw(rays)
    rnd = random.Random(10 + w)
    for i in range(shafts):
        cx = rnd.uniform(0.05, 0.95) * sw
        spread = rnd.uniform(0.04, 0.11) * sw
        lean = rnd.uniform(-0.18, 0.18) * sw
        val = rnd.randint(40, 95)
        d.polygon([(cx - spread * 0.3, 0), (cx + spread * 0.3, 0),
                   (cx + lean + spread, sh * 0.95), (cx + lean - spread, sh * 0.95)], fill=val)
    rays = rays.filter(ImageFilter.GaussianBlur(sw * 0.02)).resize((w, h), Image.BICUBIC)
    r = np.asarray(rays, dtype=np.float32) / 255.0
    r *= np.clip(1 - y * 1.15, 0, 1) ** 1.4
    arr = mix(arr, np.array([90, 190, 235], dtype=np.float32), r * 0.55)
    # surface caustic glow
    arr = mix(arr, CYAN, radial(w, h, 0.5, -0.1, 0.75, w / h) * 0.25)
    # marine snow (static specks)
    rng = np.random.default_rng(3)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    dd = ImageDraw.Draw(img, "RGBA")
    for _ in range(int(w * h / 5200)):
        px, py = rng.uniform(0, w), rng.uniform(0, h)
        rr = rng.uniform(0.6, 2.2)
        a = int(rng.uniform(20, 90))
        dd.ellipse([px - rr, py - rr, px + rr, py + rr], fill=(200, 230, 255, a))
    arr = np.asarray(img, dtype=np.float32)
    arr *= vignette(w, h, 0.5)[..., None]
    save_rgb(arr, name)


# ---------------------------------------------------------------- space
def space(w, h, name):
    x, y = grid(w, h)
    arr = np.ones((h, w, 3), np.float32) * np.array([5, 11, 30], np.float32)
    arr = mix(arr, np.array([18, 44, 96], np.float32), radial(w, h, 0.25, 0.3, 0.9, w / h) * 0.6)
    arr = mix(arr, np.array([60, 40, 70], np.float32), radial(w, h, 0.85, 0.15, 0.5, w / h) * 0.25)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    dd = ImageDraw.Draw(img, "RGBA")
    rng = np.random.default_rng(11)
    for _ in range(int(w * h / 2600)):
        px, py = rng.uniform(0, w), rng.uniform(0, h)
        rr = rng.choice([0.6, 0.8, 1.0, 1.3, 1.8], p=[0.35, 0.3, 0.2, 0.1, 0.05])
        a = int(rng.uniform(60, 230))
        tint = (255, 255, 255) if rng.random() > 0.2 else (170, 220, 255)
        dd.ellipse([px - rr, py - rr, px + rr, py + rr], fill=tint + (a,))
    arr = np.asarray(img, np.float32) * vignette(w, h, 0.45)[..., None]
    save_rgb(arr, name)


# ---------------------------------------------------------------- studio navy
def studio(w, h, name):
    arr = np.ones((h, w, 3), np.float32) * NAVY
    arr = mix(arr, np.array([22, 60, 112], np.float32), radial(w, h, 0.5, 0.42, 0.85, w / h) * 0.7)
    arr = mix(arr, CYAN, radial(w, h, 0.5, 0.45, 0.45, w / h) * 0.12)
    arr *= vignette(w, h, 0.6)[..., None]
    save_rgb(arr, name)


# ---------------------------------------------------------------- sprites
def sprite(color, name, size=256, falloff=2.2, core=0.0):
    x, y = grid(size, size)
    d = np.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2) / 0.5
    a = np.clip(1 - d, 0, 1) ** falloff
    if core:
        a = np.maximum(a, np.clip(1 - d / core, 0, 1) ** 0.8)
    rgba = np.zeros((size, size, 4), np.uint8)
    rgba[..., :3] = color.astype(np.uint8)
    rgba[..., 3] = np.clip(a * 255, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name), optimize=True)


def ring(name, size=1024, inner=0.78, color=CYAN):
    """Soft atmosphere halo for the globe (r = 0.5 at the image edge)."""
    x, y = grid(size, size)
    d = np.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2) / 0.5
    outside = np.clip((1 - d) / (1 - inner), 0, 1) ** 2.4 * (d >= inner)
    inside = np.clip((d - inner * 0.7) / (inner * 0.3), 0, 1) ** 3 * (d < inner)
    a = outside + inside * 0.55
    rgba = np.zeros((size, size, 4), np.uint8)
    rgba[..., :3] = color.astype(np.uint8)
    rgba[..., 3] = np.clip(a * 255, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name), optimize=True)


def beam(name, w=64, h=512, color=CYAN):
    """Vertical soft light beam (sat downlink / headline light)."""
    x, y = grid(w, h)
    a = np.clip(1 - np.abs(x - 0.5) / 0.5, 0, 1) ** 2 * (0.25 + 0.75 * (1 - y))
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., :3] = color.astype(np.uint8)
    rgba[..., 3] = np.clip(a * 255, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name), optimize=True)


if __name__ == "__main__":
    ocean(1920, 1080, "ocean_wide.jpg")
    ocean(1080, 1920, "ocean_tall.jpg", shafts=7)
    space(1920, 1080, "space_wide.jpg")
    space(1080, 1920, "space_tall.jpg")
    studio(1920, 1080, "studio_wide.jpg")
    studio(1080, 1920, "studio_tall.jpg")
    sprite(CYAN, "glow_cyan.png")
    sprite(ORANGE, "glow_orange.png")
    sprite(WHITE, "glow_white.png", falloff=3.0, core=0.12)
    ring("atmo_ring.png")
    beam("beam_cyan.png")
    print("assets written to", os.path.normpath(OUT))
