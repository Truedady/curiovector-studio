import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {DURATION_FRAMES, FPS} from './timeline';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="CV008ElevatorLandscape"
			component={Episode}
			durationInFrames={DURATION_FRAMES}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{layout: 'landscape' as const}}
		/>
		<Composition
			id="CV008ElevatorShorts"
			component={Episode}
			durationInFrames={DURATION_FRAMES}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={{layout: 'portrait' as const}}
		/>
	</>
);
