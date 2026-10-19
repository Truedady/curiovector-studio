# CURIOVECTOR EP. 011 — TARGETED VISUAL REPAIR
**Do NOT start full re-render. Correct character and cropped on-screen text; request user approval of stills.**

## Two visible defects in current screenshot
1. The passenger listening to noise-canceling headphones has a distorted oversized, round toy-like side-profile head. Forehead/back of skull, nose/chin/jawline and neck profile are not anatomically credible, even for CurioVector's stylized 2D editorial look.
2. Multiple large words on the **right of the LANDSCAPE frame are cut off by the screen edge**, with visible partial text. This is unacceptable as a legible educational headline. Text must fit inside safe margins and avoid overlapping the illustrated passenger/airplane window.

Screenshot is visible to the user in ChatGPT but may not be accessible to Claude: don't pretend you saw it if not provided. Ask user to attach reference screenshot if needed.

## Read rules
`docs/CURIOVECTOR_CHARACTERS.md`, `docs/CURIOVECTOR_STYLE.md`, `docs/RENDER_PERFORMANCE.md`.

## Repair sequence
1. Continue within the **existing Ep. 011 Claude Code session**, if possible. First inspect the source files, current processes and renders; avoid disturbing running jobs. No fresh app creation or dependency reset.
2. Identify the human character component/SVG paths and typography component(s) for scenes showing airplane passenger and active noise cancellation.
3. Rebuild **only the problematic profile silhouette** into a natural stylized adult with:
   - correctly shaped cranium and modest forehead curvature,
   - proportional eye/ear/nose/lips,
   - coherent jaw→chin→neck contour,
   - hair/headphones following the skull, not a ball or disconnected helmet,
   - physically believable over-ear headphone earcups.
   Retain the premium navy/cyan/orange design and strong surrounding imagery; no toy/chibi aesthetic.
4. Repair typography and safe areas in LANDSCAPE **and** SHORTS:
   - for landscape, use a minimum 5% side margin for complete words;
   - for portrait, minimum 8% side inset plus Shorts UI-safe placement;
   - measure text boxes at all keyframes; no intentional cropping, partial words or overlap unless explicitly user-approved.
   - Prefer intelligent font size/line breaks/positioning instead of simply masking.
5. Preserve original audio, sequence lengths, transition cues and correctly built visual scenes. Patch SVG paths/layout only.
6. Render **3–6 STILL FRAMES** covering at least (a) corrected profile close-up, (b) former clipped headline fully visible, (c) Shorts equivalent, and (d) an intermediate motion/keyframe state.
7. Present all stills to the user, along with changed source paths; **STOP for explicit approval before full MP4 rendering**. Do not waste more credits on automatically exporting video before the stills pass.
8. Only after approval, reuse existing partial artifacts if technically feasible, otherwise do one verified re-export per affected format, with ffprobe verification.

## Cost limits
- No repeated installation, full script/code rewrite, new voiceover, excessive still generation, long debugging loops or repeated full movie renders.
- Keep file edits within `episodes/011-noise-canceling/`, do not change root or another episode.
- If no existing Remotion source is available, STOP and ask for the original project's source branch instead of recreating the entire episode.

## Report
Tell the user what caused head geometry and title overflow from **inspected code**, not guesses; identify changed files, frames, and no-go decision before full export.
