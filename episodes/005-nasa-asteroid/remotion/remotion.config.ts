import {existsSync} from 'fs';
import {Config} from '@remotion/cli/config';

// Cloud containers ship Playwright's headless shell; use it instead of downloading Chrome.
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(shell)) {
  Config.setBrowserExecutable(shell);
}
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setCodec('h264');
Config.setCrf(18);
