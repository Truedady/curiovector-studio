import React from 'react';
import {staticFile} from 'remotion';
import {C, BODY_FONT} from '../theme';

// Smartphone voice-memo app. Artboard 260 × 520 (+ optional hand below).
export const PHONE_W = 260;
export const PHONE_H = 520;

export type PhoneProps = {
  t: number;
  recording: number; // 0..1 red REC state
  playing: number; // 0..1 playback state (bars move)
  waveIn: number; // cyan arcs arriving at the microphone (bottom)
  waveOut: number; // cyan arcs leaving the speaker (top-left, toward the ear)
  hand?: boolean;
  thin?: number; // playback waveform looks thinner
};

export const Phone: React.FC<PhoneProps> = ({t, recording, playing, waveIn, waveOut, hand, thin = 0}) => {
  const bars = 26;
  const active = Math.max(recording, playing);
  return (
    <svg width={PHONE_W} height={PHONE_H + (hand ? 140 : 0)} viewBox={`0 0 ${PHONE_W} ${PHONE_H + (hand ? 140 : 0)}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="cv9-phone-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A3B63" />
          <stop offset="1" stopColor="#0E1A38" />
        </linearGradient>
        <linearGradient id="cv9-phone-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F2552" />
          <stop offset="1" stopColor="#081633" />
        </linearGradient>
      </defs>
      {/* outgoing speaker waves (toward the listener's ear, up-left) */}
      {waveOut > 0.01 &&
        [0, 1, 2].map((i) => {
          const k = (t * 1.2 + i / 3) % 1;
          const r = 30 + k * 120;
          return (
            <path
              key={`o${i}`}
              d={`M ${130 - r} ${30 + r * 0.25} A ${r} ${r} 0 0 1 ${130 + r * 0.25} ${30 - r}`}
              stroke={C.cyan}
              strokeOpacity={(1 - k) * waveOut}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      <rect x={4} y={4} width={252} height={512} rx={42} fill="url(#cv9-phone-body)" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={3} />
      <rect x={18} y={20} width={224} height={480} rx={30} fill="url(#cv9-phone-screen)" />
      <rect x={100} y={30} width={60} height={8} rx={4} fill="#050B1C" />
      {/* app header */}
      <circle cx={46} cy={74} r={9} fill={C.rec} opacity={recording > 0.5 ? 0.6 + 0.4 * Math.sin(t * 8) : 0.25} />
      <text x={64} y={80} fill={C.white} fontFamily={BODY_FONT} fontWeight={600} fontSize={19}>
        {recording > 0.5 ? 'Recording' : 'Voice memo'}
      </text>
      <text x={130} y={140} textAnchor="middle" fill={C.white} fontFamily={BODY_FONT} fontWeight={600} fontSize={34} opacity={0.9}>
        {`0:${String(Math.floor(2 + (t % 50))).padStart(2, '0')}`}
      </text>
      {/* waveform bars */}
      <g>
        {Array.from({length: bars}).map((_, i) => {
          const x = 34 + i * 7.4;
          const env = Math.sin((i / bars) * Math.PI);
          const wob = 0.5 + 0.5 * Math.sin(t * 9 + i * 1.7) * Math.sin(t * 3.1 + i * 0.6);
          const h = 8 + env * (20 + 80 * wob * active) * (1 - 0.45 * thin);
          return <rect key={i} x={x} y={250 - h / 2} width={4.4} height={h} rx={2.2} fill={i / bars < ((t * 0.25) % 1) ? C.cyan : '#4B6A9E'} />;
        })}
      </g>
      {/* play / record button */}
      <circle cx={130} cy={410} r={36} fill="none" stroke={C.white} strokeOpacity={0.7} strokeWidth={4} />
      {recording > 0.5 ? (
        <rect x={114} y={394} width={32} height={32} rx={8} fill={C.rec} />
      ) : (
        <path d="M 120 392 L 148 410 L 120 428 Z" fill={C.white} />
      )}
      {/* microphone port */}
      <g>
        {[-12, -4, 4, 12].map((d) => (
          <circle key={d} cx={130 + d} cy={508} r={2.2} fill="#7E93C2" />
        ))}
      </g>
      {/* incoming air waves into the microphone (from above-left: the speaker's mouth) */}
      {waveIn > 0.01 && (
        <>
          <image href={staticFile('glow_cyan.png')} x={70} y={448} width={120} height={120} opacity={waveIn * 0.8} />
          {[0, 1, 2].map((i) => {
            const k = 1 - ((t * 1.2 + i / 3) % 1);
            const r = 16 + k * 120;
            return (
              <path
                key={`i${i}`}
                d={`M ${130 - r} ${512 - r * 0.35} A ${r} ${r} 0 0 0 ${130 - r * 0.2} ${512 + r}`}
                stroke={C.cyan}
                strokeOpacity={(1 - k) * waveIn}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </>
      )}
      {hand && (
        <g>
          <path d="M 70 600 L 76 660 L 196 660 L 200 600 Z" fill="#C8825F" />
          <path d="M 40 486 C 30 560 70 624 136 628 C 200 628 232 580 228 486 C 200 520 70 520 40 486 Z" fill="#D7936F" />
          {[330, 384, 438].map((y) => (
            <path key={y} d={`M 18 ${y} C -2 ${y + 6} -2 ${y + 30} 18 ${y + 34}`} stroke="#C8825F" strokeWidth={26} strokeLinecap="round" fill="none" />
          ))}
          <path d="M 236 470 C 254 440 256 400 244 378" stroke="#D7936F" strokeWidth={28} strokeLinecap="round" fill="none" />
          <path d="M 70 580 C 110 598 170 598 206 580" stroke="#9B5E47" strokeOpacity={0.5} strokeWidth={4} fill="none" />
        </g>
      )}
    </svg>
  );
};
