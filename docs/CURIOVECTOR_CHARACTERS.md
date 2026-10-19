# CurioVector — Character Design and Visual QA Standard
**Applies to every episode featuring people, heads, ears, hands, or anatomical diagrams.** 
This is a required art-direction and acceptance standard, not a prompt to redesign finished episodes automatically.

## Character identity and style
- CurioVector people are **believable adults illustrated in premium editorial 2D**, with elegant contours, controlled cel shading and restrained dimensional lighting. **Not** plastic toys, chibi cartoons, lumpy silhouettes, inflated emoji heads or anatomically implausible clip-art people.
- Preserve recognizable age, expression, natural facial structure, human dignity and stable identity across shots.
- Palette: navy `#08132F`, cyan `#43C5F5`, orange `#FF923E`, off-white `#F8FAFF`. Skin and hair have natural warm/cool tonal variation and should not become monochrome plastic.
- Simplified doesn't mean deformed: design can be stylized but must pass the silhouette test.

## Mandatory side-profile and 3/4-view checkpoints
Before animating, make a clean **large still of the human face** (no text over it), and check:
1. **Cranium:** rounded but NOT a perfect circle/football/blob; distinct forehead, parietal/back-of-skull, occipital curve. No oversized flat dome or strange stacked hair-cap shape.
2. **Forehead, brow and nose:** smooth forehead-to-brow-to-bridge anatomy, intentional nose tip and nostril, no sudden balloon bulges.
3. **Jawline, chin:** face narrows naturally from cheek toward jaw. Clear human-shaped chin and under-chin/neck transition; no duck-like jutting lips or huge protruding lower face.
4. **Eyes:** proportionate and placed in a plausible plane, not floating next to an ear, facial outline, or superimposed with eyebrows.
5. **Ear:** visible correct side and position, roughly between brow and nose-base heights, not detached, gigantic or drawn as a random oval.
6. **Neck and shoulders:** neck joins below/back of jaw and skull in a plausible angle; proportional thickness. No loose noodle neck or unintentional beak/neck bulge.
7. **Hair:** must follow actual skull contour; not a helmet, disconnected cap, or rectangle. Avoid double hairlines.
8. **Perspective:** front/side/three-quarter views must describe the SAME character; don't morph facial anatomy between shots. Do not stretch the head independently of the torso.
9. **Expression:** changes eyes/brows/mouth subtly; preserve skull, jaw and ear landmarks when animating.

When in doubt, simplify the pose, use a modest 3/4 view instead of an extreme profile, or hand-tune SVG Bezier paths. DO NOT cover obvious deformities with text, glow or cropping.

## Preferred reusable assets
- Define a consistent **character turn-around / reference sheet** with at least frontal, left profile and three-quarter views. Once art is approved, reuse its outlines and facial landmark coordinates via a single parameterized component or assets.
- Reuse drawings across both 16:9 and 9:16; rearrange composition, not cranial geometry.
- Favor optimized fixed SVG artwork/PNG layers + lightweight transform/opacity animation over rebuilding elaborate filtered head shapes each frame.
- Any reusable assets must be locally project-controlled; don't assume Claude can retrieve a screenshot from another conversation. If the user provides approved stills, use those as visual references.

## Text layout and mobile-safe framing
- **No clipping:** all intended complete headlines inside composition, including largest text at all keyframes. If words are intentionally cropped for a graphic effect, obtain explicit approval; default is fully readable.
- Use **minimum canvas inset:** landscape at least 5% width at headline edges; Shorts at least 8% width. Increase margins near right-side engagement overlays or bottom UI in Shorts.
- Run an automated bounding-box/clipping check where feasible (or sample stills at min/max transform) for every oversized animated title.
- Do not substitute hiding/clipping a bad head for fixing anatomy.

## Cost-aware visual approval gate (MANDATORY)
1. Identify every timestamp/scene with a human face or large headline.
2. Render **still frames only** from every impacted character pose and headline state, in both aspect ratios when present. For a batch, prioritize 3–6 affected frames, not whole-episode movie renders.
3. Generate an accessible contact sheet or direct static previews with a list of the **exact frames and composition IDs**.
4. Before any full re-render, ask the user for **explicit visual approval**. Approval applies to shown corrected stills only.
5. Keep existing finished MP4s, audio, camera cuts, script and durations untouched until approval. Never start full export “just to see how it looks.”
6. If rendering after approval, consider rendering just corrected sections and assembling with existing video **only if** codec, aspect, fps, audio sync, transitions and concat method can be proven correct; otherwise perform a single final render, not repeated full runs.
7. Reuse installed dependencies and successful render artifacts. Do not rebuild the entire project or repeat `npm install` unnecessarily.
8. Benchmark an affected heavy scene before a full render. Optimize filters/layers before spending another hour of CPU.

## Hard fail conditions
Reject character stills if any of these appear:
- "Bubble/balloon head", inflated back of head or oversized featureless face mass.
- Unnatural jaw-to-neck connection, side-profile beak or stray cheek lump.
- Ear/eye/nose anatomically incompatible with silhouette.
- Character identity/proportions change as head turns.
- Important text cut by canvas edge, especially right margin.
- Large unused vertical space, unreadable labels, or text colliding with person/Shorts UI.

## Reference incidents
- **Ep. 009 — Recorded Voice:** oversized rounded profile head, awkward jaw/neck and face mass. Repair face geometry, not only shading.
- **Ep. 011 — Noise-Cancelling Headphones:** unnaturally round, toy-like profile head and cropped/right-clipped typography in shown frame. Repair face geometry and text safe margins.

This guide **does not itself repair previously rendered video**. Corrections must be applied to the episode's Remotion source and approved via stills.
