import React from 'react';

// Stylized human hand seen from above, fingertips at the local origin pointing
// up (-y), forearm with a navy sweater cuff running down (+y).
// `flip` mirrors it into a left hand; `pinch` curls the fingers.
export const HandDefs: React.FC = () => (
  <defs>
    <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F4C9A4" />
      <stop offset="0.55" stopColor="#E2A57C" />
      <stop offset="1" stopColor="#B87655" />
    </linearGradient>
    <linearGradient id="sweater" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#1A2B5E" />
      <stop offset="0.5" stopColor="#2D4688" />
      <stop offset="1" stopColor="#16244F" />
    </linearGradient>
  </defs>
);

const FINGERS = [
  {x: -31, len: 66, a: -9},
  {x: -10, len: 78, a: -3},
  {x: 11, len: 74, a: 3},
  {x: 31, len: 58, a: 10},
];

export const Hand: React.FC<{
  x: number;
  y: number;
  angle?: number;
  scale?: number;
  pinch?: number;
  flip?: boolean;
}> = ({x, y, angle = 0, scale = 1, pinch = 0, flip = false}) => {
  const base = 96;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle}) scale(${flip ? -scale : scale},${scale})`}>
      <g transform={`translate(0,${base})`}>
        {/* forearm + sleeve */}
        <path d="M-40,62 Q-44,200 -50,420 L50,420 Q44,200 40,62 Z" fill="url(#skin)" />
        <path d="M-58,130 Q0,116 58,130 L66,440 L-66,440 Z" fill="url(#sweater)" />
        <path d="M-58,130 Q0,116 58,130 L60,156 Q0,142 -60,156 Z" fill="#3B58A4" />
        {/* fingers */}
        {FINGERS.map((f, i) => {
          const l = f.len * (1 - 0.42 * pinch);
          return (
            <g key={i} transform={`translate(${f.x},-4) rotate(${f.a * (1 - pinch * 0.6)})`}>
              <rect x={-10.5} y={-l} width={21} height={l + 14} rx={10.5} fill="url(#skin)" stroke="#9C5E40" strokeWidth={1.2} strokeOpacity={0.5} />
              <rect x={-6.5} y={-l + 3} width={13} height={14} rx={6} fill="#F9DCC6" opacity={0.8 - pinch * 0.4} />
              <path d={`M-7,${-l * 0.45} q7,4 14,0`} stroke="#A3654A" strokeWidth={1.4} fill="none" opacity={0.5} />
            </g>
          );
        })}
        {/* palm */}
        <path d="M-46,-8 Q-52,40 -42,74 Q0,90 42,74 Q54,40 46,-8 Q0,-18 -46,-8 Z" fill="url(#skin)" />
        <path d="M-38,4 Q0,-6 38,4" stroke="#A3654A" strokeWidth={1.6} fill="none" opacity={0.35} />
        {/* thumb */}
        <g transform={`translate(-42,46) rotate(${-52 + pinch * 30})`}>
          <rect x={-12} y={-64} width={24} height={72} rx={12} fill="url(#skin)" stroke="#9C5E40" strokeWidth={1.2} strokeOpacity={0.5} />
          <rect x={-7} y={-60} width={14} height={14} rx={6} fill="#F9DCC6" opacity={0.75} />
        </g>
      </g>
    </g>
  );
};
