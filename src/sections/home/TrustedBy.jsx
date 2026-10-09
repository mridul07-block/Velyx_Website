import Marquee from "../../components/Marquee";
import { CLIENTS } from "../../data/clients";

export default function TrustedBy() {
  return (
    <section id="trusted" className="trusted">
      <div className="container">
        <h2 className="trusted__title">Trusted by startups and industry leaders</h2>
        <Marquee label="Clients">
          {CLIENTS.map((c) => <span key={c} className="trusted__name">{c}</span>)}
        </Marquee>
      </div>
    </section>
  );
}
