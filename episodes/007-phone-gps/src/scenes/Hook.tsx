import React from 'react';
import {HIKER_FEET, Mountains, Phone, Satellite} from '../art';
import {C, Fill, Glow, Headline, Tag, map, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 0–16.8 s: remote mountain at night, no bars, no Wi-Fi — yet the blue dot survives.
export const Hook: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const P = L.P;

  // Camera: slow push-in, then tilt up to the sky to hand off to the myth scene.
  const push = map(t, [0, 16.8], [1.0, 1.07]);
  const tilt = map(t, [15.9, 16.8], [0, 1]);

  const vb = P ? '467 120 840 1493' : '0 0 1920 1080';
  const scaleK = P ? 1080 / 840 : 1;
  const hikerX = P ? (HIKER_FEET.x - 467) * scaleK : HIKER_FEET.x;
  const hikerY = P ? (HIKER_FEET.y - 120) * scaleK : HIKER_FEET.y;

  const phone = {
    x: pick(L, 1450, 590),
    y: pick(L, 560, 1215),
    w: pick(L, 350, 360),
  };
  const phoneIn = rise(t, 0, 0.7);
  const s = {
    noService: rise(t, CUE.noService, 0.3),
    mapFail: rise(t, CUE.mapWontLoad + 0.2, 0.8),
    coords: rise(t, CUE.calculate + 0.3, 0.6),
    dot: 1,
    pulse: t,
  };

  const satO = rise(t, CUE.notTracking, 0.7) * (1 - rise(t, CUE.hiking + 0.6, 0.8));
  const drift = t * 6;
  const hx = pick(L, 110, 70);
  const hy = pick(L, 96, 190);
  const hs = pick(L, 82, 76);
  const hw = pick(L, 980, 940);

  return (
    <Fill>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${tilt * pick(L, 260, 420)}px) scale(${push})`,
          transformOrigin: `${hikerX}px ${hikerY}px`,
        }}
      >
        <Glow x={pick(L, 1520, 880)} y={pick(L, 230, 470)} size={pick(L, 700, 640)} color="white" opacity={0.35} />
        <svg width={L.W} height={L.H} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={pick(L, 1520, 880)} cy={pick(L, 230, 470)} r={46} fill="#F3F6FF" />
          <circle cx={pick(L, 1536, 896)} cy={pick(L, 220, 460)} r={40} fill="#D9E3F6" opacity={0.45} />
        </svg>
        <Mountains viewBox={vb} width={L.W} height={L.H} t={t} phoneGlow={0.5 + 0.5 * Math.sin(t * 3)} />
        <Glow x={hikerX + 45 * scaleK} y={hikerY - 116 * scaleK} size={140} color="cyan" opacity={0.8} />
      </div>

      {/* satellites high above — not tracking anyone */}
      <Satellite id="hk1" t={t} x={pick(L, 560, 210) + drift} y={pick(L, 170, 520)} scale={0.42} rot={-12} opacity={satO} glow={0.4} />
      <Satellite id="hk2" t={t} x={pick(L, 1080, 860) + drift} y={pick(L, 120, 600)} scale={0.36} rot={8} opacity={satO} glow={0.4} />
      <Tag t={t} at={CUE.notTracking + 0.5} out={CUE.hiking + 0.8} x={pick(L, 820, 540)} y={pick(L, 270, 710)} text="not tracking you" color={C.orange} size={pick(L, 26, 30)} />

      {/* phone */}
      <div style={{position: 'absolute', inset: 0, opacity: phoneIn * (1 - tilt), transform: `translateY(${(1 - phoneIn) * 60}px)`}}>
        <Phone x={phone.x} y={phone.y} w={phone.w} s={s} rot={pick(L, -4, -3)} glow={0.75} />
      </div>
      <Tag
        t={t}
        at={CUE.noService}
        out={CUE.calculate + 0.2}
        x={pick(L, phone.x - 240, 300)}
        y={pick(L, phone.y - 330, 790)}
        text="no bars · no wi-fi"
        color={C.orange}
        size={pick(L, 26, 30)}
        anchor={pick<'left' | 'center' | 'right'>(L, 'right', 'center')}
      />
      <Tag
        t={t}
        at={CUE.mapWontLoad + 0.6}
        out={16.6}
        x={pick(L, phone.x - 250, 300)}
        y={pick(L, phone.y - 250, 790)}
        text="map: ✕   position: ✓"
        color={C.cyan}
        size={pick(L, 26, 30)}
        anchor={pick<'left' | 'center' | 'right'>(L, 'right', 'center')}
      />

      {/* headlines */}
      <Headline t={t} at={0} out={CUE.notTracking} x={hx} y={hy} size={hs} width={hw} text="Your phone can find you *without internet.*" lift={0} />
      <Headline t={t} at={CUE.notTracking} out={CUE.hiking} x={hx} y={hy} size={hs} width={hw} text="But the satellites *aren't tracking you.*" />
      <Headline t={t} at={CUE.hiking} out={CUE.calculate} x={hx} y={hy} size={hs} width={hw} text="Somewhere remote." />
      <Headline t={t} at={CUE.noService} out={CUE.calculate} x={hx} y={hy + hs * 1.1} size={hs} width={hw} text="*No service. No Wi-Fi.*" />
      <Headline t={t} at={CUE.calculate} out={CUE.howKnow} x={hx} y={hy} size={hs} width={hw} text="Yet it still knows *where you are.*" />
      <Headline
        t={t}
        at={CUE.mapWontLoad}
        out={CUE.howKnow}
        x={hx}
        y={hy + hs * pick(L, 1.15, 2.2)}
        size={hs * 0.52}
        width={hw}
        weight={600}
        color={C.dim}
        text="Even when the map itself won't load."
      />
      <Headline t={t} at={CUE.howKnow} out={16.75} x={hx} y={hy} size={hs * 1.25} width={hw} text="So how does it *know?*" />
    </Fill>
  );
};
