import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {CharacterSheet} from './CharacterSheet';
import {DURATION_FRAMES, FPS} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CV009VoiceLandscape" component={Episode} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{format: 'landscape' as const}} />
    <Composition id="CV009VoiceShorts" component={Episode} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{format: 'shorts' as const}} />
    <Composition id="CV009CharacterSheet" component={CharacterSheet} durationInFrames={1} fps={FPS} width={2100} height={1000} />
  </>
);
