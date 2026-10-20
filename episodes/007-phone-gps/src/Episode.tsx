import React from 'react';
import {AbsoluteFill, Audio, Img, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, LayoutCtx, rise} from './lib';
import {FPS, SCENES, XFADE} from './timing';
import {Hook} from './scenes/Hook';
import {Myth} from './scenes/Myth';
import {Broadcast} from './scenes/Broadcast';
import {Flight} from './scenes/Flight';
import {Spheres} from './scenes/Spheres';
import {ClockFix} from './scenes/ClockFix';
import {Relativity} from './scenes/Relativity';
import {Sky} from './scenes/Sky';
import {Finale} from './scenes/Finale';

const ORDER: [keyof typeof SCENES, React.FC<{t: number}>][] = [
  ['hook', Hook],
  ['myth', Myth],
  ['broadcast', Broadcast],
  ['flight', Flight],
  ['spheres', Spheres],
  ['clock', ClockFix],
  ['relativity', Relativity],
  ['sky', Sky],
  ['finale', Finale],
];

// Episode-local font, loaded once before the first frame is captured.
const FONTS: [string, string][] = [
  ['500', 'fonts/InterDisplay-Medium.otf'],
  ['700', 'fonts/InterDisplay-Bold.otf'],
  ['800', 'fonts/InterDisplay-ExtraBold.otf'],
];
let fontsReady: Promise<void> | null = null;
const loadFonts = () => {
  if (!fontsReady) {
    fontsReady = Promise.all(
      FONTS.map(([weight, file]) =>
        new FontFace('CV007 Inter Display', `url(${staticFile(file)})`, {weight}).load().then((f) => {
          document.fonts.add(f);
        }),
      ),
    ).then(() => undefined);
  }
  return fontsReady;
};

export const Episode: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / FPS;
  const P = height > width;
  const L = {W: width, H: height, P};
  const last = ORDER.length - 1;
  const [handle] = React.useState(() => delayRender('CV007 fonts'));
  React.useEffect(() => {
    loadFonts().then(() => continueRender(handle), () => continueRender(handle));
  }, [handle]);

  return (
    <LayoutCtx.Provider value={L}>
      <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
        {/* pre-rasterized starfield, slow drift */}
        <Img
          src={staticFile(P ? 'art/stars_tall.png' : 'art/stars_wide.png')}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: P ? 1215 : 2160,
            height: P ? 2160 : 1215,
            transform: `translate(${-t * 0.9}px, ${-t * 0.5}px)`,
          }}
        />
        {ORDER.map(([key, Scene], i) => {
          const [a, b] = SCENES[key];
          if (t < a - 0.01 || t > b + XFADE) return null;
          const fadeIn = i === 0 ? 1 : rise(t, a, XFADE);
          const fadeOut = i === last ? 1 : 1 - rise(t, b, XFADE);
          const o = fadeIn * fadeOut;
          if (o <= 0.002) return null;
          return (
            <AbsoluteFill key={key} style={{opacity: o}}>
              <Scene t={t} />
            </AbsoluteFill>
          );
        })}
        <Img
          src={staticFile(P ? 'art/vignette_tall.png' : 'art/vignette_wide.png')}
          style={{position: 'absolute', left: 0, top: 0, width, height}}
        />
        <Audio src={staticFile('voiceover.mp3')} />
      </AbsoluteFill>
    </LayoutCtx.Provider>
  );
};
