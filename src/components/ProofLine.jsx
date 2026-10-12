import { useEffect, useState } from "react";
import VelyxMark from "./VelyxMark";
import useReducedMotion from "../lib/useReducedMotion";
import { PROOFS, PROOF_INTERVAL } from "../data/proofs";

/* Maydit's rotating proof line in Velyx style: a small V and one short
   uppercase line that changes every few seconds — the words blur and rise
   in one after another, the old line rises out. Screen readers get every
   line once; reduced motion keeps the first line still. */
export default function ProofLine() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const index = step % PROOFS.length;
  const prev = step > 0 ? (step - 1) % PROOFS.length : -1;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => s + 1), PROOF_INTERVAL);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <p className="proof">
      <span className="sr-only">{PROOFS.join(". ")}</span>
      {PROOFS.map((line, i) => (
        <span key={line} className={`proof__row${i === index ? " is-on" : i === prev ? " is-out" : ""}`} aria-hidden="true">
          <VelyxMark className="proof__icon" />
          <span className="proof__words">
            {line.split(" ").map((w, j) => (
              <span key={j} className="proof__w" style={{ "--i": j }}>{w}</span>
            ))}
          </span>
        </span>
      ))}
    </p>
  );
}
