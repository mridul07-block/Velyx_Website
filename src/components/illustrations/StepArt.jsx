import { Layer, Patterns } from "./iso";
import { floor, wall } from "./isoMatrix";

/* Four small isometric scenes for the process steps, in the service-card
   style: they breathe only while the section is on screen (.is-playing). */
function Call() {
  return (
    <>
      <g transform={floor(120, 70)}>
        <rect width="70" height="70" rx="6" fill="url(#st-call-hatch)" className="p-dim" />
      </g>
      <Layer amp={-6} dur={6}>
        <g transform={floor(120, 52)}>
          <rect width="70" height="44" rx="8" className="p-top" />
          <circle cx="16" cy="22" r="7" className="ln-bright" />
          <rect x="30" y="16" width="30" height="5" rx="2" className="fill-hi" />
          <rect x="30" y="26" width="20" height="4" rx="2" className="ln" />
        </g>
      </Layer>
      <Layer amp={-9} delay={-2} dur={6}>
        <g transform={floor(150, 26)}>
          <rect width="46" height="28" rx="8" className="p-solid" />
          {[12, 23, 34].map((x) => <circle key={x} cx={x} cy="14" r="2.2" className="fill-hi" />)}
        </g>
      </Layer>
    </>
  );
}

function Trial() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Layer key={i} amp={-3 - i * 3} delay={-i * 0.8} dur={7}>
          <g transform={floor(120, 92 - i * 16)}>
            <rect width="78" height="58" rx="4" className={i === 2 ? "p-top" : "p-solid"} />
            {i === 2 && (
              <>
                <rect x="10" y="10" width="36" height="6" rx="2" className="fill-hi" />
                {[24, 33, 42].map((y) => <rect key={y} x="10" y={y} width={y === 42 ? 34 : 56} height="4" rx="2" className="ln" />)}
              </>
            )}
          </g>
        </Layer>
      ))}
    </>
  );
}

function Build() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Layer key={i} amp={-2 - i * 2.5} delay={-i * 0.5} dur={5}>
          <g transform={floor(120, 96 - i * 15)}>
            <rect width="74" height="74" rx="5" className={i === 3 ? "p-top" : "p-solid"} />
            {i === 3 && <path className="ln" d="M14 14h46M14 26h30M14 60h46M14 48h20" />}
          </g>
        </Layer>
      ))}
    </>
  );
}

function Launch() {
  return (
    <>
      <g transform={floor(120, 96)}>
        <rect width="60" height="60" rx="30" fill="url(#st-launch-hatch)" className="p-dim" />
      </g>
      <g transform={wall(108, 58)}>
        <rect width="26" height="62" rx="3" className="p-solid" />
      </g>
      <Layer amp={-4} dur={6}>
        <g transform={wall(110, 40)}>
          <rect width="22" height="16" rx="3" className="p-top" />
        </g>
      </Layer>
      <path className="wire" d="M118 44L40 14M118 48L34 38" />
    </>
  );
}

const SCENES = { call: Call, trial: Trial, build: Build, launch: Launch };

export default function StepArt({ kind }) {
  const Scene = SCENES[kind];
  return (
    <svg viewBox="0 0 240 150" className="art step__art" aria-hidden="true" fill="none">
      <Patterns id={`st-${kind}`} />
      <Scene />
    </svg>
  );
}
