// Master timing for episode 008, measured once from voiceover.mp3 with
// `ffmpeg -af silencedetect=noise=-35dB:d=0.3` (104.986063 s). Each entry is
// the start of a spoken sentence in seconds; both formats share this table.
export const FPS = 30;
export const AUDIO_SECONDS = 104.986063;
export const DURATION_FRAMES = Math.ceil(AUDIO_SECONDS * FPS); // 3150

export const S = {
	cableSnaps: 0.0, // An elevator cable snaps.
	whatStops: 2.17, // What stops the car from falling?
	notCushion: 4.47, // The answer isn't a giant cushion at the bottom.
	hiddenMachine: 7.46, // It's a hidden machine ... more than 170 years.
	firstRealize: 13.32, // First, here's something most people don't realize.
	severalRopes: 16.41, // A modern traction elevator usually hangs from several steel ropes...
	safetyMargins: 21.83, // They're designed with safety margins...
	tooFast: 27.86, // But what if something goes seriously wrong...
	secondSystem: 32.71, // That's where a second system takes over.
	governorName: 35.46, // Hidden above the shaft is ... an overspeed governor.
	speedDetector: 39.84, // Think of it as a mechanical speed detector.
	separateRope: 42.58, // A separate rope moves with the elevator...
	normalSpeed: 47.44, // At normal speeds, nothing happens.
	trips: 49.95, // But if the car accelerates past a dangerous limit...
	activates: 55.78, // This activates safety brakes attached to the elevator car.
	gripRails: 59.47, // They grip the guide rails ... bringing the car to a stop.
	cleverPart: 64.1, // And the clever part?
	noElectricity: 65.37, // The emergency mechanism can work mechanically...
	otherLayers: 71.67, // There are other layers of protection, too...
	soundsMadeUp: 77.61, // Now here's the part that sounds made up.
	otis1854: 80.18, // In 1854, an inventor named Elisha Otis ...
	droppedLittle: 88.76, // The platform dropped just a little.
	caughtIt: 91.04, // Then his safety mechanism caught it.
	practical: 93.61, // That demonstration helped make passenger elevators practical.
	realSecret: 97.43, // So the real secret of the skyscraper ...
	stopSafely: 102.89, // It's how we stop them safely.
	end: AUDIO_SECONDS,
} as const;

// Scene blocks (seconds). Consecutive scenes overlap by XFADE for cross-dissolves.
export const XFADE = 0.4;
export const SCENES = [
	{id: 'hook', from: 0, to: S.notCushion},
	{id: 'cushion', from: S.notCushion, to: S.hiddenMachine},
	{id: 'hidden', from: S.hiddenMachine, to: S.firstRealize},
	{id: 'ropes', from: S.firstRealize, to: S.tooFast},
	{id: 'tooFast', from: S.tooFast, to: S.governorName},
	{id: 'governor', from: S.governorName, to: S.activates},
	{id: 'safety', from: S.activates, to: S.cleverPart},
	{id: 'mechanical', from: S.cleverPart, to: S.otherLayers},
	{id: 'layers', from: S.otherLayers, to: S.soundsMadeUp},
	{id: 'otis', from: S.soundsMadeUp, to: S.realSecret},
	{id: 'finale', from: S.realSecret, to: S.end},
] as const;
