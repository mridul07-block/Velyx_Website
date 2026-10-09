/* An AI agent hub sends work out to Inbox, CRM and Calendar; each tool
   ticks done in turn, then the hub lights up. Beats: 1 pulse → inbox,
   2 inbox done, 3 pulse → CRM, 4 CRM done, 5 pulse → calendar,
   6 calendar done. */
function Tool({ x, y, label, done, beat, children }) {
  return (
    <g className="layer" style={{ "--d": 1.6 }}>
      <rect x={x} y={y} width="84" height="40" rx="10" className="f-box" />
      {children}
      <text x={x + 32} y={y + 18} fontSize="8.5" className="t t--hi">{label}</text>
      <text x={x + 32} y={y + 29} fontSize="7" className={`t t--ok a a${beat} a--up`}>{done}</text>
      <g className={`a a${beat} a--pop`}>
        <circle cx={x + 82} cy={y + 2} r="7" className="f-ok s-none" />
        <path d={`M${x + 79} ${y + 2}l2 2 4-4`} className="s-panel" strokeWidth="1.6" />
      </g>
    </g>
  );
}

export default function AgentsArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path className="wire" d="M140 68 102 46M180 68l38-22M160 100v26" />
      <Tool x={18} y={18} label="Inbox" done="3 replied" beat={2}>
        <rect x="28" y="30" width="16" height="12" rx="2" />
        <path d="M28 32l8 5.5 8-5.5" />
      </Tool>
      <Tool x={218} y={18} label="CRM" done="Lead added" beat={4}>
        <circle cx="236" cy="32" r="4" />
        <path d="M229 44a7 7 0 0 1 14 0" />
      </Tool>
      <Tool x={118} y={126} label="Calendar" done="Call booked" beat={6}>
        <rect x="128" y="137" width="16" height="15" rx="2" />
        <path d="M128 142h16M132 134v5M140 134v5" />
      </Tool>
      <circle cx="160" cy="80" r="4" className="f-ok s-none pk pk1" />
      <circle cx="160" cy="80" r="4" className="f-ok s-none pk pk2" />
      <circle cx="160" cy="80" r="4" className="f-ok s-none pk pk3" />
      <g className="layer" style={{ "--d": 0.6 }}>
        <circle cx="160" cy="80" r="22" className="loop-ring hub" />
        <circle cx="160" cy="80" r="22" className="f-box hub" />
        <path d="M160 67q2 11 13 13-11 2-13 13-2-11-13-13 11-2 13-13z" className="f-hub s-none hub" />
      </g>
    </svg>
  );
}
AgentsArt.steps = 6;
