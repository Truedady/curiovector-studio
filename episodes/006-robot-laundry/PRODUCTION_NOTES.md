# Episode 006 — production notes

Self-contained Remotion 4.0.290 app (no shared root existed; nothing outside this folder was changed).

## Build
```
npm ci
npm run typecheck
npm run render:landscape   # out/CurioVector_Robot_Laundry_16x9.mp4
npm run render:shorts      # out/CurioVector_Robot_Laundry_9x16.mp4
```
`npm run audio` copies `Robot shirt.mp3` into the git-ignored `public/` (Remotion's static server does not follow symlinks).

## Timing
Audio master 109.09 s → 3273 frames @ 30 fps. Sentence boundaries: ffmpeg `silencedetect` (−35 dB, 0.25 s) fitted to `script.txt` once; stored in `src/lib/timing.ts` and shared by both compositions.

| Scene | Seconds | Beat |
|---|---|---|
| hook | 0–5.1 | human folds in seconds / robot loses the sleeve, then the hem |
| ai | 5.1–18.4 | selected abstract tasks: code, exams, data (capabilities vary) |
| question | 18.4–28.9 | why laundry? mesh reveals countless shapes |
| human | 28.9–40.2 | shape, weight, bends, drapes, next move |
| see | 40.2–55.9 | robot camera, keypoints, hidden edges, shape changes on touch |
| predict | 55.9–65.8 | same pull → sleeve flips / bunches / slides |
| control | 65.8–75.3 | grip, friction, angle, tension, force; small angle change → slip |
| equation | 75.3–90.5 | equation stays still vs shirt keeps changing (metaphor, not benchmark) |
| scoreboard | 90.5–97.9 | chess, calculations, patterns vs laundry |
| closing | 97.9–109.1 | robot folds successfully; see+predict+control = physical intelligence |

## Verified render (ffprobe)
- 16:9 — 1920×1080, h264 30 fps, 109.10 s video, AAC audio, 25 MB
- 9:16 — 1080×1920, h264 30 fps, 109.10 s video, AAC audio, 26 MB
- Audio mean −22.6 dB in both (narration present)

MP4s are not committed (repo ignores *.mp4).
