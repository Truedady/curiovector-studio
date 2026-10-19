# Claude Code Task — CurioVector Episode 005 (NASA DART)

**WORK ONLY IN GIT BRANCH `episode/005-nasa-asteroid`.** Check the actual current branch via `git branch --show-current` BEFORE writing; if it is not this branch, STOP and request the user to select the correct branch. Never modify or merge into main or the robot episode branch. Do not start any other episode.

## Files

Project root: `Truedady/curiovector-studio`
Episode directory: `episodes/005-nasa-asteroid/`

- Narration: `episodes/005-nasa-asteroid/script.txt` (checked in)
- Voiceover: `episodes/005-nasa-asteroid/Nasa.mp3` (user uploads)
- Episode research: `episodes/005-nasa-asteroid/EPISODE_BRIEF.md`
- Visual rules: `docs/CURIOVECTOR_STYLE.md`
- Production efficiency rules: `docs/PRODUCTION_WORKFLOW.md`

**Never look for another episode's script or audio.** Verify `Nasa.mp3` exists before proceeding; do not synthesize new audio, do not invent audio, and do not start a render without it.

## Deliverables

Build two beautiful original SVG/React/Remotion animations with a **single shared narration timeline**:
- `CurioVectorNASA005Landscape` — 1920x1080, 30 fps, exported as `CurioVector_NASA_Asteroid_16x9.mp4`
- `CurioVectorNASA005Shorts` — 1080x1920, 30 fps, exported as `CurioVector_NASA_Asteroid_9x16.mp4`

Use the provided MP3 unchanged. Sync scene boundaries, sound events, and facts across formats. Build native layouts and art direction for vertical; NEVER letterbox, crop wide into tall, or leave large empty halves. Keep Shorts safe areas.

## CurioVector art direction

Cinematic premium editorial illustrations, not generic CGI or slideshow. Palette: navy #08132F, cyan #43C5F5, orange #FF923E, white #F8FAFF. Brilliant cosmic atmosphere, credible geometry, detailed asteroids, dramatic DART impact, dust ejecta and planetary defense path graphics. Modern US English headlines, bold white/orange, clear science diagrams. No opening logo. First 3s must be exceptional.

## Storyboard, follow actual narration not artificial fixed times

1. DART races into Dimorphos in first seconds; surprising collision/push.
2. Introduce binary asteroid system: larger Didymos, moonlet Dimorphos.
3. Earth defense: small change to orbit long in advance can become large miss distance; avoid fake near-Earth danger depiction of this specific target.
4. DART kinetic impact. Use cinematographically clear mass/momentum, no huge asteroid explosion.
5. Show **Dimorphos orbital-period change around Didymos**: BEFORE 11h55m, AFTER 11h22m (about 33min shorter). This is NOT a change of 33 minutes to the asteroid's orbit around the Sun.
6. Dust/rock ejecta created an additional recoil, amplifying momentum transfer.
7. Small measured difference in the asteroid pair's heliocentric period around Sun: about 0.15 sec (2026 findings; do not conflate with 33min).
8. Earth defense conclusion: needs early detection and sufficient time, not guaranteed total protection.

## Scientific factual conflict in approved narration

The recorded script contains: “In 2022, NASA launched a mission called DART...”
**The spacecraft actually launched in November 2021 and collided in September 2022.**

Do NOT put 2022 on a spacecraft-launch date on screen. Keep approved voiceover unchanged and make the graphic say “DART IMPACT — 2022.” Report the spoken imprecision to user at delivery. If user supplies corrected audio, replace it; never silently regenerate or edit speech yourself.

NASA citations:
https://science.nasa.gov/solar-system/asteroids/didymos/
https://www.nasa.gov/missions/dart/nasas-dart-mission-changed-orbit-of-asteroid-didymos-around-sun/

## Efficiency & parallel session safety

Other Claude session is working on `episode/006-robot-laundry` simultaneously.

- All new source, assets, scripts, render outputs and configuration should be under `episodes/005-nasa-asteroid/` only.
- Do not modify shared root `package.json`, root `src`, `docs/`, gitignore, or robot episode.
- If reusable root Remotion is already configured, use it without altering it. If not configured, make a SELF-CONTAINED Remotion app within this episode folder (yes this may require isolated package install once). This avoids write collisions.
- Do not change dependency versions mid-render. Do not commit `node_modules`, credentials, or huge MP4s.
- Use ffprobe once for audio duration, establish sentence alignment once.
- Build both compositions; TypeScript check; render 3 representative stills of EACH aspect ratio (hook, orbit reveal, ending); fix major issues.
- Estimate render time from preview and report if unusually slow; reduce pathological blur/filter cost before final export.
- Render each full MP4 once, sequentially if cloud resources are tight. Don't start duplicate renders; don't infinite-poll or self-match with `pgrep -f`.
- Verify resolution, duration, audio presence and actual files using ffprobe.
- Commit ONLY episode-local source code to `episode/005-nasa-asteroid` and do not auto-merge the branch.
- MP4s may exceed GitHub size limits. If accessible rendering artifacts exist, provide exact downloadable links; otherwise describe the real available download method, never fabricate links.
- Preserve all successful work if cloud execution window ends.

IMPORTANT: This is not a call to create additional repositories. The repository and branch already exist. Start by checking the voiceover file and current branch.
