import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {SafeAudit} from './components/SafeAudit';
import {Background} from './components/ui';
import {EarcupScene} from './scenes/EarcupScene';
import {Finale} from './scenes/Finale';
import {Hook} from './scenes/Hook';
import {Local} from './scenes/Local';
import {NotWall} from './scenes/NotWall';
import {Passive} from './scenes/Passive';
import {Timing} from './scenes/Timing';
import {Waves} from './scenes/Waves';
import {Fmt} from './theme';
import {f, FPS, SCENES} from './timeline';

type SceneProps = {fmt: Fmt; t: number};

const COMPONENTS: Record<(typeof SCENES)[number]['id'], React.FC<SceneProps>> = {
	hook: Hook,
	notWall: NotWall,
	earcup: EarcupScene,
	waves: Waves,
	local: Local,
	timing: Timing,
	passive: Passive,
	finale: Finale,
};

const XFADE = 12; // frames of cross-dissolve between scene blocks

/** Passes absolute narration time (seconds) to the scene. */
const SceneHost: React.FC<{fmt: Fmt; from: number; Comp: React.FC<SceneProps>; fadeIn: boolean}> = ({fmt, from, Comp, fadeIn}) => {
	const local = useCurrentFrame();
	const t = from + local / FPS;
	const opacity = fadeIn ? Math.min(1, local / XFADE) : 1;
	return (
		<AbsoluteFill style={{opacity}}>
			<Comp fmt={fmt} t={t} />
		</AbsoluteFill>
	);
};

export const Episode: React.FC<{fmt: Fmt}> = ({fmt}) => (
	<AbsoluteFill style={{backgroundColor: '#08132F'}}>
		<Background fmt={fmt} />
		{SCENES.map((s, i) => {
			const Comp = COMPONENTS[s.id];
			const start = f(s.from);
			const last = i === SCENES.length - 1;
			const dur = f(s.to) - start + (last ? 2 : XFADE);
			return (
				<Sequence key={s.id} from={start} durationInFrames={dur} name={s.id}>
					<SceneHost fmt={fmt} from={start / FPS} Comp={Comp} fadeIn={i > 0} />
				</Sequence>
			);
		})}
		<Audio src={staticFile('voiceover.mp3')} />
		<SafeAudit />
	</AbsoluteFill>
);
