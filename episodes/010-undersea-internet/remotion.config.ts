// Episode-local Remotion config (episode 010 only — never shared with sibling episodes).
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setCrf(18);
Config.setOverwriteOutput(true);
// Use the pre-installed headless shell instead of downloading another browser.
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
