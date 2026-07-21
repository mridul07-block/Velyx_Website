import { VizFunnel, VizCalendar, VizAgents, VizDocs, VizOrders, VizWorkflow } from "./CaseViz";

/* Maps a case study's `viz` key to its card visual. */
export const CASE_VIZ = {
  funnel: VizFunnel,
  calendar: VizCalendar,
  agents: VizAgents,
  docs: VizDocs,
  orders: VizOrders,
  workflow: VizWorkflow,
};
