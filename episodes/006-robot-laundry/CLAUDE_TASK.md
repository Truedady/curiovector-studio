# Claude Code Task — CurioVector Episode 006 (Robots & Laundry)

**WORK ONLY IN GIT BRANCH `episode/006-robot-laundry`.** Check via `git branch --show-current` before writing. If not the correct branch, STOP and ask the user to switch. NEVER write to the NASA episode, main or another branch. Work can run concurrently with episode 005.

## Files

Repository: `Truedady/curiovector-studio`
Episode folder: `episodes/006-robot-laundry/`

- Script: `episodes/006-robot-laundry/script.txt`
- Narration: `episodes/006-robot-laundry/Robot shirt.mp3` (user uploads)
- Research and storyboard: `episodes/006-robot-laundry/EPISODE_BRIEF.md`
- Brand rules: `docs/CURIOVECTOR_STYLE.md`
- Workflow rules: `docs/PRODUCTION_WORKFLOW.md`

Check MP3 and script exist and are readable before starting. Do not replace audio or invent a missing file.

## Output

Build **two compositions on one master narration timeline**:
- `CurioVectorRobot006Landscape` — 1920x1080 30 fps, `CurioVector_Robot_Laundry_16x9.mp4`
- `CurioVectorRobot006Shorts` — 1080x1920 30 fps, `CurioVector_Robot_Laundry_9x16.mp4`

Same audio, same duration, scientific events and scene boundaries, but genuinely redesigned native 16:9 and 9:16 staging. No cropped wide video or large blank lower space. Keep shorts platform safe areas.

## Visual style

Premium CurioVector editorial illustration and motion graphics. Navy #08132F, cyan #43C5F5, orange #FF923E, off-white #F8FAFF. Cinematic illustrations with dimensional lighting, original believable human, mechanical hands and cloth. No generic AI robots, no repetitive terminal text, no stock images. Hook appears immediately, not after title card.

## Scene beats according to narration

1. First 3 seconds: human effortlessly folds shirt; advanced robot struggles with a loose sleeve. Punchy visual paradox.
2. AI excels at selected abstract tasks such as coding and symbolic reasoning, but manipulating real cloth differs.
3. A T-shirt wrinkles, self-occludes, bunches and changes shape every time touched. Use beautiful illustrated 2D fabric motion.
4. Robot prediction: three outcomes for the SAME pull—sleeve flips, cloth bunches, entire shirt slides.
5. Control challenge: grip, friction, angle, tension, force. Show subtle adjustment makes the fold succeed or fail.
6. Explanatory payoff: written equation on one side stays unchanged; shirt on other continuously deforms. Contrast algorithmic task vs embodied control; avoid implying all mathematics is easier than laundry.
7. Closing: physical intelligence is about reliable perception and control in a changing world; robot shown improving, not universally incapable.

Scientific cautions:
- Robots CAN fold garments in laboratories and demos. Do not say they never can.
- AI does not solve literally all 'impossible' scientific problems; title rhetorical.
- Different AI systems and robotic hardware vary widely.
- Fabric perception, deformation, planning and contact dynamics are recognized difficult research areas.

References:
https://arxiv.org/abs/2105.01767
https://arxiv.org/abs/2312.10419

## Efficiency and branch isolation

- Another session is working on `episode/005-nasa-asteroid` simultaneously; **never alter shared repo root files, root package.json, shared src, docs, main or the NASA episode**.
- If a tested shared Remotion root exists, reuse it without modifications. If absent, create a self-contained Remotion application in `episodes/006-robot-laundry/`.
- Use audio as timing master; align once.
- Build both native compositions, type-check, inspect 3 stills per format, fix clipping and incomplete vertical layouts.
- Check preview rendering speed and optimize expensive SVG blur/effects if needed before full render.
- Render each final video once only; no multiple concurrent duplicate render processes or infinite polling.
- Verify outputs and audio with ffprobe. Don't claim completion before finished MP4s exist.
- Commit only episode-local source to the correct branch; do not merge, overwrite another episode or push large MP4s through normal git.
- Give truthful verified links to artifacts when available and avoid invented download paths.

Start with Git branch and the files `script.txt` / `Robot shirt.mp3` in this episode directory.
