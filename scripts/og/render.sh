#!/bin/sh
# Renders scripts/og/og.html into public/og.png (1200 x 630) with headless Chrome.
# Usage: scripts/og/render.sh   (from the repo root; macOS Chrome path)
set -e
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --virtual-time-budget=6000 --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og/og.html"
echo "wrote public/og.png"
