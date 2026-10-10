import { LOGO_ICON } from "../../lib/brand";
import { Guides, Handles, Layer, Patterns } from "./iso";
import { floor, wall } from "./isoMatrix";

/* A stack of website pages stands in a row; a wave rolls through it and
   the pages fan forward on hover. The front page is a live landing page. */
const PANELS = [0, 1, 2, 3, 4];

function Page({ i }) {
  const front = i === PANELS.length - 1;
  if (!front) {
    return (
      <>
        <rect width="110" height="140" rx="4" className={i === 0 ? "p-dim" : "p-solid"} />
        {i === 3 && <text x="10" y="30" fontSize="17" className="t">NEXT.JS</text>}
        {i === 1 && <rect x="8" y="80" width="94" height="50" fill="url(#we-hatch)" />}
        <path d="M10 44h60M10 52h40" className="ln" />
      </>
    );
  }
  return (
    <>
      <rect width="110" height="140" rx="4" className="p-top" />
      <path d="M0 14h110" className="ln" />
      {[8, 14, 20].map((x) => <circle key={x} cx={x} cy="7" r="1.8" className="ln-bright" />)}
      <rect x="34" y="4" width="50" height="6" rx="3" className="ln" />
      <image href={LOGO_ICON} x="10" y="22" width="16" height="16" />
      <rect x="10" y="46" width="70" height="7" rx="1" className="fill-hi" />
      <rect x="10" y="57" width="50" height="7" rx="1" className="fill-hi" />
      <rect x="10" y="72" width="34" height="11" rx="5.5" className="fill-ok" />
      {[10, 44, 78].map((x) => <rect key={x} x={x} y="94" width="24" height="34" rx="3" className="ln" />)}
      <Handles w={110} h={140} />
    </>
  );
}

export default function WebArt() {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className="art" aria-hidden="true" fill="none">
      <Patterns id="we" />
      <Guides id="we" w={600} h={300} step={60} />
      <g transform={floor(380, 150)}>
        <rect width="220" height="120" fill="url(#we-dots)" className="p-dim" strokeDasharray="3 4" />
      </g>
      <path className="wire" d="M120 300C200 260 230 170 320 150S470 110 560 40" />
      {PANELS.map((i) => (
        <Layer key={i} sx={-i * 7} sy={i * 4} amp={-7} delay={-i * 0.45} dur={4.5} d={0.4 + i * 0.3}>
          <g transform={wall(330 - i * 28, 60 + i * 16)}>
            <Page i={i} />
          </g>
        </Layer>
      ))}
    </svg>
  );
}
