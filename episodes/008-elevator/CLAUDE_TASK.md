# CLAUDE CODE — PRODUCTION TASK 008
# WHAT STOPS AN ELEVATOR WHEN THE CABLE SNAPS?

You are the head motion-graphics director and senior Remotion engineer of **CurioVector**, a premium illustrated science YouTube channel.

Read this WHOLE task file, then `episodes/008-elevator/script.txt`, `episodes/008-elevator/EPISODE_BRIEF.md`, `docs/CURIOVECTOR_STYLE.md`, `docs/RENDER_PERFORMANCE.md` and `docs/FIVE_PARALLEL_EPISODES.md` before writing code.

## ABSOLUTE ISOLATION — FIVE CLAUDE SESSIONS RUN IN PARALLEL

Repository: `Truedady/curiovector-studio`.
Your specific target BASE branch is `episode/008-elevator`.
Your exclusive source/output working directory is `episodes/008-elevator/`.

Validate the repository and target base branch. Claude Code Cloud may generate its own task branch *based on the chosen branch*: this is fine, **provided its base is `episode/008-elevator`**. Do not edit main, sibling episodes, shared `docs/`, root `src/`, or root `package.json`; do not merge any branches. Never delete or overwrite another episode's code/audio/art. Commit your episode-specific source changes to the correct task branch only; do not auto-merge.

## REQUIRED VOICEOVER — BATCH AUDIO, ONE MANUAL UPLOAD FOR FIVE SESSIONS

The user has a single ZIP uploaded to the ROOT of `main`:
`curiovector_voiceovers_007-011.zip`

It contains `voiceovers/008-elevator.mp3` and `manifest.json`. This archive is NOT expected on the selected episode branch because it was uploaded to main after those branches were created.

**Before ANY rendering**:

1. Confirm `episodes/008-elevator/script.txt` exists and begins with the expected episode-specific hook from the brief.
2. Fetch the newest root main branch commit **without merging its changes into your branch**:
   `git fetch origin main --no-tags`
3. Extract the single archive into a temporary file via:
   `git show FETCH_HEAD:curiovector_voiceovers_007-011.zip > /tmp/curiovector_voiceovers_007-011.zip`
   If unavailable, STOP and tell user to upload the ZIP to main. Do not start rendering or download random audio.
4. Extract only YOUR entry:
   `unzip -p /tmp/curiovector_voiceovers_007-011.zip voiceovers/008-elevator.mp3 > episodes/008-elevator/voiceover.mp3`
   If unzip isn't installed, use standard Python `zipfile`.
5. Check MP3 nonempty, ffprobe valid and duration about **104.986063 seconds**. Verify SHA256 exactly:
   `fda747fac5e14987087465c310c3179a6ddb872ab3dd61d0bf6b9dadbc1c86a7`
   Check the archive manifest's duration and SHA too. If any check fails, STOP.
6. The MP3 is approved and FINAL. Do **not** alter voiceover, narrator, speech rate or English narration. No automated regeneration or transcription downloads. Do not confuse episodes. This extracted `voiceover.mp3` is ignored by git; the original MP3 is preserved in the uploaded zip on main.

## FINAL TWO VIDEOS — ONE VOICEOVER, TWO INDEPENDENT COMPOSITIONS

Composition A: `CV008ElevatorLandscape`, 1920x1080 / 30 fps / H.264 MP4 + AAC audio.
Export: `CurioVector_E08_Elevator_16x9.mp4`.

Composition B: `CV008ElevatorShorts`, 1080x1920 / 30 fps / H.264 MP4 + AAC audio.
Export: `CurioVector_E08_Elevator_9x16.mp4`.

Both use the exact supplied audio, identical duration, narration timing, science facts and meaningful transitions. Native geometry and different editorial illustration layouts for landscape and Shorts, not a center-cropped wide video and not an empty vertical canvas. Apply mobile-safe headline areas.

Do not make a brand intro; **hook within the first 3–5 seconds**. No commentary or slow splash screen. The video should be captivating and scientifically faithful. Respect the specific scene list and source limitations in `EPISODE_BRIEF.md`.

## CREATIVE STANDARD

Premium bespoke 2D illustrated storytelling, not a slideshow or stock templates.
Brand colors: navy `#08132F`, electric cyan `#43C5F5`, warm orange `#FF923E`, off-white `#F8FAFF`.
Beautiful, substantial central objects, strong cinematic light, original premium artwork, controlled elegant motion, highly readable US-English text. New visual or narrative discovery every 10–20 seconds. Keep the aesthetic of previous CurioVector airplane/eye/butterfly episodes. No general "AI science" filler pictures; animate the **specific mechanism described in the brief**.

NO expensive frame-by-frame scene-wide SVG blurs, 90px box shadows, giant CSS blur/filter layers or multilayer masks; previous projects dropped to 1.1 FPS and took nearly 2 hours. Pre-rasterize expensive static illustrated glows and light, use animated transforms/opacity of cached layers, and make complex visual representations efficient. Do not sacrifice storytelling or visual quality; choose better engineering.

## TECHNICAL AND RESOURCE RULES

The shared root Remotion project may not yet be configured on main; verify rather than assume. If a tested root package exists on your actual branch, reuse it **read-only**. Otherwise build a complete self-contained Remotion + React + TypeScript project **inside `episodes/008-elevator/` only**, never at root, to prevent five simultaneous tasks modifying one package.json/lockfile. One install per isolated environment is acceptable; do not repeatedly reinstall or create duplicate scaffolds.

The other four jobs must remain free to run in parallel. Never edit root files to "fix" your app. Use episode-local configuration and unique component IDs/names.

Use ffprobe to inspect the MP3 duration and align scene beats/sentences once. Don't reuse audio timing from another episode. Avoid repeated heavy speech transcription, installing downloaded speech-recognition models, or external API-dependent software.

Recommended production pipeline:
1. Validate branch, script, ZIP, MP3, SHA256 and brief.
2. Build full original scene sequence using actual MP3 duration as master.
3. Write both native 16:9 and 9:16 compositions, with shared timeline but different art direction/placement.
4. Typecheck and render 3 stills for EACH format: hook, main discovery and finale.
5. Visually inspect the six stills. Fix meaningful layout or scientific errors.
6. Benchmark ~150 frames (including heaviest section) at full target resolution. Measure actual frames per second in both formats; target >=5–8 FPS, report estimate and optimize obvious costly implementation if slow. This is a target, not a guarantee.
7. Once compositions are verified, render FINAL landscape once and final Shorts once (avoid two simultaneous resource-heavy renders on limited hardware).
8. Validate both files with ffprobe: dimensions, duration, framerate, audio stream.
9. Preserve source code and give **verified** artifact/download paths. Do not claim exported videos are in GitHub if they are too large or were not pushed.
10. Commit only project-local source and assets on this task's working branch; never push generated huge MP4s or node_modules.

**Never** rerun a successful full render or create duplicate processes without explicit necessity. Avoid infinite `pgrep -f` monitoring and expensive retries. If there is a rendering bottleneck, report cause and optimize before final output. If the cloud task times out, preserve the source and tell user exactly what remains.

## FINISHED OUTPUT REPORT

Report only after checking files:
- Correct audio filename, measured duration and SHA.
- Which branch and folder were modified.
- Both composition IDs and exact video dimensions.
- Benchmarked FPS and actual render times.
- Verified file names and download instructions for both MP4s.
- Any scientific caveat raised in the brief.

**BEGIN:** First verify the intended Git branch, then read `episodes/008-elevator/EPISODE_BRIEF.md` and fetch the shared voiceover archive from main. Do not start rendering before the required ZIP exists.
