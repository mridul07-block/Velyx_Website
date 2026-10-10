import { LOGO_ICON } from "../../lib/brand";
import { Guides, Handles, Layer, Patterns } from "./iso";
import { floor, wall } from "./isoMatrix";

/* Three phones stand in a row over an app-icon grid; the front screen
   scrolls, a notification floats in from the side, the phones fan out. */
const PHONES = [0, 1, 2];
const ICONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function MobileArt() {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className="art" aria-hidden="true" fill="none">
      <Patterns id="mo" />
      <Guides id="mo" w={600} h={300} step={60} />
      <defs>
        <clipPath id="mo-screen"><rect x="5" y="14" width="52" height="102" rx="6" /></clipPath>
      </defs>

      <Layer sx={-8} sy={4} amp={-3} dur={7} d={0.8}>
        <g transform={floor(150, 150)}>
          <rect width="90" height="90" className="p-dim" strokeDasharray="3 4" />
          {ICONS.map((n) => (
            <rect key={n} x={6 + (n % 3) * 28} y={6 + Math.floor(n / 3) * 28} width="22" height="22" rx="6"
              className={n === 4 ? "fill-ok" : n % 2 ? "p-solid" : "p-dim"} fill={n === 2 || n === 6 ? "url(#mo-hatch)" : undefined} />
          ))}
        </g>
      </Layer>

      <path className="wire" d="M470 128L404 150" />

      {PHONES.map((i) => {
        const front = i === PHONES.length - 1;
        return (
          <Layer key={i} sx={(i - 1) * 16} sy={(i - 1) * 9} amp={-7} delay={-i * 0.7} dur={5} d={0.6 + i * 0.4}>
            <g transform={wall(250 + i * 52, 46 + i * 30)}>
              <rect width="62" height="130" rx="10" className={front ? "p-top" : "p-solid"} />
              <rect x="23" y="5" width="16" height="4" rx="2" className="fill-hi" />
              {front ? (
                <g clipPath="url(#mo-screen)">
                  <g className="scroll">
                    <image href={LOGO_ICON} x="9" y="20" width="12" height="12" />
                    <rect x="9" y="38" width="40" height="6" rx="1" className="fill-hi" />
                    <rect x="9" y="50" width="44" height="30" rx="4" fill="url(#mo-hatch)" className="ln" />
                    <rect x="9" y="86" width="30" height="10" rx="5" className="fill-ok" />
                    {[104, 122, 140, 158].map((y) => <rect key={y} x="9" y={y} width="44" height="12" rx="3" className="ln" />)}
                  </g>
                </g>
              ) : (
                <path d="M9 24h30M9 32h20M9 46h44M9 54h36" className="ln" />
              )}
              {front && <Handles w={62} h={130} />}
            </g>
          </Layer>
        );
      })}

      <Layer sx={14} sy={-12} amp={-9} delay={-1} dur={4} d={2}>
        <g transform={floor(470, 96)}>
          <rect width="70" height="28" rx="8" className="p-top" />
          <circle cx="12" cy="14" r="5" className="fill-ok" />
          <path d="M22 10h38M22 17h24" className="ln-bright" />
        </g>
      </Layer>
    </svg>
  );
}
