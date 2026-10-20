import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

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

/** Blocks frame capture until the episode font is loaded. */
export const useEpisodeFonts = () => {
  const [handle] = React.useState(() => delayRender('CV007 fonts'));
  React.useEffect(() => {
    loadFonts().then(
      () => continueRender(handle),
      () => continueRender(handle),
    );
  }, [handle]);
};
