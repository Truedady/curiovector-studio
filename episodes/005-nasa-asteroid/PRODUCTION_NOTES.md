# Episode 005 — production notes

## What was built

A self-contained Remotion app in `episodes/005-nasa-asteroid/remotion/` (pinned `remotion@4.0.532`, React 18.3.1, Inter via `@fontsource/inter`). The root repo has no shared Remotion toolchain yet, so nothing outside this folder was touched.

| Composition | Size | Output |
|---|---|---|
| `CurioVectorNASA005Landscape` | 1920×1080, 30 fps | `out/CurioVector_NASA_Asteroid_16x9.mp4` |
| `CurioVectorNASA005Shorts` | 1080×1920, 30 fps | `out/CurioVector_NASA_Asteroid_9x16.mp4` |

Both compositions are the same `Episode` component with `vertical` switching every scene's placement and scale. Timing, facts and transitions are shared, and each format has its own layout. `Nasa.mp3` (122.83 s, unchanged) is the master clock: 3,685 frames.

## Timeline

`src/timeline.ts` holds one speech onset per sentence. I took them from a single `silencedetect` pass (−35 dB, 0.25 s) and matched them to `script.txt` line by line. Scene boundaries sit on sentence onsets:

| Scene | Starts | Beat |
|---|---|---|
| Hook | 0.00 | DART hits Dimorphos at 2.35 s; ejecta; orbit arcs bend; "DART IMPACT — 2022" |
| Mission | 10.51 | DART acronym; launch Nov 24 2021 · impact Sept 26 2022 |
| Binary | 17.20 | Didymos ≈ 780 m, Dimorphos ≈ 160 m; "Neither threatens Earth" |
| Hit it | 27.22 | Targeting reticle: "Hit it. On purpose. Why?" |
| Defense idea | 32.74 | Hypothetical asteroid: destroy (crossed out) vs early nudge → miss |
| Test | 44.22 | Kinetic impactor, momentum, "YES." |
| Orbit reveal | 54.91 | 11 h 55 min → ≈ 11 h 22 min around Didymos; 73 s threshold vs ≈ 33 min |
| Ejecta | 70.10 | Debris plume; DART push + ejecta recoil = total push |
| Sun | 87.88 | Pair's ~770-day solar orbit changed ≈ 0.15 s (kept separate from the 33 min) |
| Finale | 104.23 | Precise hit years ahead; tiny change → big miss; "Needs early detection" |

## Science / editorial checks

- **Spoken imprecision kept as recorded:** the narration says "In 2022, NASA launched a mission called DART." DART launched **Nov 24, 2021** and hit Dimorphos **Sept 26, 2022**. No graphic shows a 2022 launch. The on-screen chip reads "DART IMPACT — 2022", and the mission card gives both dates. If you want the audio to be exact, re-record that one sentence (e.g. "In 2022, a NASA mission called DART…") and replace `Nasa.mp3`. The timeline then needs re-measuring.
- Period change: −33 ± 1 min (Thomas et al., *Nature* 2023), 11 h 55 min → ~11 h 22 min. NASA's early briefing said ~32 min (11 h 23 min). The video follows the peer-reviewed value, which matches the narration's "about 33 minutes".
- The 73-second minimum success benchmark comes from the DART team.
- Heliocentric change: ≈ 0.15 s in the ≈ 770-day orbit of the Didymos–Dimorphos pair (Makadia et al., *Science Advances*; NASA release). The video labels it as different from the 33-minute change.
- Ejecta amplification is shown qualitatively. The caption says "roughly 2–4× the spacecraft's own momentum (published estimates)", because the estimates depend on the asteroid's assumed density.
- Impact speed is shown only as "≈ 6 km/s". Spacecraft mass is omitted because I couldn't confirm it during production.
- Defense and finale diagrams are labelled "Hypothetical asteroid · angles exaggerated" and "Illustration · timeline compressed". Didymos is never shown heading toward Earth.

## Commands

```bash
cd episodes/005-nasa-asteroid/remotion
npm ci                       # once per fresh container
npm run typecheck
./scripts/stills.sh 1.2 62.5 120   # review stills → out/stills/
npm run render:landscape
npm run render:shorts
```

`remotion.config.ts` uses the container's Playwright headless shell when it exists, so no Chrome download is needed. `out/` and `node_modules/` are git-ignored, and rendered MP4s are not committed.

## Not included

No music or sound effects were added: nothing licensed was provided, and the brief forbids unlicensed music. The narration is the only audio track.
