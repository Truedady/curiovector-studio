import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet} from './CharacterSheet';
import {Episode} from './Episode';
import {DURATION, FPS} from './timeline';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="CV011ANC-Landscape"
			component={Episode}
			durationInFrames={DURATION}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{fmt: 'land' as const}}
		/>
		<Composition
			id="CV011ANC-Shorts"
			component={Episode}
			durationInFrames={DURATION}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={{fmt: 'short' as const}}
		/>
		<Composition id="CV011ANC-Character" component={CharacterSheet} durationInFrames={1} fps={FPS} width={1920} height={1080} />
	</>
);
