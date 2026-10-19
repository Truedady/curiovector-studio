# CurioVector Studio

Central production workspace for CurioVector — **Big Questions. Clear Answers.**

This repository is the permanent home for our reusable Remotion foundation, visual style, and future episodes. It does **not** automatically migrate or modify older standalone video repositories.

## Production pipeline

1. Finalize and fact-check the English voiceover script.
2. Generate the English MP3 in ElevenLabs.
3. Make a new folder `episodes/NNN-short-topic/` by copying `episodes/_TEMPLATE/`.
4. Save the script as `script.txt` and narration as `voiceover.mp3` **inside that episode folder only**.
5. Ask Claude Code to create both Remotion compositions from the same audio timeline and artwork.
6. Validate 3 stills per aspect ratio, then render each final MP4 once.
7. Preserve source files, export videos as artifacts or releases, and avoid committing large final renders.

## Directory layout

- `docs/CURIOVECTOR_STYLE.md` — approved visual identity and science/storytelling guidelines.
- `docs/PRODUCTION_WORKFLOW.md` — efficient setup, audio and render workflow.
- `episodes/_TEMPLATE/EPISODE_BRIEF.md` — copy this folder when starting a new episode.
- `episodes/NNN-name/` — per-episode voiceover, script, scenes, generated assets (when added).
- `src/` — shared Remotion/React components, to be implemented and tested in the next setup step.

## Non-negotiables

- Publish **two native compositions**: 1920×1080 and 1080×1920 at 30 fps.
- Audio, duration, scene beats and transitions align identically; spatial layout is separately designed.
- Never letterbox or center a tiny landscape video inside a Shorts canvas.
- Use actual verified scientific claims, not spectacle that distorts facts.
- Do not overwrite existing work, re-run successful renders or repeatedly install dependencies without a reason.
- Never include API keys, ElevenLabs credentials or access tokens in the repository.

## Next technical step

This is a **production skeleton**, not a fully installed or tested Remotion application yet. Set up one pinned and reproducible Remotion/React/TypeScript toolchain in this repo and verify both sample compositions. Afterwards every new episode should reuse that code and its lockfile.

Existing stand-alone episodes remain in their existing repositories until explicitly migrated.
