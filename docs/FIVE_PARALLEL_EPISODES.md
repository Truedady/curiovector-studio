# Batch 007–011 — Five Parallel Claude Code Sessions

Five independent task branches share one source repository:
- `episode/007-phone-gps` → `episodes/007-phone-gps/`
- `episode/008-elevator` → `episodes/008-elevator/`
- `episode/009-recorded-voice` → `episodes/009-recorded-voice/`
- `episode/010-undersea-internet` → `episodes/010-undersea-internet/`
- `episode/011-noise-canceling` → `episodes/011-noise-canceling/`

## The one upload the user must perform

Upload the supplied single audio archive `curiovector_voiceovers_007-011.zip` to the **root of the main branch**, using GitHub → `curiovector-studio` → `main` → **Add file / Upload files**. DO NOT unzip or rename before uploading. Confirm the root link works.

The ChatGPT-connected GitHub action handles UTF-8 source code and text changes, but not passing local uploaded binary MP3 bytes directly. This archive avoids asking for five separate GitHub uploads.

Archive entries:
- `voiceovers/007-gps.mp3`
- `voiceovers/008-elevator.mp3`
- `voiceovers/009-voice.mp3`
- `voiceovers/010-undersea-internet.mp3`
- `voiceovers/011-noise-canceling.mp3`
- `manifest.json` with SHA256 and duration.

Each episode-specific `CLAUDE_TASK.md` tells Claude to fetch the archive from `main`, extract only its own file to a local `voiceover.mp3`, and use it as master. The `voiceover.mp3` should be **untracked/ignored**; the source archive is in GitHub main.

## Starting Claude
Open five independent Claude Code Cloud sessions, each with the *same GitHub repository* but a DIFFERENT target base branch. Set the selected base branch before starting; Claude can create its own task branch **from** the selected branch.

Send each:

`Read episodes/007-phone-gps/CLAUDE_TASK.md and carry out the task exactly, without editing files outside that episode.`

...with the matching path for each job.

**Do not start the render until the archive is in main.** Initial `main` may be newer than the episode branches because the archive was uploaded after branches were created; `git fetch origin main` and `git show FETCH_HEAD:curiovector_voiceovers_007-011.zip` are intentional. Do NOT merge main into the task branch just to obtain the zip.

## Warning
Five simultaneously active Claude sessions will consume your account's shared usage budget and may lengthen runtime. Stagger actual exports if their cloud resources are slow. Monitor progress; each session should validate its files before proceeding.
