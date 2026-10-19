# CurioVector — Render Performance and Quality Gate

## Why
Prior episodes took nearly two hours instead of ~15 minutes because CPU-only Claude Code Cloud rendered at around 1.1 FPS, with heavy SVG filters, 90px shadows, CSS blur and repeated rasterization. React/Remotion installation itself took ~18 seconds and was not the cause.

## Non-negotiable production requirements
- Premium navy/cyan/orange illustrated style is preserved; **optimize implementation, not visual storytelling**.
- Prioritize reusable pre-rasterized glows, shadows, light gradients, static illustrations, and caching. Animate cheap transforms and opacity of prepared layers.
- Avoid animated/filter-heavy SVG trees, enormous blur radii, giant box shadows, constantly changing masks, unnecessary clip paths, and full-frame CSS blur.
- Use light-weight reusable vector pieces for moving objects and bitmap/sprite layers for complex static artwork.
- No undefined performance benchmarks. Before both full MP4 renders, render a **representative 150-frame sample** including the most complex scene at target resolution and measure wall-clock FPS. Check a short sample in each output format.
- Prefer >=5–8 rendered frames/sec on the available CPU; the target is aspirational, **never guaranteed**.
- If under 5 fps, profile/simplify expensive rendering implementation without dropping story beats. Re-test once; if still slow, report realistic export estimate instead of hiding it.
- Avoid duplicate renders, repeated `npm install`, `pgrep -f` loops and restarting background jobs.
- Use `ffprobe` to verify frame sizes, fps, audio stream and duration; never say "completed" without the actual MP4.
- Do not start five full MP4 renders simultaneously if on shared/limited CPU or account resources. The **coding tasks** can run in parallel; stagger final renders if necessary.
- Use a single voiceover/timeline for both outputs, with **fully native 16:9 and 9:16 compositions**.
- The repo is currently a **source and editorial scaffold**, not a previously validated Remotion root. If a shared toolchain is unavailable, keep all episode-local setup isolated so concurrent jobs cannot overwrite shared files. Once the episode batch is finished, consolidate one proven Remotion toolchain and lockfile into the root.

## Minimum checkpoints
1. Verify correct repo / target branch / script / sound.
2. Inspect exact duration. Align timing once.
3. Build both native responsive compositions.
4. Typecheck once.
5. Preview three frames per format (hook, reveal, ending).
6. Benchmark rendering at both resolutions and report FPS + estimate.
7. Render landscape MP4 once, Shorts once.
8. Verify videos and preserve/download artifacts without claiming they were committed to GitHub if they weren't.
