import Panel from "../../components/Panel";
import SectionHeader from "../../components/SectionHeader";
import ServiceCard from "../../components/ServiceCard";
import { CORE_SERVICES } from "../../data/services";

export default function ServicesPanel() {
  return (
    <Panel id="services">
      <SectionHeader
        align="center"
        title="Services"
        sub="Everything you need to launch and scale — from AI agents to the product your customers use."
      />
      <div className="svc-grid">
        {CORE_SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </Panel>
  );
}
