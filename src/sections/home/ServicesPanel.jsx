import Panel from "../../components/Panel";
import SectionHeader from "../../components/SectionHeader";
import ServiceCard from "../../components/ServiceCard";
import { SERVICES } from "../../data/services";

// The industry services live on /services only.
const INDUSTRIES = ["healthcare", "realestate", "automotive"];
const HOME_SERVICES = SERVICES.filter((s) => !INDUSTRIES.includes(s.id));

export default function ServicesPanel() {
  return (
    <Panel id="services">
      <SectionHeader
        align="center"
        title="Services"
        sub="Everything you need to launch and scale — from AI agents to the product your customers use."
      />
      <div className="svc-grid">
        {HOME_SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </Panel>
  );
}
