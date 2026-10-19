# Episode 005 — NASA asteroid impact

**Title:** NASA Crashed Into an Asteroid. Here's What Happened.

**Selected hook:** “NASA deliberately crashed a spacecraft into an asteroid. And it actually changed its path.”

**Expected uploaded audio:** `episodes/005-nasa-asteroid/Nasa.mp3` (provided by user, 122.83 seconds). The binary is NOT included until the user uploads it on this branch.

**Science note / small script-audio factual issue:** NASA launched DART on **Nov 24, 2021**, but it **impacted Dimorphos on Sep 26, 2022**. The supplied narration script says “In 2022, NASA launched a mission called DART.” That is imprecise/incorrect if referring to the spacecraft launch. Do not show a false 2022 launch date. Since existing MP3 is final, NEVER silently rewrite or overdub narration: ask user to replace that one sentence if strict factual precision is desired, and otherwise retain audio while emphasizing the correct 2022 *impact* on-screen.

**Verified facts:** Dimorphos orbited Didymos in ~11h 55m, shortened by ~33 minutes after impact; collision ejecta boosted momentum transfer; later work showed the asteroid pair's solar orbital period changed by ~0.15 seconds. Neither body threatened Earth.

**NASA sources:**
- https://science.nasa.gov/solar-system/asteroids/didymos/
- https://www.nasa.gov/missions/dart/nasas-dart-mission-changed-orbit-of-asteroid-didymos-around-sun/

**Scene beats:** impact hook → two-asteroid system → why deflect vs destroy → controlled impact → 33-min orbital-period reveal → extra recoil from debris → planetary-defense consequence.

**Visual style:** Follow `docs/CURIOVECTOR_STYLE.md`. Native 16:9 and 9:16 with shared narration and timeline. Never shrink a wide scene into a portrait box.

**Parallel work safety:** work ONLY on branch `episode/005-nasa-asteroid`, under `episodes/005-nasa-asteroid/`. Avoid editing shared root files or the other episode. Do not merge or push to main autonomously.
