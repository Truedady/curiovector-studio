import React from 'react';
import {AbsoluteFill, Audio, staticFile, useVideoConfig} from 'remotion';
import {Backdrop, Defs, Vignette} from './art';
import {BinaryScene, DefenseScene, EjectaScene, FinaleScene, HitScene, HookScene, MissionScene, OrbitScene, SunScene, TestScene} from './scenes';
import {C, LayoutCtx, useTime} from './theme';

const Stage: React.FC = () => {
	const t = useTime();
	const {width, height} = useVideoConfig();
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
			<Defs />
			<Backdrop t={t} />
			<HookScene />
			<MissionScene />
			<BinaryScene />
			<HitScene />
			<DefenseScene />
			<TestScene />
			<OrbitScene />
			<EjectaScene />
			<SunScene />
			<FinaleScene />
			<Vignette />
		</svg>
	);
};

/** One episode, two native layouts: `vertical` switches every scene's placement and scale. */
export const Episode: React.FC<{vertical: boolean}> = ({vertical}) => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: C.navy}}>
			<Audio src={staticFile('Nasa.mp3')} />
			<LayoutCtx.Provider value={{W: width, H: height, v: vertical}}>
				<Stage />
			</LayoutCtx.Provider>
		</AbsoluteFill>
	);
};
