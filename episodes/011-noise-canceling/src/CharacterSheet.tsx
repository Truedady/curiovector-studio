import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Passenger} from './components/Passenger';
import {Background} from './components/ui';

/** QA reference: large, text-free side profile of the passenger (not exported as video). */
export const CharacterSheet: React.FC = () => (
	<AbsoluteFill>
		<Background fmt="land" />
		<svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
			<g transform="translate(540 -40) scale(1.25)">
				<Passenger id="qa" ancOn={1} cupGlow={0.3} />
			</g>
		</svg>
	</AbsoluteFill>
);
