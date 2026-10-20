import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {DURATION_FRAMES, FPS} from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CV010InternetLandscape"
      component={Episode}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{tall: false}}
    />
    <Composition
      id="CV010InternetShorts"
      component={Episode}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{tall: true}}
    />
  </>
);
