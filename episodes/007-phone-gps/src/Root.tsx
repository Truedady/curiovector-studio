import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {DURATION_IN_FRAMES, FPS} from './timing';

export const Root: React.FC = () => (
  <>
    <Composition id="CV007GPSLandscape" component={Episode} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="CV007GPSShorts" component={Episode} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
