import fs from 'node:fs';
import {Config} from '@remotion/cli/config';

// Episode-local config: never touches the shared repo root.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setAudioCodec('aac');
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);

// Claude Code Cloud ships a pre-installed headless shell; use it when present
// instead of downloading one.
const cloudShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(cloudShell)) {
	Config.setBrowserExecutable(cloudShell);
}
