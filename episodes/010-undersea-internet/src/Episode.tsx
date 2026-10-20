import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C, GlobalDefs, LayCtx, Scene} from './lib';
import {SCENES} from './timing';
import {Hook} from './scenes/S01Hook';
import {Invisible} from './scenes/S02Invisible';
import {PhysicalPath} from './scenes/S03Path';

// One timeline, two native layouts: `tall` switches every scene's art direction.
export const Episode: React.FC<{tall: boolean}> = ({tall}) => {
  const lay = tall ? {w: 1080, h: 1920, tall} : {w: 1920, h: 1080, tall};
  return (
    <LayCtx.Provider value={lay}>
      <AbsoluteFill style={{background: C.navyDeep, overflow: 'hidden'}}>
        <GlobalDefs />
        <Scene a={SCENES.hook[0]} b={SCENES.hook[1] + 0.3} first>
          {(t) => <Hook t={t} />}
        </Scene>
        <Scene a={SCENES.invisible[0] + 0.3} b={SCENES.invisible[1]}>
          {(t) => <Invisible t={t} />}
        </Scene>
        <Scene a={SCENES.firstHop[0]} b={SCENES.firstHop[1]}>
          {(t) => <PhysicalPath t={t} />}
        </Scene>
        <Audio src={staticFile('voiceover.mp3')} />
      </AbsoluteFill>
    </LayCtx.Provider>
  );
};
