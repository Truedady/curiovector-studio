"""Pre-rasterize every expensive static light effect once.

All glows / vignettes / background plates are baked into PNGs here so the
Remotion compositions only animate transform + opacity of cached bitmaps
(no per-frame SVG blur, CSS filter or giant box-shadow).
"""
import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(OUT, exist_ok=True)

NAVY = np.array([8, 19, 47], dtype=np.float32)
DEEP = np.array([4, 9, 26], dtype=np.float32)
CYAN = np.array([67, 197, 245], dtype=np.float32)
ORANGE = np.array([255, 146, 62], dtype=np.float32)

rng = np.random.default_rng(9)


def plate(w, h, name, light_xy):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    lx, ly = light_xy
    d = np.sqrt(((x - lx * w) / w) ** 2 + ((y - ly * h) / h) ** 2)
    t = np.clip(d / 0.95, 0, 1) ** 1.2
    img = NAVY[None, None, :] * (1 - t[..., None]) + DEEP[None, None, :] * t[..., None]
    # soft cyan key light and warm rim light, baked
    c = np.exp(-(((x - lx * w) / (0.38 * w)) ** 2 + ((y - ly * h) / (0.42 * h)) ** 2))
    o = np.exp(-(((x - (1 - lx) * w) / (0.30 * w)) ** 2 + ((y - 0.95 * h) / (0.30 * h)) ** 2))
    img += CYAN[None, None, :] * 0.10 * c[..., None] + ORANGE[None, None, :] * 0.06 * o[..., None]
    # editorial dot grid
    grid = ((x.astype(int) % 48 == 0) & (y.astype(int) % 48 == 0)).astype(np.float32)
    img += 22 * grid[..., None] * (1 - t[..., None])
    # fine film grain (static, baked)
    img += rng.normal(0, 2.2, size=img.shape).astype(np.float32)
    # vignette
    v = np.clip(1.0 - 0.55 * (((x / w - 0.5) * 2) ** 2 + ((y / h - 0.5) * 2) ** 2) ** 1.4, 0.25, 1)
    img *= v[..., None]
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), optimize=True)


def glow(size, color, name, falloff=2.2, core=0.0):
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    r = np.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2) / (size / 2)
    a = np.clip(1 - r, 0, 1) ** falloff
    if core:
        a = np.clip(a + core * np.clip(1 - r * 4, 0, 1) ** 2, 0, 1)
    rgba = np.zeros((size, size, 4), dtype=np.float32)
    rgba[..., :3] = color
    rgba[..., 3] = a * 255
    Image.fromarray(rgba.astype(np.uint8), "RGBA").save(os.path.join(OUT, name), optimize=True)


plate(1920, 1080, "plate_landscape.png", (0.36, 0.45))
plate(1080, 1920, "plate_shorts.png", (0.5, 0.42))
glow(512, CYAN, "glow_cyan.png")
glow(512, ORANGE, "glow_orange.png")
glow(512, np.array([248, 250, 255], dtype=np.float32), "glow_white.png", falloff=3.0)
glow(256, CYAN, "spark_cyan.png", falloff=3.5, core=0.9)
glow(256, ORANGE, "spark_orange.png", falloff=3.5, core=0.9)
print("assets written to", os.path.abspath(OUT))
