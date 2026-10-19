#!/usr/bin/env bash
# Renders review stills for both compositions: ./scripts/stills.sh [seconds...]
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/stills
./scripts/sync-audio.sh
npx remotion bundle src/index.ts --out-dir out/bundle >/dev/null
[ $# -eq 0 ] && set -- 1.2 62.5 120
for sec in "$@"; do
  frame=$(python3 -c "print(int(round(float('$sec')*30)))")
  for comp in CurioVectorNASA005Landscape CurioVectorNASA005Shorts; do
    npx remotion still out/bundle "$comp" "out/stills/${comp#CurioVectorNASA005}_${sec}s.png" --frame="$frame" --log=error
  done
done
