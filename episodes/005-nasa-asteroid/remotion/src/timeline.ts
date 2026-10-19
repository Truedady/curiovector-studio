/**
 * Sentence timeline for Nasa.mp3, measured once with
 * `ffmpeg -af silencedetect=noise=-35dB:d=0.25` and matched line-by-line to
 * ../script.txt. Values are speech onsets in seconds. Both compositions share it.
 */
export const L = {
	crashed: 0.0, // NASA deliberately crashed a spacecraft into an asteroid.
	changedPath: 4.05, // And it actually changed its path.
	sciFi: 6.51, // That sounds like science fiction.
	happened: 8.54, // But it really happened.
	launched: 10.51, // In 2022, NASA launched a mission called DART —
	dartName: 14.42, // — the Double Asteroid Redirection Test.
	target: 17.2, // Its target was not a planet-killing monster, but a much smaller object:
	dimorphos: 21.87, // Dimorphos,
	moonlet: 23.04, // a tiny moonlet orbiting a larger asteroid called Didymos.
	goal: 27.22, // And NASA's goal was simple.
	hitIt: 29.4, // Hit it.
	onPurpose: 30.28, // On purpose.
	why: 31.7, // Why?
	headed: 32.74, // Because one day, we might discover an asteroid that really is headed toward Earth.
	destroy: 37.86, // And if we find it early enough, we may not need to destroy it.
	nudge: 41.48, // We might only need to nudge it.
	tested: 44.22, // So DART tested one of the most important ideas in planetary defense:
	could: 48.56, // Could a spacecraft slam into an asteroid and change its motion?
	yes: 52.83, // The answer was yes.
	before: 54.91, // Before the impact, Dimorphos took about 11 hours and 55 minutes to orbit Didymos.
	after: 60.94, // After DART hit it, that orbit became about 33 minutes shorter.
	bigger: 65.4, // That was a much bigger change than scientists needed to prove the method worked.
	evenMore: 70.1, // And the collision did even more.
	blasted: 72.45, // The impact blasted huge amounts of rock and dust into space.
	exhaust: 76.84, // That debris acted like a rocket exhaust,
	extraPush: 79.36, // giving the asteroid an extra push.
	notJust: 81.95, // In other words, DART didn't just hit Dimorphos.
	amplified: 85.22, // It triggered an amplified shove.
	sun: 87.88, // Scientists later found ... around the Sun too.
	notCrash: 94.66, // So this wasn't just a spectacular crash.
	first: 97.6, // It was the first real demonstration ...
	matters: 104.23, // And that matters for one reason.
	threatens: 106.75, // If an asteroid ever threatens Earth,
	explosion: 109.07, // the best defense may not be a giant explosion.
	precise: 112.41, // It may be a very precise hit, years in advance.
	tinyCraft: 115.04, // A tiny spacecraft.
	tinyChange: 116.78, // A tiny change.
	difference: 118.47, // And one very big difference for our planet.
};

/** Scene boundaries (seconds). */
export const S = {
	hook: [0, L.launched],
	mission: [L.launched, L.target],
	binary: [L.target, L.goal],
	hit: [L.goal, L.headed],
	defense: [L.headed, L.tested],
	test: [L.tested, L.before],
	orbit: [L.before, L.evenMore],
	ejecta: [L.evenMore, L.sun],
	sun: [L.sun, L.matters],
	finale: [L.matters, 999],
} as const;

/** Hook impact moment ("...into an asteroid"). */
export const HOOK_IMPACT = 2.35;
/** Kinetic-impact moment in the test scene, just before "The answer was yes." */
export const TEST_IMPACT = 52.45;
/** Intercept moment in the finale ("a very precise hit"). */
export const FINALE_HIT = 113.2;
