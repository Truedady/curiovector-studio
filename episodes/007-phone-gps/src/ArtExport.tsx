import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Mountains, PhoneVector} from './art';
import {useEpisodeFonts} from './fonts';
import {LayoutCtx} from './lib';

// Static artwork baked to transparent PNGs once (scripts/export_art.mjs) so the
// episode never re-rasterizes these vector layers per frame.

export const PHONE_EXPORT_W = 820;
export const PHONE_EXPORT_H = Math.round(PHONE_EXPORT_W * 2.08);

export const ArtPhone: React.FC<{offline: boolean}> = ({offline}) => {
  useEpisodeFonts();
  return (
  <AbsoluteFill>
    <PhoneVector
      x={PHONE_EXPORT_W / 2}
      y={PHONE_EXPORT_H / 2}
      w={PHONE_EXPORT_W}
      glow={0}
      s={{noService: 0, mapFail: offline ? 1 : 0, coords: 0, dot: 0, pulse: 0}}
    />
  </AbsoluteFill>
  );
};

export const ArtMountains: React.FC<{portrait: boolean}> = ({portrait}) => {
  const W = portrait ? 1080 : 1920;
  const H = portrait ? 1920 : 1080;
  return (
    <LayoutCtx.Provider value={{W, H, P: portrait}}>
      <AbsoluteFill>
        <Mountains viewBox={portrait ? '467 120 840 1493' : '0 0 1920 1080'} width={W} height={H} t={0} phoneGlow={1} />
      </AbsoluteFill>
    </LayoutCtx.Provider>
  );
};
