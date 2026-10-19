import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {DURATION_FRAMES, FPS} from './lib/timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CurioVectorRobot006Landscape"
      component={Main}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="CurioVectorRobot006Shorts"
      component={Main}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
