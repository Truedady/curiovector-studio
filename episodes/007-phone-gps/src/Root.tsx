import React from 'react';
import {Composition, Folder} from 'remotion';
import {ArtMountains, ArtPhone, PHONE_EXPORT_H, PHONE_EXPORT_W} from './ArtExport';
import {Episode} from './Episode';
import {DURATION_IN_FRAMES, FPS} from './timing';

export const Root: React.FC = () => (
  <>
    <Composition id="CV007GPSLandscape" component={Episode} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="CV007GPSShorts" component={Episode} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1080} height={1920} />
    <Folder name="CV007-art-export">
      <Composition id="CV007ArtPhoneMap" component={ArtPhone} defaultProps={{offline: false}} durationInFrames={1} fps={FPS} width={PHONE_EXPORT_W} height={PHONE_EXPORT_H} />
      <Composition id="CV007ArtPhoneOffline" component={ArtPhone} defaultProps={{offline: true}} durationInFrames={1} fps={FPS} width={PHONE_EXPORT_W} height={PHONE_EXPORT_H} />
      <Composition id="CV007ArtMountainsWide" component={ArtMountains} defaultProps={{portrait: false}} durationInFrames={1} fps={FPS} width={1920} height={1080} />
      <Composition id="CV007ArtMountainsTall" component={ArtMountains} defaultProps={{portrait: true}} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    </Folder>
  </>
);
