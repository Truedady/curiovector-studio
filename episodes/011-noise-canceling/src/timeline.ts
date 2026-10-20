// Master timing for Episode 011, measured ONCE from voiceover.mp3
// (ffprobe duration 96.835875 s; sentence boundaries from ffmpeg silencedetect
// at -35 dB / 0.25 s, mapped 1:1 onto script.txt).

export const FPS = 30;
export const AUDIO_SECONDS = 96.835875;
export const DURATION = Math.ceil(AUDIO_SECONDS * FPS); // 2906 frames

export const f = (seconds: number) => Math.round(seconds * FPS);

// Sentence onsets (seconds) — names follow the script.
export const T = {
	hook: 0.0, // Your headphones make noise to create silence.
	backwards: 3.13, // Sounds backwards, right?
	plane: 4.92, // Imagine you're on a plane.
	engines: 6.52, // The engines are humming.
	switchOn: 8.4, // Then you switch on noise cancellation.
	fades: 11.06, // Suddenly, that low roar fades.
	noWall: 14.11, // ...haven't built a soundproof wall...
	fighting: 17.86, // They're fighting sound with sound.
	howTo: 20.39, // Here's how.
	mics: 21.47, // Tiny microphones listen...
	micsBoth: 24.4, // ...sometimes from both outside and inside the earcup.
	processor: 27.94, // A processor analyzes that sound...
	calculates: 29.9, // ...and calculates another waveform.
	timing: 32.41, // The key is timing.
	pressure: 34.34, // Picture a sound wave pushing the air pressure up and down.
	opposite: 38.07, // Now imagine another wave that does the opposite:
	pushesUp: 41.21, // when the first pushes up,
	pullsDown: 42.72, // the second pulls down.
	atEar: 44.61, // At your ear, those pressure changes can partly cancel...
	destructive: 48.98, // That's called destructive interference.
	notVanished: 51.81, // The outside noise hasn't vanished from the airplane cabin.
	lessReaching: 55.3, // But there's less of it reaching your eardrum.
	interesting: 57.76, // And this is where things get interesting.
	measure: 60.35, // The system has to measure the noise,
	predict: 62.2, // predict the right opposing signal,
	play: 64.56, // and play it at exactly the right moment.
	steady: 67.38, // That's much easier when the sound is steady...
	sudden: 72.11, // It's harder with sudden voices, sharp clicks...
	padding: 77.14, // That's also why the padding and seal...
	block: 81.24, // They physically block some sounds...
	notOff: 86.1, // So when you switch on noise cancellation, you're not really turning sound off.
	anotherOn: 91.04, // You're turning another sound on.
	designed: 93.39, // One carefully designed to make the first one quieter.
	end: AUDIO_SECONDS,
} as const;

// Scene blocks (a new visual discovery every ~6–19 s).
export const SCENES = [
	{id: 'hook', from: T.hook, to: T.noWall},
	{id: 'notWall', from: T.noWall, to: T.mics},
	{id: 'earcup', from: T.mics, to: T.pressure},
	{id: 'waves', from: T.pressure, to: T.notVanished},
	{id: 'local', from: T.notVanished, to: T.interesting},
	{id: 'timing', from: T.interesting, to: T.padding},
	{id: 'passive', from: T.padding, to: T.notOff},
	{id: 'finale', from: T.notOff, to: T.end},
] as const;
