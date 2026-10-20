import React from 'react';
import {Img, staticFile} from 'remotion';
import {Head, Look, HEAD_W, HEAD_H, EAR_OPENING} from './Head';

// A friend listening across the room. Built on the SAME approved head anatomy as the
// narrator (mirrored to face left), with a different palette/hair — no separate face drawing.
// Box 240 × 300 so existing scene placement is unchanged.
const K = 0.36;
const LOOKS: Look[] = [
  {id: 'cv9-l0', skin: ['#6E4632', '#9A6448', '#B57A58'], neck: ['#583626', '#8A5A40'], hair: ['#0F0F1C', '#1C1A2C', '#2C2840'], top: ['#1D4E6E', '#123450'], longHair: true},
  {id: 'cv9-l1', skin: ['#C48A68', '#EDBB98', '#F8D3B4'], neck: ['#9E6A50', '#DDA582'], hair: ['#4A2A1A', '#6A3E26', '#875234'], top: ['#7A3B2E', '#55261E']},
];
const still = {talk: 0, recoil: 0, xray: 0, air: 0, airFlow: 0, bone: 0, boneFlow: 0, boneGhost: 0, cords: 0, waves: 0};

export const Listener: React.FC<{glow: number; t: number; seed: number}> = ({glow, t, seed}) => {
  const nod = Math.sin(t * 2 + seed) * 1.5;
  const earX = (HEAD_W - EAR_OPENING[0]) * K;
  const earY = EAR_OPENING[1] * K;
  return (
    <div style={{position: 'relative', width: 240, height: 300}}>
      <div style={{position: 'absolute', left: (240 - HEAD_W * K) / 2, top: 300 - HEAD_H * K, width: HEAD_W, height: HEAD_H, transformOrigin: 'top left', transform: `scale(${-K}, ${K}) translateX(${-HEAD_W}px) rotate(${nod}deg)`}}>
        <Head t={t} {...still} look={LOOKS[seed ? 1 : 0]} />
      </div>
      <Img src={staticFile('glow_cyan.png')} style={{position: 'absolute', left: (240 - HEAD_W * K) / 2 + earX - 50, top: 300 - HEAD_H * K + earY - 50, width: 100, height: 100, opacity: glow * (0.7 + 0.3 * Math.sin(t * 6 + seed))}} />
    </div>
  );
};
