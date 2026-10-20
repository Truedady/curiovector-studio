import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {Head, COCHLEA, LARYNX, MOUTH, HEAD_W, HEAD_H} from './art/Head';
import {Phone, PHONE_W, PHONE_H} from './art/Phone';
import {EarDetail, EAR_W, EAR_H} from './art/EarDetail';
import {Mixer, WaveLine, airWave, mixWave, boneWave, Brain} from './art/Waves';
import {Listener} from './art/Listener';
import {FPS, LINES, SCENES as S} from './timeline';
import {keys, ramp, win} from './geom';
import {C, BODY_FONT, HEAD_FONT, loadFonts} from './theme';

export type Format = 'landscape' | 'shorts';

// Windows (seconds) in which the on-screen character is the one speaking.
const CHAR_TALK: [number, number][] = [
  [8.74, 11.14],
  [17.19, 21.6],
  [23.77, 27.66],
  [33.47, 51.46],
  [56.42, 61.63],
  [83.51, 89.91],
  [94.32, 100.18],
];

const talkAt = (t: number) => {
  let a = 0;
  for (const [s, e] of CHAR_TALK) a = Math.max(a, win(t, s, e, 0.15, 0.2));
  const syll = 0.5 + 0.5 * Math.sin(t * 21) * Math.sin(t * 6.3 + 1);
  return a * (0.25 + 0.75 * Math.abs(syll));
};

type Word = {text: string; color?: string};
const Headline: React.FC<{
  t: number;
  from: number;
  to: number;
  lines: Word[][];
  size: number;
  align: 'left' | 'center';
  x: number;
  y: number;
  w: number;
  stagger?: number;
}> = ({t, from, to, lines, size, align, x, y, w, stagger = 0.12}) => {
  const out = 1 - ramp(t, to - 0.35, to);
  if (t < from - 0.1 || t > to + 0.05) return null;
  let idx = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, opacity: out}}>
      {lines.map((ln, li) => (
        <div key={li} style={{fontFamily: HEAD_FONT, fontWeight: 900, fontSize: size, lineHeight: 1.04, letterSpacing: -0.5, color: C.white, whiteSpace: 'nowrap'}}>
          {ln.map((wd, wi) => {
            const k = ramp(t, from + idx++ * stagger, from + idx * stagger + 0.35);
            return (
              <span key={wi} style={{display: 'inline-block', marginRight: size * 0.24, opacity: k, transform: `translateY(${(1 - k) * size * 0.35}px)`, color: wd.color ?? C.white}}>
                {wd.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Tag: React.FC<{x: number; y: number; op: number; color: string; text: string; size: number; anchor?: 'left' | 'right' | 'center'}> = ({x, y, op, color, text, size, anchor = 'left'}) => {
  if (op <= 0.01) return null;
  const tx = anchor === 'left' ? '0' : anchor === 'right' ? '-100%' : '-50%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, -50%) scale(${0.9 + 0.1 * op})`,
        opacity: op,
        padding: `${size * 0.32}px ${size * 0.6}px`,
        borderRadius: size,
        background: 'rgba(8,19,47,0.86)',
        border: `2px solid ${color}`,
        color,
        fontFamily: BODY_FONT,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const WaveCard: React.FC<{x: number; y: number; w: number; h: number; op: number; t: number; title: string; color: string; fn: (x: number, t: number) => number; under?: string; size: number}> = ({
  x,
  y,
  w,
  h,
  op,
  t,
  title,
  color,
  fn,
  under,
  size,
}) => {
  if (op <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: op, transform: `translateY(${(1 - op) * 30}px)`, borderRadius: 28, background: 'rgba(11,26,61,0.92)', border: `2px solid ${color}55`}}>
      <div style={{position: 'absolute', left: 26, top: 16, fontFamily: BODY_FONT, fontWeight: 600, fontSize: size, color}}>{title}</div>
      <svg width={w - 52} height={h - 70} style={{position: 'absolute', left: 26, top: 58}}>
        {under && <WaveLine w={w - 52} h={h - 70} fn={fn} t={t} color={under} width={12} opacity={0.5} amp={0.6} />}
        <WaveLine w={w - 52} h={h - 70} fn={fn} t={t} color={color} width={5} amp={0.6} />
      </svg>
    </div>
  );
};

export const Episode: React.FC<{format: Format}> = ({format}) => {
  loadFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const L = format === 'landscape';
  const W = L ? 1920 : 1080;
  const H = L ? 1080 : 1920;
  const v = <T,>(land: T, short: T) => (L ? land : short);

  // ---------- master camera for the character ----------
  const camT = [0, 8.3, 9.2, 15.4, 16.6, 23.4, 24.4, 33.3, 34.3, 36.6, 37.6, 44.1, 45.0, 56.0, 57.0, 75.7, 76.6, 83.1, 84.0, 90.0, 91.0, 100.5];
  const hx = keys(t, camT, v(
    [640, 640, 600, 600, 760, 760, 520, 520, 642, 642, 520, 520, 380, 380, 560, 560, 400, 400, 960, 960, 740, 740],
    [470, 470, 480, 480, 500, 500, 470, 470, 475, 475, 470, 470, 300, 300, 400, 400, 270, 270, 530, 530, 380, 380],
  ));
  const hy = keys(t, camT, v(
    [560, 560, 560, 560, 590, 590, 560, 560, 288, 288, 560, 560, 600, 600, 580, 580, 600, 600, 540, 540, 580, 580],
    [930, 930, 900, 900, 880, 880, 720, 720, 820, 820, 720, 720, 610, 610, 820, 820, 560, 560, 720, 720, 800, 800],
  ));
  const hs = keys(t, camT, v(
    [1.12, 1.15, 1.1, 1.1, 1.2, 1.2, 1.15, 1.15, 1.7, 1.7, 1.15, 1.15, 0.85, 0.85, 1.05, 1.05, 0.85, 0.85, 0.9, 0.9, 0.95, 0.95],
    [1.3, 1.32, 1.3, 1.3, 1.36, 1.36, 0.95, 0.95, 1.45, 1.45, 0.95, 0.95, 0.66, 0.66, 1.12, 1.12, 0.6, 0.6, 0.95, 0.95, 0.95, 0.95],
  ));
  const headOp = L ? 1 : 1 - 0.75 * win(t, S.caveat + 0.2, S.mismatch + 0.4, 0.6, 0.6);
  const hp = (x: number, y: number): [number, number] => [hx + (x - HEAD_W / 2) * hs, hy + (y - HEAD_H / 2) * hs];

  // ---------- character state ----------
  const recoil = Math.max(win(t, 2.6, 8.6, 0.45, 0.8), 0.6 * win(t, 71.2, 75.6, 0.4, 0.6), 0.5 * win(t, 90.3, 93.9, 0.4, 0.5));
  const xray = Math.max(win(t, 15.6, 75.6, 1.2, 1.4) * (1 - 0.35 * win(t, 56.2, 62.0, 0.6, 0.6)), 0.85 * win(t, S.mismatch, S.finale + 0.4, 0.8, 0.8));
  const air = Math.max(ramp(t, 17.6, 19.6) * (1 - ramp(t, 56.3, 57.0)), ramp(t, 84.0, 85.8) * (1 - ramp(t, 89.8, 90.6)));
  const airDim = 1 - 0.75 * win(t, 30.6, 36.6, 0.5, 0.6);
  const airFlow = Math.max(win(t, 17.6, 22.0) * 0.6, win(t, 23.7, 30.3), 0.8 * win(t, 37.0, 56.2), win(t, 84.0, 90.0)) * airDim;
  const bone = Math.max(ramp(t, 18.6, 20.6) * (1 - ramp(t, 22.0, 23.0)), ramp(t, 36.9, 39.2) * (1 - ramp(t, 61.8, 62.6)), ramp(t, 84.6, 86.4) * (1 - ramp(t, 89.8, 90.6)));
  const boneFlow = Math.max(0.6 * win(t, 18.6, 22.0), win(t, 36.9, 61.8), win(t, 84.6, 90.0));
  const boneGhost = win(t, 62.3, 75.7, 0.6, 0.6);
  const cords = Math.max(win(t, 33.4, 44.3, 0.4, 0.8), 0.6 * win(t, 56.4, 61.7));
  const waves = Math.max(win(t, 23.7, 30.3), win(t, 56.4, 61.8), win(t, 94.3, 100.4)) ;

  // ---------- phone ----------
  const phoneT = [0, 8.4, 9.0, 11.3, 11.9, 15.2, 15.8, 56.2, 56.9, 75.7, 76.6, 83.0, 83.6, 90.1, 90.6, 94.0, 94.6];
  const phoneOp = keys(t, phoneT, [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0]);
  const px = keys(t, phoneT, v(
    [1050, 1050, 1150, 1150, 1050, 1050, 1150, 1150, 1000, 1000, 960, 960, 960, 960, 1020, 1020, 1150],
    [830, 830, 900, 900, 830, 830, 900, 900, 830, 830, 540, 540, 540, 540, 820, 820, 900],
  ));
  const py = keys(t, phoneT, v(
    [600, 600, 620, 620, 600, 600, 620, 620, 600, 600, 520, 520, 520, 520, 600, 600, 620],
    [1010, 1010, 1040, 1040, 1010, 1010, 1040, 1040, 950, 950, 900, 900, 900, 900, 1010, 1010, 1040],
  ));
  const ps = keys(t, phoneT, v(
    [0.8, 0.8, 0.72, 0.72, 0.8, 0.8, 0.72, 0.72, 0.78, 0.78, 1.1, 1.1, 1.1, 1.1, 0.8, 0.8, 0.72],
    [0.78, 0.78, 0.7, 0.7, 0.78, 0.78, 0.7, 0.7, 0.74, 0.74, 1.1, 1.1, 1.1, 1.1, 0.78, 0.78, 0.7],
  ));
  const hand = t < 16 || t > 90;
  const recording = win(t, 56.4, 62.0, 0.2, 0.2);
  const playing = Math.max(win(t, 0, 8.5, 0.01, 0.4), win(t, 11.5, 15.4), win(t, 62.0, 76.0, 0.2, 0.2), win(t, 76, 83.2), win(t, 90.3, 94.2));
  const waveOut = Math.max(win(t, 0.2, 8.3, 0.3, 0.4), win(t, 11.7, 15.2), win(t, 62.2, 75.6), win(t, 90.4, 94.0));
  const waveIn = Math.max(win(t, 57.0, 61.8), win(t, 76.2, 79.6));

  // ---------- typography ----------
  const hl = v({x: 1300, y: 170, w: 600, size: 84}, {x: 60, y: 190, w: 960, size: 88});
  const hlAlign = v<'left' | 'center'>('left', 'center');
  const H1 = (from: number, to: number, lines: Word[][], over?: Partial<typeof hl>) => {
    const o = {...hl, ...over};
    return <Headline t={t} from={from} to={to} lines={lines} size={o.size} align={hlAlign} x={o.x} y={o.y} w={o.w} />;
  };
  const tagSize = v(30, 34);
  const cur = LINES.find((l) => t >= l.from - 0.1 && t <= l.to + 0.25);

  // anchor points on the character
  const [cx, cy] = hp(COCHLEA[0], COCHLEA[1]);
  const [lx, ly] = hp(LARYNX[0], LARYNX[1]);

  // ear inset placement
  const earOp = Math.max(win(t, 24.2, 30.4, 0.6, 0.5), win(t, 37.6, 44.3, 0.6, 0.6));
  const earS = v(0.78, 1.18);
  const earX = v(1440, 540);
  const earY = v(560, 1170);

  // mixer
  const mixOp = win(t, 44.4, 56.2, 0.6, 0.6);

  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Audio src={staticFile('voiceover.mp3')} />
      <Img src={staticFile(L ? 'plate_landscape.png' : 'plate_shorts.png')} style={{position: 'absolute', width: W, height: H}} />

      {/* inner-voice aura: combined warm + cool light behind the head */}
      <Img
        src={staticFile('glow_orange.png')}
        style={{position: 'absolute', left: hx - 420 * hs, top: hy - 520 * hs, width: 840 * hs, height: 840 * hs, opacity: 0.55 * Math.max(win(t, 8.8, 11.5, 0.5, 0.4), win(t, 51.9, 56.2, 0.5, 0.6), win(t, 83.6, 90.0, 0.6, 0.6))}}
      />
      <Img
        src={staticFile('glow_cyan.png')}
        style={{position: 'absolute', left: hx - 380 * hs, top: hy - 560 * hs, width: 900 * hs, height: 900 * hs, opacity: 0.35 + 0.15 * Math.sin(t * 0.8)}}
      />

      {/* -------- the character -------- */}
      <div style={{position: 'absolute', left: hx - HEAD_W / 2, top: hy - HEAD_H / 2, width: HEAD_W, height: HEAD_H, transform: `scale(${hs})`, opacity: headOp}}>
        <Head t={t} xray={xray} talk={talkAt(t)} recoil={recoil} air={air} airFlow={airFlow} bone={bone} boneFlow={boneFlow} boneGhost={boneGhost} cords={cords} waves={waves} airOpacity={airDim} />
      </div>

      {/* -------- listeners (finale) -------- */}
      {t > 89 &&
        (() => {
          const op = ramp(t, 94.2, 95.4);
          const g = ramp(t, 97.0, 97.8);
          const spots = v(
            [
              [1330, 470, 1.0],
              [1600, 640, 1.1],
            ],
            [
              [900, 660, 0.78],
              [880, 1040, 0.86],
            ],
          );
          return spots.map(([x, y, s], i) => (
            <div key={i} style={{position: 'absolute', left: x - 120, top: y - 150, width: 240, height: 300, transform: `scale(${s}) translateX(${(1 - op) * 80}px)`, opacity: op}}>
              <Listener t={t} seed={i * 2} glow={g} />
            </div>
          ));
        })()}
      {/* voice reaching the listeners through the room */}
      {t > 94 &&
        (() => {
          const [mx, my] = hp(MOUTH[0], MOUTH[1]);
          const op = ramp(t, 94.4, 95.4);
          return (
            <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
              {[0, 1, 2, 3, 4].map((i) => {
                const k = (t * 0.5 + i / 5) % 1;
                const r = 80 + k * v(980, 560);
                return <path key={i} d={`M ${mx + r * 0.6} ${my - r * 0.8} A ${r} ${r} 0 0 1 ${mx + r * 0.6} ${my + r * 0.8}`} stroke={C.cyan} strokeOpacity={op * (1 - k) * 0.7} strokeWidth={5} fill="none" strokeLinecap="round" />;
              })}
            </svg>
          );
        })()}

      {/* -------- phone -------- */}
      {phoneOp > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: px - PHONE_W / 2,
            top: py - PHONE_H / 2,
            width: PHONE_W,
            height: PHONE_H,
            transform: `scale(${ps}) rotate(${hand ? -8 : 0}deg)`,
            opacity: phoneOp,
          }}
        >
          <Phone t={t} recording={recording} playing={playing} waveIn={waveIn} waveOut={waveOut} hand={hand} thin={win(t, 11.5, 15.4) + win(t, 62, 76)} />
        </div>
      )}

      {/* -------- anatomy call-outs -------- */}
      <Tag x={lx + v(110, 90)} y={ly + v(20, 40)} op={win(t, 33.6, 37.2, 0.4, 0.5)} color={C.orange} text="Vocal cords vibrate" size={tagSize} />
      <Tag x={cx - v(30, 20)} y={cy - v(150, 170)} op={win(t, 19.8, 22.2, 0.4, 0.4)} color={C.white} text="Inner ear" size={tagSize} anchor="center" />
      <Tag x={cx - v(20, 10)} y={cy + v(250, 230)} op={win(t, 38.4, 44.0, 0.4, 0.5) * (L ? 0 : 1)} color={C.orange} text="Tissue & bone → inner ear" size={tagSize} anchor="left" />
      <Tag x={hp(600, 400)[0]} y={hp(600, 400)[1] - v(30, 0)} op={win(t, 57.2, 62.0, 0.4, 0.4)} color={C.cyan} text={v('Mic: mostly air-borne sound', 'Mic hears the air')} size={tagSize} anchor="left" />
      <Tag x={v(hp(250, 520)[0], 540)} y={v(hp(250, 520)[1], 1150)} op={win(t, 58.4, 62.0, 0.4, 0.4)} color={C.orange} text="Stays inside" size={tagSize} anchor={v<'right' | 'center'>('right', 'center')} />
      <Tag x={v(hp(250, 520)[0], 540)} y={v(hp(250, 520)[1], 1150)} op={win(t, 63.0, 75.6, 0.5, 0.5)} color={C.orange} text="Missing on playback" size={tagSize} anchor={v<'right' | 'center'>('right', 'center')} />

      {/* -------- scene panels -------- */}
      {earOp > 0.01 && (
        <div style={{position: 'absolute', left: earX - EAR_W / 2, top: earY - EAR_H / 2, width: EAR_W, height: EAR_H, transform: `scale(${earS * (0.92 + 0.08 * earOp)})`, opacity: earOp}}>
          <EarDetail t={t} air={win(t, 24.0, 30.3, 0.6, 0.4) + 0.4 * win(t, 37.6, 44.3)} bone={win(t, 38.0, 44.3, 0.8, 0.5)} labels={ramp(t, 25.0, 25.8)} airLabel={win(t, 24.6, 30.3)} boneLabel={win(t, 38.4, 44.3)} />
        </div>
      )}

      {mixOp > 0.01 && (
        <div style={{position: 'absolute', left: v(820, 80), top: v(220, 930), opacity: mixOp, transform: `scale(${v(1, 0.84)})`, transformOrigin: 'top left'}}>
          <Mixer t={t} w={v(1040, 1100)} air={ramp(t, 44.6, 45.4)} bone={ramp(t, 45.6, 46.4)} mix={ramp(t, 47.0, 48.2)} brain={L ? ramp(t, 51.9, 52.8) : 0} vertical={!L} />
        </div>
      )}
      {!L && mixOp > 0.01 && (
        <div style={{position: 'absolute', left: 700, top: 470, opacity: mixOp * ramp(t, 51.9, 52.8)}}>
          <Brain size={300} glow={1} t={t} />
        </div>
      )}

      {/* contrast cards: the voice you know vs the recording */}
      <WaveCard
        x={v(1300, 70)}
        y={v(560, 1200)}
        w={v(560, 450)}
        h={v(170, 190)}
        op={win(t, 9.4, 15.3, 0.5, 0.5)}
        t={t}
        title="In your head"
        color={C.white}
        under={C.orange}
        fn={mixWave}
        size={v(28, 30)}
      />
      <WaveCard x={v(1300, 560)} y={v(760, 1200)} w={v(560, 450)} h={v(170, 190)} op={win(t, 12.0, 15.3, 0.5, 0.5)} t={t} title="On the recording" color={C.cyan} fn={airWave} size={v(28, 30)} />

      {/* playback: one part missing */}
      <WaveCard x={v(1300, 70)} y={v(560, 1210)} w={v(560, 450)} h={v(170, 190)} op={win(t, 67.4, 75.7, 0.5, 0.5)} t={t} title="Voice you know" color={C.white} under={C.orange} fn={mixWave} size={v(28, 30)} />
      <WaveCard x={v(1300, 560)} y={v(760, 1210)} w={v(560, 450)} h={v(170, 190)} op={win(t, 68.4, 75.7, 0.5, 0.5)} t={t} title="Playback" color={C.cyan} fn={airWave} size={v(28, 30)} />

      {/* caveat: device coloring */}
      {(() => {
        const op = win(t, 76.4, 83.2, 0.5, 0.5);
        if (op <= 0.01) return null;
        const bx = v(1270, 90);
        const by = v(330, 1220);
        return (
          <div style={{position: 'absolute', left: bx, top: by, width: v(600, 900), opacity: op}}>
            <div style={{fontFamily: BODY_FONT, fontWeight: 600, fontSize: v(30, 32), color: C.dim, marginBottom: 14}}>Sound in → device → sound out</div>
            <svg width={v(600, 900)} height={130}>
              <g transform="translate(0 0)">
                <WaveLine w={v(260, 400)} h={120} fn={airWave} t={t} color={C.cyan} amp={0.7} />
              </g>
              <path d={`M ${v(275, 415)} 60 L ${v(325, 485)} 60 M ${v(310, 470)} 46 L ${v(325, 485)} 60 L ${v(310, 470)} 74`} stroke={C.white} strokeWidth={4} fill="none" strokeLinecap="round" />
              <g transform={`translate(${v(340, 500)} 0)`}>
                <WaveLine w={v(260, 400)} h={120} fn={(x, tt) => airWave(x, tt) * (0.75 + 0.25 * Math.sin(x * 0.02))} t={t} color={C.cyan} amp={0.55} opacity={0.9} />
              </g>
            </svg>
          </div>
        );
      })()}

      {/* mismatch cards */}
      <WaveCard x={v(80, 70)} y={v(380, 1110)} w={v(520, 940)} h={v(200, 150)} op={win(t, 84.0, 90.1, 0.6, 0.5)} t={t} title="The voice inside your head" color={C.white} under={C.orange} fn={mixWave} size={v(28, 30)} />
      <WaveCard x={v(1320, 70)} y={v(380, 1280)} w={v(520, 940)} h={v(200, 150)} op={win(t, 85.4, 90.1, 0.6, 0.5)} t={t} title="The voice in the room" color={C.cyan} fn={airWave} size={v(28, 30)} />
      {win(t, 86, 90.1) > 0.01 && (
        <div style={{position: 'absolute', left: v(1150, 940), top: v(470, 1245), transform: 'translate(-50%,-50%)', fontFamily: HEAD_FONT, fontWeight: 900, fontSize: v(110, 70), color: C.orange, opacity: win(t, 86, 90.1)}}>≠</div>
      )}

      {/* -------- headlines (beat by beat) -------- */}
      {H1(0.25, 2.6, [[{text: 'EVER'}, {text: 'HEARD'}], [{text: 'YOUR'}, {text: 'OWN'}], [{text: 'VOICE…', color: C.cyan}]])}
      {H1(2.75, 8.4, [[{text: 'WHO', color: C.orange}, {text: 'IS'}], [{text: 'THAT?!'}]], {size: v(120, 120)})}
      {L ? (
        <>
          {H1(4.1, 8.4, [[{text: 'THINNER.'}]], {y: 470, size: 56})}
          {H1(5.75, 8.4, [[{text: 'HIGHER.'}]], {y: 540, size: 56})}
          {H1(7.0, 8.4, [[{text: 'JUST…'}, {text: 'WRONG.', color: C.orange}]], {y: 610, size: 56})}
        </>
      ) : (
        <Headline t={t} from={4.1} to={8.4} stagger={1.15} lines={[[{text: 'THINNER.'}, {text: 'HIGHER.'}, {text: 'JUST…'}, {text: 'WRONG.', color: C.orange}]]} size={52} align="center" x={0} y={455} w={1080} />
      )}
      {H1(8.8, 11.4, [[{text: 'YOU'}, {text: 'HEAR'}, {text: 'YOURSELF'}], [{text: 'EVERY', color: C.cyan}, {text: 'DAY', color: C.cyan}]], {size: v(64, 76)})}
      {H1(11.6, 15.3, [[{text: 'SO'}, {text: 'WHY'}, {text: 'A'}], [{text: 'STRANGER?', color: C.orange}]], {size: v(76, 88)})}
      {H1(15.7, 23.3, [[{text: 'TWO', color: C.orange}, {text: 'PATHS.'}], [{text: 'SAME'}, {text: 'TIME.'}]], {size: v(84, 92)})}
      {H1(23.8, 30.3, [[{text: 'PATH 1', color: C.cyan}], [{text: 'THROUGH'}, {text: 'THE'}, {text: 'AIR'}]], {size: v(54, 72), y: v(120, 170), x: v(1150, 60), w: v(720, 960)})}
      {H1(30.6, 44.2, [[{text: 'PATH 2', color: C.orange}], [{text: 'THROUGH'}, {text: 'YOUR'}, {text: 'HEAD'}]], {size: v(54, 72), y: v(120, 170), x: v(1150, 60), w: v(720, 960)})}
      {H1(44.5, 51.8, [[{text: 'DEEPER.', color: C.orange}, {text: 'FULLER.'}]], {x: v(820, 60), y: v(90, 190), w: v(1040, 960), size: v(72, 84)})}
      {H1(51.9, 56.1, [[{text: 'YOUR'}, {text: '“NORMAL”', color: C.cyan}, {text: 'VOICE'}]], {x: v(820, 60), y: v(90, 190), w: v(1040, 960), size: v(72, 76)})}
      {H1(56.4, 62.0, [[{text: 'NOW'}, {text: 'PRESS'}], [{text: 'RECORD', color: C.rec}]], {size: v(84, 92)})}
      {H1(62.1, 67.3, [[{text: 'PLAYBACK:'}], [{text: 'NO'}, {text: 'SKULL', color: C.orange}], [{text: 'VIBRATIONS'}]], {size: v(64, 76)})}
      {H1(67.5, 71.1, [[{text: 'ONE'}, {text: 'PART'}], [{text: 'IS'}, {text: 'MISSING', color: C.orange}]], {size: v(72, 84)})}
      {H1(71.2, 75.7, [[{text: 'PERFECTLY'}, {text: 'CLEAR.'}], [{text: 'STILL'}, {text: 'STRANGE.', color: C.orange}]], {size: v(60, 70), x: v(1200, 60)})}
      {H1(76.2, 79.9, [[{text: 'MICS'}, {text: '&'}, {text: 'SPEAKERS'}], [{text: 'COLOR', color: C.cyan}, {text: 'SOUND'}, {text: 'TOO'}]], {size: v(52, 66), y: v(130, 190), x: v(1240, 60)})}
      {H1(80.0, 83.2, [[{text: 'NOT'}, {text: 'JUST'}, {text: 'A'}], [{text: 'BAD', color: C.orange}, {text: 'RECORDING'}]], {size: v(60, 72), y: v(130, 190)})}
      {H1(83.6, 90.1, [[{text: 'A'}, {text: 'MISMATCH', color: C.orange}]], {x: v(0, 60), y: v(110, 190), w: v(1920, 960), size: v(84, 92)})}
      {H1(90.4, 94.1, [[{text: 'NEXT'}, {text: 'TIME'}, {text: 'YOU'}], [{text: 'CRINGE…', color: C.orange}]], {size: v(72, 84)})}
      {H1(94.3, 96.9, [[{text: 'THE'}, {text: 'MIC'}, {text: 'DIDN’T'}], [{text: 'INVENT'}, {text: 'A'}], [{text: 'STRANGER', color: C.orange}]], {size: v(64, 76), x: v(1200, 60), w: v(700, 960)})}
      {H1(97.0, 100.5, [[{text: 'THIS'}, {text: 'IS'}, {text: 'WHAT'}], [{text: 'THEY', color: C.cyan}, {text: 'HEAR', color: C.cyan}]], {size: v(84, 92), x: v(1100, 60), w: v(800, 960), y: v(110, 190)})}

      {/* -------- captions -------- */}
      {cur && (
        <div
          style={{
            position: 'absolute',
            left: v(260, 70),
            width: v(1400, 940),
            top: v(965, 1455),
            textAlign: 'center',
            opacity: Math.min(ramp(t, cur.from - 0.1, cur.from + 0.15), 1 - ramp(t, cur.to + 0.05, cur.to + 0.25)),
          }}
        >
          <span
            style={{
              display: 'inline',
              padding: '6px 16px',
              lineHeight: 1.55,
              borderRadius: 12,
              background: 'rgba(4,10,28,0.72)',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
              fontFamily: BODY_FONT,
              fontWeight: 600,
              fontSize: v(34, 40),
              color: C.white,
            }}
          >
            {cur.text}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
