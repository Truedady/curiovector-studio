# Episode 008: What Stops an Elevator When the Cable Snaps?

A self-contained Remotion + React + TypeScript project. It is isolated in this folder so the five parallel episode sessions never share a `package.json` or lockfile.

## Compositions
| ID | Size | FPS | Output |
|---|---|---|---|
| `CV008ElevatorLandscape` | 1920×1080 | 30 | `out/CurioVector_E08_Elevator_16x9.mp4` |
| `CV008ElevatorShorts` | 1080×1920 | 30 | `out/CurioVector_E08_Elevator_9x16.mp4` |

Both formats run on one 3150-frame timeline (`src/timeline.ts`), measured once from the approved voiceover (104.986063 s). Each scene in `src/scenes/` has its own native layout for 16:9 and 9:16.

## Setup
```bash
cd episodes/008-elevator
git fetch origin main --no-tags
git show FETCH_HEAD:curiovector_voiceovers_007-011.zip > /tmp/cv.zip
unzip -p /tmp/cv.zip voiceovers/008-elevator.mp3 > voiceover.mp3
sha256sum voiceover.mp3   # fda747fac5e14987087465c310c3179a6ddb872ab3dd61d0bf6b9dadbc1c86a7
cp voiceover.mp3 public/voiceover.mp3   # ignored by git
npm install
npm run assets        # optional: re-bake the PNG/JPG light layers in public/
npm run typecheck
npm run render:landscape
npm run render:shorts
```
Review stills: `node scripts/stills.mjs L 90,1780 P 90,1780`, then `python3 scripts/sheet.py L out/stills/sheet.png`.

## Performance
Soft glows, vignettes, the skyline and the crowd are pre-rasterized by `scripts/make_assets.py`. The compositions use no CSS or SVG blur filters, no masks and no large shadows. Moving parts are light vector pieces animated by transform and opacity.

## Science notes
- The video shows a conventional **traction** elevator. Real designs vary by elevator type.
- Several hoist ropes with safety margins mean a single damaged rope is not automatic free fall.
- Overspeed governor → governor rope gripped → linkage lifts the safety-gear wedges → wedges clamp the **guide rails**. Nothing squeezes the hoist rope.
- The machine brake is shown separately: it is spring-applied when power is lost and is not the overspeed safety.
- The 1854 New York scene is a historically inspired illustration of Otis's wagon-spring and ratchet catch. The cut and the small drop are shown in slow motion.
- Sources: https://www.otis.com/en/us/our-company/history and https://www.otis.com/en/us/products-services/products/elevators
