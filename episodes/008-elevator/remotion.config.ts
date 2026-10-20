import fs from 'node:fs';
import {Config} from '@remotion/cli/config';

// Episode-local config: never touches the repo root.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setOverwriteOutput(true);

// Claude Code Cloud ships a pre-installed headless Chromium; reuse it instead of downloading one.
const preinstalled = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(preinstalled)) {
	Config.setBrowserExecutable(preinstalled);
}
