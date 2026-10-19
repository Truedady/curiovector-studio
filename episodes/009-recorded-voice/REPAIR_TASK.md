# CURIOVECTOR EP. 009 — TARGETED VISUAL REPAIR
**Do NOT start a new episode. Do NOT render complete videos before user approves corrected stills.**

## Issue observed in existing landscape preview
The illustrated human listening to their recorded voice has a misshapen side-profile head. Skull and lower facial mass look swollen/round, chin-jaw-neck proportions are unnatural, and the stylized character looks like distorted cut-out clip art rather than premium CurioVector editorial illustration. The existing scene with hand-held phone and `WHO IS THAT?!` is a good narrative composition; repair the human face geometry while preserving the scene's concept.

The reference screenshot was supplied by the user in the ChatGPT discussion, not embedded in the repository. If you cannot view it, use the description above and request the screenshot from the user rather than inventing a different scene.

## Required rules
Read `docs/CURIOVECTOR_CHARACTERS.md`, `docs/CURIOVECTOR_STYLE.md`, and `docs/RENDER_PERFORMANCE.md` in the **episode's branch**. Those constraints override any previous vague encouragement to simplify the head shape for render speed.

## Your task, in order
1. Confirm you are inside the **existing Ep. 009 Claude Code session** with the existing React/Remotion code, audio, visuals and any renders. Preserve all working source, finished MP4s, MP3, timing and transitions.
2. Locate the exact component(s) defining the profile person's head/forehead/jaw/chin/nose/hair/ear and its transforms (SVG paths, CSS, React). Report their filenames and impacted scene time ranges.
3. Fix the character as a believable young adult, illustrated in our premium editorial 2D style:
   - silhouette: natural forehead → nose → lips → chin → jaw → neck;
   - not bloated or spherical; no drooping bulges, puppet jaw, massive lumpy cheek or toy helmet hair;
   - ear/eye/brow in plausible relation;
   - consistent face proportions at every keyframe, especially 3/4 / profile;
   - hand and phone can remain unchanged unless they visibly intersect face.
4. Prefer **small targeted SVG path edits or a single reusable optimized head illustration** over rewriting all scenes. Reuse static artwork and lightweight transforms to keep CPU cost down.
5. Fix any cropped titles/clipping if also present, but do not redesign valid scenes.
6. Render only **3–6 corrected STILL FRAMES** from affected timestamps, including one close-up and all problematic angles. Include landscape and portrait frames if that character appears in both.
7. Provide direct image previews/contact sheet and **STOP to request user approval**. Do NOT start a new full MP4 render on the strength of your own preview review. Do not regenerate voice, modify script, download models, reinstall dependencies unnecessarily, or repeat expensive renders.
8. After approval only: make the cheapest correct final delivery. If you have prior MP4s and can safely splice matching corrected scenes with correct codec/timing/audio/overlaps, explain approach; otherwise render each affected format ONCE. Validate via ffprobe.

## Change budget
- Work only inside `episodes/009-recorded-voice/` for project code/art/assets.
- Keep shared files and other four episodes untouched.
- No speculative redesign; do not replace the whole visual language or the identity of the person.
- No unnecessary re-transcription, sentence realignment, soundtrack changes, or new full animation from scratch.
- If the completed Remotion source is not accessible in this session or accessible branch, STOP and request the existing Claude project branch/source rather than rebuilding the film.

## Final pre-approval report
List: changed filenames, affected shots, exact still-frame URLs/paths, reasons the silhouette is now anatomically plausible, and estimated cost/number of full renders saved. Never claim fixed MP4 exists before actually rebuilding and verifying it.
