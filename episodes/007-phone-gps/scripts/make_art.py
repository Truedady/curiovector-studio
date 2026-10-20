"""Pre-rasterize every expensive soft-light layer for CV007 once.

The Remotion scenes only move/fade these PNGs (transform + opacity), so no
per-frame blur or filter is ever computed by Chromium.

Usage: python3 -I scripts/make_art.py public/art
"""
import math
import os
import random
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/art"
os.makedirs(OUT, exist_ok=True)
random.seed(7)

NAVY = (8, 19, 47)
CYAN = (67, 197, 245)
ORANGE = (255, 146, 62)
WHITE = (248, 250, 255)
BLUE = (40, 120, 255)


def save(img, name):
    img.save(os.path.join(OUT, name), optimize=True)
    print("wrote", name, img.size)


def glow(name, rgb, size=512, power=2.2, core=0.0):
    """Radial glow sprite: premultiplied-looking soft falloff in the alpha channel."""
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    c = (size - 1) / 2
    r = np.sqrt((x - c) ** 2 + (y - c) ** 2) / c
    a = np.clip(1 - r, 0, 1) ** power
    if core:
        a = np.maximum(a, np.clip(1 - r / core, 0, 1) ** 0.8)
    arr = np.zeros((size, size, 4), np.uint8)
    arr[..., 0], arr[..., 1], arr[..., 2] = rgb
    arr[..., 3] = (a * 255).astype(np.uint8)
    save(Image.fromarray(arr, "RGBA"), name)


def starfield(name, w, h, n):
    img = Image.new("RGB", (w, h), NAVY)
    # Deep space gradient + two soft nebula clouds (blurred once, here).
    neb = Image.new("RGB", (w, h), (0, 0, 0))
    d = ImageDraw.Draw(neb)
    for cx, cy, rad, col in [
        (0.22, 0.25, 0.42, (20, 60, 120)),
        (0.80, 0.70, 0.38, (60, 34, 70)),
        (0.62, 0.18, 0.25, (16, 70, 110)),
    ]:
        R = rad * max(w, h)
        d.ellipse([cx * w - R, cy * h - R, cx * w + R, cy * h + R], fill=col)
    neb = neb.filter(ImageFilter.GaussianBlur(max(w, h) * 0.12))
    base = np.asarray(img, np.float32)
    yy = np.linspace(0, 1, h)[:, None, None]
    base = base * (1.05 - 0.45 * yy) + np.asarray(neb, np.float32) * 0.55
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    stars_layer = img
    for _ in range(n):
        x, y = random.random() * w, random.random() * h
        m = random.random() ** 3
        r = 0.6 + m * 1.9
        b = int(120 + 135 * m)
        tint = random.choice([(b, b, b), (b - 30, b - 5, b), (b, b - 20, b - 50)])
        d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(max(0, t) for t in tint))
    # Bake the edge vignette here instead of compositing a full-frame overlay per frame.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx, ny = (xx / w - 0.5) * 2, (yy / h - 0.5) * 2
    v = np.clip((np.sqrt(nx ** 2 * 0.8 + ny ** 2 * 0.8) - 0.55) / 0.85, 0, 1) ** 1.6 * 0.7
    arr = np.asarray(img, np.float32)
    arr = arr * (1 - v[..., None]) + np.array([3, 8, 22], np.float32) * v[..., None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    save(img, name)


def vignette(name, w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    nx, ny = (x / w - 0.5) * 2, (y / h - 0.5) * 2
    r = np.sqrt(nx ** 2 * 0.8 + ny ** 2 * 0.8)
    a = np.clip((r - 0.55) / 0.85, 0, 1) ** 1.6 * 0.85
    arr = np.zeros((h, w, 4), np.uint8)
    arr[..., 0], arr[..., 1], arr[..., 2] = (3, 8, 22)
    arr[..., 3] = (a * 255).astype(np.uint8)
    save(Image.fromarray(arr, "RGBA"), name)


def earth_atmo(name, size=1600):
    """Thin atmospheric rim glow for a planet disc of diameter 0.8*size."""
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    c = (size - 1) / 2
    r = np.sqrt((x - c) ** 2 + (y - c) ** 2) / (size * 0.4)
    inside = np.clip((r - 0.86) / 0.14, 0, 1) ** 2 * (r <= 1)
    outside = np.exp(-((r - 1) / 0.06) ** 2) * (r > 1)
    a = np.clip(inside * 0.9 + outside, 0, 1)
    arr = np.zeros((size, size, 4), np.uint8)
    arr[..., 0], arr[..., 1], arr[..., 2] = (110, 205, 255)
    arr[..., 3] = (a * 235).astype(np.uint8)
    save(Image.fromarray(arr, "RGBA"), name)


def light_beam(name, w=400, h=1400, rgb=CYAN):
    """Soft vertical beam / light shaft, fades to the bottom and edges."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = np.abs(x / w - 0.5) * 2
    a = np.clip(1 - nx, 0, 1) ** 2.5 * np.clip(1 - y / h, 0, 1) ** 0.8
    arr = np.zeros((h, w, 4), np.uint8)
    arr[..., 0], arr[..., 1], arr[..., 2] = rgb
    arr[..., 3] = (a * 200).astype(np.uint8)
    save(Image.fromarray(arr, "RGBA"), name)


glow("glow_cyan.png", CYAN)
glow("glow_orange.png", ORANGE)
glow("glow_white.png", WHITE, power=3.0)
glow("glow_blue.png", BLUE, power=1.8, core=0.18)
starfield("stars_wide.png", 2400, 1350, 1100)
starfield("stars_tall.png", 1350, 2400, 1100)
earth_atmo("earth_atmo.png")



def octave_noise(w, h, octaves, seed):
    """Smooth value noise: random low-res grids upsampled bicubically in float mode."""
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    for cells, amp in octaves:
        grid = rng.random((max(2, int(cells * h / w)), cells)).astype(np.float32)
        img = Image.fromarray(grid, "F").resize((w, h), Image.BICUBIC)
        acc += np.asarray(img, np.float32) * amp
    acc -= acc.mean()
    return acc / (acc.std() + 1e-6)


def earth(name, size=1400):
    """Stylized editorial Earth: navy oceans, muted teal land, soft clouds, lit from upper-left."""
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    c = (size - 1) / 2
    R = size * 0.5 - 2
    nx, ny = (x - c) / R, (y - c) / R
    rr = nx ** 2 + ny ** 2
    inside = rr <= 1
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    light = np.array([-0.55, -0.62, 0.56])
    light /= np.linalg.norm(light)
    lam = np.clip(nx * light[0] + ny * light[1] + nz * light[2], 0, 1)
    shade = 0.16 + 0.95 * lam ** 0.85

    # Equirectangular textures sampled through the sphere (continents curve with the globe).
    TW, TH = 2048, 1024
    land_tex = octave_noise(TW, TH, [(7, 1.0), (16, 0.5), (40, 0.22), (110, 0.08)], 11)
    cloud_tex = octave_noise(TW, TH, [(24, 1.0), (60, 0.5), (140, 0.2)], 29)
    lon = np.arctan2(nx, nz) + 0.6
    lat = np.arcsin(np.clip(ny, -1, 1))
    u = (((lon + np.pi) / (2 * np.pi)) * (TW - 1)).astype(np.int32)
    v = ((lat / np.pi + 0.5) * (TH - 1)).astype(np.int32)
    lf = land_tex[v, u]
    cf = cloud_tex[v, u]

    land = lf > 0.3
    coast = (np.abs(lf - 0.3) < 0.06) & ~land
    clouds = np.clip((cf - 1.35) * 0.9, 0, 0.35)

    ocean_hi = np.array([20, 66, 130], np.float32)
    ocean_deep = np.array([10, 30, 76], np.float32)
    depth = np.clip(lf * 0.35 + 0.55, 0, 1)[..., None]
    col = ocean_deep * (1 - depth) + ocean_hi * depth
    land_c = np.array([38, 118, 126], np.float32)
    land_hi = np.array([156, 150, 104], np.float32)
    hi = np.clip((lf - 0.9) * 1.2, 0, 1)[..., None]
    col = np.where(land[..., None], land_c * (1 - hi) + land_hi * hi, col)
    col = np.where(coast[..., None], col * 0.55 + np.array([67, 197, 245]) * 0.45, col)
    col = col * shade[..., None]
    col = col * (1 - clouds[..., None]) + np.array([235, 242, 255]) * clouds[..., None] * (0.2 + shade[..., None])
    rim = np.clip((np.sqrt(rr) - 0.8) / 0.2, 0, 1) ** 2.4
    col = col * (1 - rim[..., None] * 0.55) + np.array([90, 200, 255]) * rim[..., None] * 0.55 * (0.3 + lam[..., None])
    rng = np.random.default_rng(5)
    night = (lam < 0.06) & land & inside & (rng.random((size, size)) > 0.996)
    col[night] = [255, 186, 110]

    alpha = np.clip((1 - np.sqrt(rr)) * R / 1.5, 0, 1)
    arr = np.zeros((size, size, 4), np.uint8)
    arr[..., :3] = np.clip(col, 0, 255).astype(np.uint8)
    arr[..., 3] = (alpha * 255).astype(np.uint8)
    save(Image.fromarray(arr, "RGBA"), name)


earth("earth.png")
