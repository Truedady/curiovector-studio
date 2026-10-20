# Episode 010 — The Internet Is Hiding at the Bottom of the Ocean

Self-contained Remotion + React + TypeScript project, isolated to this folder
(no root `package.json` is touched, so the parallel episodes can't collide).

| Composition | Size | FPS | Output |
|---|---|---|---|
| `CV010InternetLandscape` | 1920×1080 | 30 | `out/CurioVector_E10_Undersea_Internet_16x9.mp4` |
| `CV010InternetShorts` | 1080×1920 | 30 | `out/CurioVector_E10_Undersea_Internet_9x16.mp4` |

Both use the same audio and the same timeline (`src/timing.ts`, 3163 frames = 105.404 s),
but each scene has its own layout for wide and tall.

## Setup

```bash
cd episodes/010-undersea-internet
npm ci
# voiceover (ignored by git) — extract from the archive on main:
git fetch origin main --no-tags
git show FETCH_HEAD:curiovector_voiceovers_007-011.zip > /tmp/cv.zip
unzip -p /tmp/cv.zip voiceovers/010-undersea-internet.mp3 > voiceover.mp3
cp voiceover.mp3 public/voiceover.mp3
# sha256 must be c21a4b778fe455d69a6876bb3280b6be1cfee76c602f5ab39d015025bb824dc3
```

## Commands

- `npm run typecheck`
- `node tools/stills.mjs w:100,1500 t:100,1500` — bundle once, render stills to `out/stills/`
- `npm run render:landscape` / `npm run render:shorts`
- `python3 -I tools/make_assets.py` — regenerate the pre-rasterized backgrounds/glows in `public/img/`

## Scene map (seconds)

| # | Window | Content |
|---|---|---|
| 1 | 0–6.7 | NY → London message; imagined satellite hop gets crossed out; zoom-dive to the Atlantic seafloor cable (ridge, depth counter) |
| 2 | 6.7–19.8 | Internet "in the air": Wi-Fi, cell towers, satellites; imagined sky arcs |
| 3 | 19.8–32.9 | Zoom out: short wireless hop → fiber under streets → hubs/data centers → coast |
| 4 | 32.9–37.2 | Landing station → shelf → abyssal plain ("likely", not certainly) |
| 5 | 37.2–49.0 | Cable stripped to glass fibers; light patterns in the core (simplified bits); repeaters |
| 6 | 49.0–61.5 | Not a giant pipe → garden-hose thick in deep water → labeled cross-section; near-shore armor caveat |
| 7 | 61.5–67.1 | Illustrative world cable corridors (map / globe); "why not satellites?" |
| 8 | 67.1–76.6 | Satellites vital for ships, aircraft, remote places; fiber: huge capacity, lower cost per bit; they complement each other |
| 9 | 76.6–85.2 | Accidental damage: fishing gear, dragged anchor breaks the cable, quakes/landslides |
| 10 | 85.2–93.9 | Traffic reroutes over other cables; single-cable island goes dark |
| 11 | 93.9–105.4 | "The cloud" evaporates → globe pull-back: THE INTERNET HAS A SKELETON |

## Science notes and caveats

- Cable routes are **illustrative corridors** (on-screen note points to submarinecablemap.com); there's no claimed count of active cables and no "99%" figure.
- The narration says data "likely" crosses on the seafloor; the route of any one packet isn't known.
- The bit readout is labelled *simplified*. Real systems use more advanced modulation, but the light stays inside the glass (no photons are shown leaving the fiber).
- The cross-section is a simplified deep-water lightweight design; near shore, cables add steel armor and get much thicker. Size and construction vary with depth.
- Damage causes shown are accidental (fishing, anchors, natural hazards). No sabotage events are depicted.
- The 4,000 m depth counter and ocean profile are illustrative and not to scale.

## Performance

All soft light (ocean god-rays, star fields, studio glows) is baked to JPG/PNG by `tools/make_assets.py`.
The SVGs use only gradients, strokes and transforms: no `filter`, no CSS blur, no masks.
