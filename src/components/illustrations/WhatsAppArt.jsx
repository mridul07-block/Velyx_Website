import { Guides, Handles, Layer, Patterns } from "./iso";
import { floor } from "./isoMatrix";

/* A phone lies flat; chat bubbles rise out of it one after another, the
   last one a green booking confirmation. A CRM tile syncs on the side. */
const BUBBLES = [
  { at: [225, 109], w: 42, h: 18, z: 26, cls: "p-top", lines: "M7 7h26M7 12h16" },
  { at: [193, 83], w: 48, h: 20, z: 50, cls: "ok-tint", lines: "M7 7h32M7 13h20" },
  { at: [213, 57], w: 56, h: 22, z: 74, cls: "fill-ok", check: true },
];

export default function WhatsAppArt() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" className="art" aria-hidden="true" fill="none">
      <Patterns id="wa" />
      <Guides id="wa" w={360} h={240} />
      <g transform="translate(-40 0)">
      <path className="wire" d="M262 150l50-24" />

      <Layer sy={4} amp={-3} dur={7}>
        <g transform={floor(241, 103)}>
          <rect width="64" height="124" rx="12" className="p-solid" />
          <rect x="6" y="14" width="52" height="102" rx="6" fill="url(#wa-dots)" className="p-dim" />
          <rect x="24" y="5" width="16" height="4" rx="2" className="fill-hi" />
        </g>
      </Layer>

      <Layer sx={10} sy={-8} amp={-5} delay={-2} dur={5} d={1.6}>
        <g transform={floor(330, 87)}>
          <rect width="46" height="46" className="p-solid" />
          {[8, 20, 32].map((y) => <rect key={y} x="7" y={y} width="32" height="7" rx="2" className="ln" />)}
          <circle cx="11" cy="11.5" r="2" className="fill-ok" />
          <text x="4" y="44" fontSize="5" className="t">CRM</text>
        </g>
      </Layer>

      {BUBBLES.map((b, i) => (
        <Layer key={i} sy={-8 - i * 8} amp={-4} rise={b.z} delay={i * 0.7} dur={6}>
          <g transform={floor(b.at[0], b.at[1])}>
            <rect width={b.w} height={b.h} rx="6" className={b.cls} />
            {b.lines && <path d={b.lines} className="ln-bright" />}
            {b.check && <path d="M8 11l3 3 6-6M24 8h24M24 14h16" className="ln-panel" strokeWidth="1.6" />}
            {i === 2 && <Handles w={b.w} h={b.h} />}
          </g>
        </Layer>
      ))}
      </g>
    </svg>
  );
}
