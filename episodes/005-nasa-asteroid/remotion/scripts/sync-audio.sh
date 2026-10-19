#!/usr/bin/env bash
# Copies the episode voiceover into public/ (the bundler does not follow symlinks).
set -euo pipefail
cd "$(dirname "$0")/.."
cmp -s ../Nasa.mp3 public/Nasa.mp3 2>/dev/null || cp ../Nasa.mp3 public/Nasa.mp3
