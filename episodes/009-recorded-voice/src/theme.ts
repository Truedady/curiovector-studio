import {continueRender, delayRender, staticFile} from 'remotion';

export const C = {
  navy: '#08132F',
  cyan: '#43C5F5',
  orange: '#FF923E',
  white: '#F8FAFF',
  dim: '#9FB3D9',
  rec: '#FF5468',
};

export const HEAD_FONT = 'CV9Montserrat, sans-serif';
export const BODY_FONT = 'CV9Inter, sans-serif';

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('cv9-fonts');
  const faces = [
    new FontFace('CV9Montserrat', `url(${staticFile('fonts/montserrat-latin-800-normal.woff2')})`, {weight: '800'}),
    new FontFace('CV9Montserrat', `url(${staticFile('fonts/montserrat-latin-900-normal.woff2')})`, {weight: '900'}),
    new FontFace('CV9Inter', `url(${staticFile('fonts/inter-latin-500-normal.woff2')})`, {weight: '500'}),
    new FontFace('CV9Inter', `url(${staticFile('fonts/inter-latin-600-normal.woff2')})`, {weight: '600'}),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((fs) => {
      fs.forEach((f) => (document.fonts as unknown as Set<FontFace>).add(f));
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
