# CurioVector — Visual Storytelling, Audience Trust & Retention QA

## The lesson from Episode 001 (airplane) — October 2026
Initial analytics for the 2:00 landscape airplane explainer showed approximately 1,100 thumbnail impressions, 1.6% CTR and 0:40 average view duration (~34.1%), across only ~30 views. This is **too small a sample to prove causes**. Nevertheless, the user identified visually awkward images around 0:19–0:26: a strangely proportioned blue sedan/limousine, an unnatural arm projecting from its window, and an unconvincing hand-tilt airflow illustration. Audience retention visibly fell in that region, but correlation **must not** be treated as proof that this specific artwork caused each viewer's exit.

These weak visuals contrasted with the polished aircraft thumbnail `NOT THE ENGINES` and the promise of a compelling airplane science mechanism. User explicitly wants future episodes to avoid this gap between thumbnail quality and in-video scene quality.

## Golden principle
**ONE EXCELLENT, CLEAR VISUAL DEMONSTRATION IS BETTER THAN THREE MEDIOCRE ILLUSTRATIONS.**

Do not merely narrate facts and decorate them. The imagery must communicate and *prove/explain* the physical mechanism. A viewer should grasp the idea even when watching the animation muted.

## Hard creative requirements for EVERY new episode
1. **No anatomy or geometry errors:** Hands, fingers, arms, faces, animals, vehicles, aircraft, machinery, tools, and scientifically meaningful objects must look believable within a consistent premium editorial 2D style. Cartoon stylization is fine; accidental deformity is not.
2. **No raw placeholder assets:** Reject any obviously stretched sedan, detached hand, puppet-like limb, toy head, nonsensical machine layout, misaligned wheel/axle, broken silhouette, or visually confusing object. Do not ship a work-in-progress illustration.
3. **Thumbnail ↔ video promise continuity:** Scenes should match the quality, clarity, visual energy and scientific promise of the thumbnail/title. If the hook promises an airplane reveal, do not spend an outsized portion of a 2-minute video on a cheap unrelated-looking car graphic. Side analogies are acceptable only if visually intuitive and clearly valuable.
4. **Every shot earns its time:** A scene must advance the narrative, show an intelligible demonstration, make a useful comparison, create a discovery, or resolve a question. No filler diagrams or random footage to occupy narration.
5. **Mechanics are physically legible:** Direction of forces/flows, contact points, geometry and causal relationships must be consistent. Labels are explanatory, not decorative. Do not mislead viewers with inaccurate airflow or lift depictions.
6. **Human anatomy reference:** Also read `docs/CURIOVECTOR_CHARACTERS.md`. Its quality standard applies to heads, arms, hands and body connections.
7. **High polish without expensive render effects:** Premium appearance does not require per-frame giant SVG blur. Use well-crafted paths/illustrations, reusable cached artwork, thoughtful colors/shadows and motion transforms, as in `docs/RENDER_PERFORMANCE.md`.
8. **Independent vertical redesign:** Both 16:9 and 9:16 must preserve the core visual demonstration with correctly proportioned subjects and readable text. Never simply crop an already cramped scene.

## Storyboard approval questions (ask these BEFORE coding)
- Is this visual the most direct and exciting way to demonstrate what narration is saying?
- Could the viewer interpret this object without a label? Are shapes and proportions plausible?
- Does this scene continue the excitement promised by the title and thumbnail?
- Are we changing topic/object for a meaningful reason, or just to fill time?
- Does this help the viewer understand **why/how**, not merely **what**?
- If we deleted this scene, would anything important be lost? If not, improve or replace it.

## Required low-cost review BEFORE any full rendering
1. Inspect the storyboard and identify the highest-risk frames: big people, hands, vehicles, animals, moving mechanisms, precise scientific cross-sections and analogy switches.
2. Render **representative stills for these risky shots** in addition to hook/reveal/end; do not limit preview QA to arbitrary timestamps.
3. Review images at actual mobile display size. Confirm anatomy, perspective, component geometry, label legibility, safe framing and artistic consistency with the planned thumbnail.
4. If an object looks strange or unclear, **fix or replace its illustration, then re-preview stills only**. An animator must not justify a poor drawing by saying it's "stylized".
5. Stop for **explicit user approval of sample stills** before spending credits on the whole video.
6. Once approved, benchmark rendering and export both final formats only once; avoid reinstalling dependencies or repeating successful work.

## Retention measurement discipline
- Read retention *at actual scene timestamps* and note steep drops, but avoid claims of causation with low view counts.
- Track per-scene narrative events and visual defects alongside CTR and retention for future hypotheses.
- Run controlled improvements (for instance, one stronger demonstration in a new episode, not simultaneous changes to all variables).
- Revisit the hypothesis when substantially more views are available.

## Episode 001 example
- **Weak:** awkwardly stretched blue car, stylized detached-looking hand hanging out of window, cheap diagram around 0:19–0:26.
- **Better:** (A) a physically coherent, beautiful hand-and-airflow analogy with correct geometry, if justified and safe to depict; or (B) transition directly to a clear, cinematic aircraft wing and downwash visualization.
- Preferred approach for a short science explainer: **focus on the airplane wing's actual mechanism** rather than spending valuable seconds on an unconvincing analogy.
- Never encourage viewers to put arms out of a moving car; presenting a hand-outside-car analogy requires appropriate caution.

**This is a permanent quality rule for CurioVector, not a request to remake the already-published airplane video.**
