# E07 — Production notes (episode-local Remotion project)

## Voiceover (verified before any render)
- Source: `curiovector_voiceovers_007-011.zip` on `main` → entry `voiceovers/007-gps.mp3`
- Extracted to `voiceover.mp3` (git-ignored) and copied to `public/voiceover.mp3` (git-ignored)
- Duration 97.488938 s (ffprobe, matches manifest) · SHA256 `c82589af9c67b4e7853199b8ff5771317ce9097066d34140b26eba73f034cb01` (matches task + manifest)
- Sentence cues aligned once with ffmpeg `silencedetect` → `src/timing.ts`

## Compositions
| ID | Size | FPS | Frames | Output |
|---|---|---|---|---|
| `CV007GPSLandscape` | 1920×1080 | 30 | 2925 | `out/CurioVector_E07_Phone_GPS_16x9.mp4` |
| `CV007GPSShorts` | 1080×1920 | 30 | 2925 | `out/CurioVector_E07_Phone_GPS_9x16.mp4` |

## Rebuild
```bash
cd episodes/007-phone-gps
npm ci
cp voiceover.mp3 public/voiceover.mp3            # after extracting from the main-branch zip
python3 -I scripts/make_art.py public/art        # glows, starfield, Earth (only if art changes)
node scripts/export_art.mjs                      # bake phone + mountains PNGs (only if art changes)
npx remotion render src/index.ts CV007GPSLandscape out/CurioVector_E07_Phone_GPS_16x9.mp4
npx remotion render src/index.ts CV007GPSShorts    out/CurioVector_E07_Phone_GPS_9x16.mp4
```
In Claude Code Cloud set `CV_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

## Performance
- Root cause of the first slow benchmark (1.7 fps): the `swangle` GL backend. `angle` is ~25× faster here.
- Also removed per-frame cost: radial-gradient fills on ~1000 px range spheres → layered strokes;
  vignette baked into the starfield; mountains and phone body/map baked to PNG (`ArtExport.tsx`).
- 150-frame benchmark of the heaviest section (61–66 s), wall clock incl. ~10 s bundling:
  landscape 15.8 s (9.5 fps), Shorts 15.4 s (9.7 fps).
- Full renders: landscape 188 s, Shorts 207 s.

## Science caveats kept on screen / in narration
- Satellites only broadcast position + time; the phone is receive-only (no tracking).
- Map tiles may not load offline even though GNSS positioning works.
- GPS is one of several GNSS constellations phones may use.
- ≥4 satellites solve 3D position **and** receiver clock bias (shown as equal range inflation that collapses when Δt is solved).
- Time-of-flight numbers are illustrative: 0.070 s × ~300,000 km/s ≈ 21,000 km; 1 ms clock error ≈ 300 km.
- GPS altitude ≈ 20,200 km (gps.gov), speed ≈ 14,000 km/h. Relativity shown conceptually; clock offsets labelled illustrative, no drift figures.
- Clear sky works best; buildings, roofs and dense trees can block or bounce signals.
- Trilateration geometry is a 2D cross-section, labelled "not to scale".
