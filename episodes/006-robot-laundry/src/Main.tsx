import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, Gate, Vignette} from './art/ui';
import {GripperDefs} from './art/Gripper';
import {HandDefs} from './art/Hand';
import {SCENES} from './lib/timing';
import {Hook} from './scenes/S01Hook';
import {AiAbstract} from './scenes/S02Ai';
import {Question} from './scenes/S03Question';
import {Human} from './scenes/S04Human';
import {See} from './scenes/S05See';
import {Predict} from './scenes/S06Predict';
import {Control} from './scenes/S07Control';
import {Equation} from './scenes/S08Equation';
import {Scoreboard} from './scenes/S09Scoreboard';
import {Closing} from './scenes/S10Closing';
import type {SceneProps} from './scenes/types';

const ORDER: [keyof typeof SCENES, React.FC<SceneProps>][] = [
  ['hook', Hook],
  ['ai', AiAbstract],
  ['question', Question],
  ['human', Human],
  ['see', See],
  ['predict', Predict],
  ['control', Control],
  ['equation', Equation],
  ['scoreboard', Scoreboard],
  ['closing', Closing],
];

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const T = frame / fps;
  const v = H > W;
  return (
    <AbsoluteFill style={{backgroundColor: '#08132F'}}>
      <Audio src={staticFile('robot-shirt.mp3')} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <GripperDefs />
        <HandDefs />
        <Backdrop W={W} H={H} T={T} />
        {ORDER.map(([key, Scene]) => {
          const [a, b] = SCENES[key];
          return (
            <Gate key={key} T={T} a={a} b={b}>
              <Scene T={T} W={W} H={H} v={v} />
            </Gate>
          );
        })}
        <Vignette W={W} H={H} />
      </svg>
    </AbsoluteFill>
  );
};
