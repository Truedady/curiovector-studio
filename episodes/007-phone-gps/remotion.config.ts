import {Config} from '@remotion/cli/config';

// Episode-local config: never touches the shared repo root.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('swangle');
if (process.env.CV_BROWSER) {
  Config.setBrowserExecutable(process.env.CV_BROWSER);
}
