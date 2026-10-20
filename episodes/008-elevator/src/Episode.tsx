import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {GovernorScene, SafetyScene} from './scenes/governor';
import {FinaleScene, OtisScene} from './scenes/history';
import {LayersScene, MechanicalScene} from './scenes/layers';
import {CushionScene, HiddenScene, HookScene, SceneProps} from './scenes/opening';
import {RopesScene, TooFastScene} from './scenes/ropes';
import {C, Layout} from './theme';
import {FPS, SCENES, XFADE} from './timeline';

const REGISTRY: Record<(typeof SCENES)[number]['id'], React.FC<SceneProps>> = {
	hook: HookScene,
	cushion: CushionScene,
	hidden: HiddenScene,
	ropes: RopesScene,
	tooFast: TooFastScene,
	governor: GovernorScene,
	safety: SafetyScene,
	mechanical: MechanicalScene,
	layers: LayersScene,
	otis: OtisScene,
	finale: FinaleScene,
};

export const Episode: React.FC<{layout: Layout}> = ({layout}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;
	return (
		<AbsoluteFill style={{background: C.navy}}>
			{SCENES.map((sc, i) => {
				const Comp = REGISTRY[sc.id];
				const first = i === 0;
				const last = i === SCENES.length - 1;
				const a0 = first ? -1 : sc.from - XFADE / 2;
				const a1 = last ? Infinity : sc.to + XFADE / 2;
				if (t < a0 || t >= a1) return null;
				// Incoming scene fades in over the outgoing one (which stays opaque underneath).
				const fadeIn = first ? 1 : Math.min(1, (t - a0) / XFADE);
				return (
					<AbsoluteFill key={sc.id} style={{opacity: fadeIn, zIndex: i}}>
						<Comp t={t} layout={layout} />
					</AbsoluteFill>
				);
			})}
			<Audio src={staticFile('voiceover.mp3')} />
		</AbsoluteFill>
	);
};
