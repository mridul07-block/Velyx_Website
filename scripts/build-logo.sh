#!/bin/sh
# Traces the official Velyx V (black on white PNG) into public/brand/velyx-v.svg.
# Usage: scripts/build-logo.sh "<source.png>"   (needs ffmpeg + potrace)
set -e
SRC="$1"; TMP="${TMPDIR:-/tmp}/velyx-v"
ffmpeg -loglevel error -y -i "$SRC" -vf "format=gray,lut=y='if(lt(val,128),0,255)',format=monob" "$TMP.pbm"
potrace "$TMP.pbm" -s -o "$TMP.svg" --turdsize 20 --alphamax 1.0 --opttolerance 0.2
python3 - "$TMP.svg" <<'PY'
import re, sys
d = " ".join(re.findall(r'<path d="([^"]+)"', open(sys.argv[1]).read()))
d = re.sub(r"\s+", " ", d).strip()
open("public/brand/velyx-v.svg", "w").write(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="166 384 925 522" fill="currentColor">'
    f'<path transform="translate(0 1254) scale(0.1 -0.1)" d="{d}"/></svg>')
PY
echo "wrote public/brand/velyx-v.svg — copy its path d into src/components/VelyxMark.jsx"
