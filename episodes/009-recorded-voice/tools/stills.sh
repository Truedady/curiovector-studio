#!/usr/bin/env bash
# Usage: tools/stills.sh <prefix> <frame> [frame...]  — renders L_ and S_ stills from one bundle.
set -e
cd "$(dirname "$0")/.."
npx remotion bundle src/index.ts --out-dir=.tmp-bundle >/dev/null 2>&1
prefix=$1; shift
for f in "$@"; do
  npx remotion still .tmp-bundle CV009VoiceLandscape "stills/${prefix}L_${f}.png" --frame="$f" >/dev/null 2>&1 &
  npx remotion still .tmp-bundle CV009VoiceShorts "stills/${prefix}S_${f}.png" --frame="$f" >/dev/null 2>&1
  wait
done
ls stills | tail -n $(( $# * 2 ))
