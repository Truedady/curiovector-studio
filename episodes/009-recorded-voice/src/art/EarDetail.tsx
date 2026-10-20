import React from 'react';
import {staticFile} from 'remotion';
import {Curve, curveD, pointAt, sample} from '../geom';
import {C, BODY_FONT} from '../theme';

// Editorial cut-away of the ear. Artboard 760 × 480.
export const EAR_W = 760;
export const EAR_H = 480;

const CO: [number, number] = [540, 236];
const spiral = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 140; i++) {
    const k = i / 140;
    const a = -Math.PI / 2 + k * 2.75 * Math.PI * 2;
    const r = 74 * (1 - 0.86 * k);
    pts.push(`${(CO[0] + Math.cos(a) * r).toFixed(1)} ${(CO[1] + Math.sin(a) * r).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
})();

const BONE_IN: Curve = {start: [700, 470], segs: [[660, 420, 600, 360, 560, 300], [550, 280, 545, 260, CO[0], CO[1]]]};
const BONE_IN_S = sample(BONE_IN);

export type EarProps = {t: number; air: number; bone: number; labels: number; airLabel?: number; boneLabel?: number};

export const EarDetail: React.FC<EarProps> = ({t, air, bone, labels, airLabel = 0, boneLabel = 0}) => {
  const drumWob = Math.sin(t * 34) * 3 * Math.max(air, bone * 0.6);
  return (
    <svg width={EAR_W} height={EAR_H} viewBox={`0 0 ${EAR_W} ${EAR_H}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="cv9-bone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1C2F5C" />
          <stop offset="1" stopColor="#132448" />
        </linearGradient>
        <linearGradient id="cv9-pinna" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C98361" />
          <stop offset="1" stopColor="#E9AA82" />
        </linearGradient>
      </defs>
      {/* card */}
      <rect x={0} y={0} width={EAR_W} height={EAR_H} rx={36} fill="#0B1A3D" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={2} />
      {/* temporal bone mass */}
      <path d="M 340 40 C 460 20 640 40 720 110 C 740 220 740 360 700 440 C 560 470 420 460 350 420 C 330 300 330 160 340 40 Z" fill="url(#cv9-bone)" />
      <path
        d="M 340 40 C 460 20 640 40 720 110 C 740 220 740 360 700 440 C 560 470 420 460 350 420 C 330 300 330 160 340 40 Z"
        fill="none"
        stroke={C.orange}
        strokeOpacity={0.15 + 0.55 * bone * (0.6 + 0.4 * Math.sin(t * 16))}
        strokeWidth={3}
      />
      {/* outer ear */}
      <path d="M 150 70 C 70 70 40 160 56 240 C 70 320 110 400 170 410 C 200 400 196 360 176 340 C 150 312 164 290 182 270 L 190 200 C 200 130 200 74 150 70 Z" fill="url(#cv9-pinna)" />
      <path d="M 150 100 C 100 110 84 180 96 240 C 106 296 140 340 160 344" stroke="#9B5E47" strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* ear canal */}
      <path d="M 178 200 C 240 196 300 198 360 204 M 178 270 C 240 274 300 272 360 266" stroke={C.white} strokeOpacity={0.7} strokeWidth={4} fill="none" />
      <path d="M 178 200 L 360 204 L 360 266 L 178 270 Z" fill={C.cyan} fillOpacity={0.06} />
      {/* air waves travelling down the canal */}
      {air > 0.01 &&
        [0, 1, 2, 3].map((i) => {
          const k = (t * 0.9 + i / 4) % 1;
          const x = 120 + k * 236;
          return <path key={i} d={`M ${x} 208 Q ${x + 16} 235 ${x} 262`} stroke={C.cyan} strokeOpacity={air * Math.min(1, (1 - k) * 3, k * 5)} strokeWidth={6} fill="none" strokeLinecap="round" />;
        })}
      {/* eardrum */}
      <ellipse cx={364 + drumWob} cy={235} rx={8} ry={40} fill={C.white} fillOpacity={0.85} />
      {/* ossicles */}
      <g stroke={C.white} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.9}>
        <path d={`M ${376 + drumWob} 214 L 410 196 L 428 214`} />
        <path d="M 428 214 L 452 236 L 472 236" />
      </g>
      {/* cochlea */}
      <image href={staticFile('glow_white.png')} x={CO[0] - 120} y={CO[1] - 120} width={240} height={240} opacity={0.15 + 0.5 * Math.max(air, bone)} />
      <path d={spiral} stroke={C.white} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={spiral} stroke={air > bone ? C.cyan : C.orange} strokeOpacity={Math.max(air, bone) * 0.9} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* auditory nerve */}
      <path d="M 600 200 C 640 170 680 150 740 140" stroke="#F3D27A" strokeOpacity={0.8} strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* bone-conducted vibration entering the cochlea */}
      {bone > 0.01 && (
        <g opacity={bone}>
          <path d={curveD(BONE_IN)} stroke={C.orange} strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" fill="none" />
          {[0, 1, 2].map((i) => {
            const f = (t * 0.7 + i / 3) % 1;
            const [x, y] = pointAt(BONE_IN_S, f);
            return <image key={i} href={staticFile('spark_orange.png')} x={x - 30} y={y - 30} width={60} height={60} />;
          })}
        </g>
      )}
      {/* labels */}
      <g opacity={labels} fontFamily={BODY_FONT} fontWeight={600} fontSize={24} fill={C.white}>
        <text x={190} y={326}>Ear canal</text>
        <path d="M 250 300 L 260 274" stroke={C.white} strokeOpacity={0.5} strokeWidth={2} />
        <text x={300} y={150}>Eardrum</text>
        <path d="M 350 158 L 362 190" stroke={C.white} strokeOpacity={0.5} strokeWidth={2} />
        <text x={470} y={372}>Cochlea</text>
        <text x={470} y={400} fontSize={20} fill={C.dim}>
          inner ear
        </text>
      </g>
      <g fontFamily={BODY_FONT} fontWeight={600} fontSize={22}>
        <text x={36} y={452} fill={C.cyan} opacity={airLabel}>
          ● through the air
        </text>
        <text x={724} y={40 + 0} textAnchor="end" fill={C.orange} opacity={boneLabel}>
          through bone &amp; tissue ●
        </text>
      </g>
    </svg>
  );
};
