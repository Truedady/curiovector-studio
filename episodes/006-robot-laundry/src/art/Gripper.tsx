import React from 'react';
import {C} from '../lib/theme';

// Two-finger parallel gripper on a jointed arm. Local origin = point between
// the fingertips; fingers point down (+y), arm runs up (-y).
export const GripperDefs: React.FC = () => (
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#1B2850" />
      <stop offset="0.35" stopColor="#5D73AA" />
      <stop offset="0.55" stopColor="#8EA2D2" />
      <stop offset="1" stopColor="#1E2B55" />
    </linearGradient>
    <linearGradient id="steelDark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#111B3A" />
      <stop offset="0.5" stopColor="#34477C" />
      <stop offset="1" stopColor="#121C3D" />
    </linearGradient>
    <linearGradient id="palmG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6378B0" />
      <stop offset="1" stopColor="#25345F" />
    </linearGradient>
    <radialGradient id="lensG">
      <stop offset="0" stopColor="#E6F8FF" />
      <stop offset="0.35" stopColor={C.cyan} />
      <stop offset="1" stopColor="#0A3A55" />
    </radialGradient>
    <radialGradient id="glowC">
      <stop offset="0" stopColor={C.cyan} stopOpacity={0.55} />
      <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="glowO">
      <stop offset="0" stopColor={C.orange} stopOpacity={0.55} />
      <stop offset="1" stopColor={C.orange} stopOpacity={0} />
    </radialGradient>
  </defs>
);

export const Gripper: React.FC<{
  x: number;
  y: number;
  angle?: number;
  open?: number;
  scale?: number;
  arm?: number;
  status?: 'ok' | 'warn' | 'idle';
}> = ({x, y, angle = 0, open = 0.5, scale = 1, arm = 900, status = 'idle'}) => {
  const gap = 10 + open * 46;
  const led = status === 'warn' ? C.orange : C.cyan;
  const finger = (s: number) => (
    <g transform={`translate(${s * gap},0)`}>
      <path
        d={`M${s * 2},-74 L${s * 30},-74 L${s * 26},-8 Q${s * 24},4 ${s * 12},4 L${s * 2},4 Z`}
        fill="url(#steelDark)"
        stroke="#0B1330"
        strokeWidth={2}
      />
      <rect x={s > 0 ? -1 : -7} y={-56} width={8} height={54} rx={3} fill="#2A2F3A" />
      <rect x={s > 0 ? 0 : -6} y={-50} width={6} height={42} rx={2} fill={C.orange} opacity={0.85} />
      <line x1={s * 10} y1={-66} x2={s * 22} y2={-66} stroke="#8EA2D2" strokeWidth={2} opacity={0.6} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) rotate(${angle}) scale(${scale})`}>
      {/* forearm */}
      <rect x={-34} y={-150 - arm} width={68} height={arm} rx={30} fill="url(#steel)" />
      <rect x={-6} y={-140 - arm} width={4} height={arm - 30} fill={C.cyan} opacity={0.35} />
      {/* wrist joint */}
      <circle cx={0} cy={-150} r={46} fill="url(#steelDark)" stroke="#0B1330" strokeWidth={3} />
      <circle cx={0} cy={-150} r={34} fill="none" stroke={led} strokeWidth={3} opacity={0.85} />
      <circle cx={0} cy={-150} r={60} fill={`url(#${status === 'warn' ? 'glowO' : 'glowC'})`} opacity={0.6} />
      <circle cx={0} cy={-150} r={9} fill={led} />
      {/* palm block */}
      <path d="M-82,-118 Q-82,-128 -72,-128 L72,-128 Q82,-128 82,-118 L76,-72 Q74,-66 66,-66 L-66,-66 Q-74,-66 -76,-72 Z" fill="url(#palmG)" stroke="#0B1330" strokeWidth={2.5} />
      <path d="M-70,-120 L70,-120" stroke="#A8B9E4" strokeWidth={2} opacity={0.55} />
      <rect x={-60} y={-84} width={120} height={9} rx={4} fill="#101935" />
      {/* wrist camera */}
      <circle cx={52} cy={-100} r={11} fill="#0A1230" stroke="#6F84BC" strokeWidth={2} />
      <circle cx={52} cy={-100} r={6} fill="url(#lensG)" />
      {finger(-1)}
      {finger(1)}
    </g>
  );
};
