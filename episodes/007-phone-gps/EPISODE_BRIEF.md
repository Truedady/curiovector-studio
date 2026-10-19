# Episode 007 — How Your Phone Finds You Without Internet

**Final title:** How Your Phone Finds You Without Internet
**Hook (spoken, fixed):** “Your phone can find you without internet. But the satellites aren't tracking you.”
**Audio:** shared ZIP entry `voiceovers/007-gps.mp3`; extract locally to `episodes/007-phone-gps/voiceover.mp3` (97.489 seconds). NEVER use audio from another episode.
**Single dramatic question:** How does the blue location dot know where you are with no internet?
**Visual hero:** a glowing GPS dot on a handheld phone, dissolving into geometric intersections in orbit.
**Thumbnail:** massive phone, blue location dot, satellites over Earth; text `NO INTERNET?!`.

## Scene arc (time to the actual MP3, NOT guessed seconds)
1. **0–5s cold hook:** person on remote mountain; no bars, no Wi-Fi, blue dot survives. Extremely clear paradox.
2. GPS doesn't track the user: orbiting satellites simply broadcast their location and clock readings. NO spying/downward scanner.
3. Signal time-of-flight: concentric shells/spheres of possible receiver locations, narrowing with satellite measurements. Use conceptual geometry at scale.
4. Four satellites generally needed to solve position **and receiver clock error**. Show wrong clock corrected, not only three circles.
5. Surprise: special/general relativity corrections keep positioning useful; illustrative time offset, do not invent huge drift stats.
6. Final: floating blue dot in the dark, `YOUR PHONE FOUND ITSELF`.

## Science guardrails
- A GNSS receiver listens to satellite transmissions; satellites need not detect or identify the phone.
- A receiver typically uses signals from at least four satellites for 3D position and clock bias.
- The map tiles may not load offline, even if GNSS positioning itself operates.
- GPS is one system among GNSS constellations; don't claim all phone positioning comes exclusively from GPS.
- Clear sky helps; indoors, urban canyons, assisted positioning introduce limitations.
- Relativity matters, but keep conceptual if no numerically backed corrections.
References:
- https://www.gps.gov/systems/gps/
- https://www.gps.gov/systems/gps/performance/accuracy/

## 16:9 / 9:16 direction
Landscape: broad Earth-to-satellite staging and expansive overlapping location spheres. Portrait: phone/blue dot stays large in center; stack satellite emitters and their circles vertically, with readable labels and no tiny geometry.
Follow `docs/CURIOVECTOR_STYLE.md` and `docs/RENDER_PERFORMANCE.md`. No giant SVG blurs per frame.
