import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Head, HEAD_W, HEAD_H} from './art/Head';
import {C} from './theme';

// Text-free anatomy QA sheet for the profile character (neutral / recoil / x-ray).
const base = {t: 1, talk: 0, air: 0, airFlow: 0, bone: 0, boneFlow: 0, boneGhost: 0, cords: 0};

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: C.navy}}>
    <Img src={staticFile('plate_landscape.png')} style={{position: 'absolute', width: 2100, height: 1000}} />
    {[
      {xray: 0, recoil: 0},
      {xray: 0, recoil: 1},
      {xray: 1, recoil: 0},
    ].map((st, i) => (
      <div key={i} style={{position: 'absolute', left: 20 + i * 690, top: 100, width: HEAD_W, height: HEAD_H}}>
        <Head {...base} {...st} />
      </div>
    ))}
  </AbsoluteFill>
);
