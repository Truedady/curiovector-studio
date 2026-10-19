import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {DURATION_FRAMES, FPS} from './theme';

export const Root: React.FC = () => (
	<>
		<Composition
			id="CurioVectorNASA005Landscape"
			component={Episode}
			durationInFrames={DURATION_FRAMES}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{vertical: false}}
		/>
		<Composition
			id="CurioVectorNASA005Shorts"
			component={Episode}
			durationInFrames={DURATION_FRAMES}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={{vertical: true}}
		/>
	</>
);
