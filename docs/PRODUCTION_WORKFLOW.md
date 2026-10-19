# Production Workflow — Cloud Claude Code + Remotion

## Start an episode
1. Choose `Truedady/curiovector-studio` in Claude Code.
2. Pick a unique folder `episodes/NNN-topic/`.
3. Place a UTF-8 script in that folder and a corresponding ElevenLabs MP3. Never reuse a previous episode's files.
4. Specify the episode folder explicitly in Claude's prompt and confirm the first line of the script.
5. Do not change script wording after voiceover creation without also updating the MP3.

## Avoid repeated installation
- Keep a single root `package.json` and committed `package-lock.json` once the Remotion toolchain has been tested.
- Reuse root dependencies for every episode rather than generating a new `package.json` in each folder.
- In disposable cloud sessions a dependency restore (`npm ci`) may still be required; it is not necessarily a complete fresh install.
- A shared repository is not a guarantee of persistent cloud disk or package caches.
- Never commit `node_modules/`.

## Animation and synchronization
- Inspect MP3 duration via ffprobe; use audio as master timing.
- Align sentences once; reuse timeline for both compositions.
- Create native 16:9 and 9:16 layouts; common motion logic, different placement and scale.
- Review 3 stills per format: hook, strongest reveal, conclusion.

## Rendering
- One successful final render per format.
- Verify outputs with ffprobe, check proper dimensions, audio presence and duration.
- Avoid infinite loops and `pgrep -f` self-match traps.
- Never claim MP4 completion without verifying the actual file.
- Store outputs outside Git when oversized; prefer an artifact or release, as supported.

## Asset and privacy discipline
- Do not expose proprietary API keys in public repos.
- Avoid attaching unrelated footage or unlicensed music.
- Large binary audio files may need Git LFS or a supported upload flow; confirm limits first.

## Status
The repository currently contains workflow documents and an episode template. The Remotion application must be configured and tested before claiming it can render.
