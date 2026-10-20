import {Config} from '@remotion/cli/config';

// Episode-local configuration only — never touches the shared root.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('swangle');

// Cloud containers ship a pre-installed headless Chromium; use it when present
// instead of downloading one (remotion.media is not reachable from the sandbox).
import fs from 'node:fs';
const LOCAL_SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (!process.env.REMOTION_BROWSER && fs.existsSync(LOCAL_SHELL)) {
  Config.setBrowserExecutable(LOCAL_SHELL);
} else if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
