import { CLIENTS } from "./clients";
import { SERVICES } from "./services";

/* Numbers section. Counted values are derived from real data so they
   never drift. TO CONFIRM: replace with the user's real figures. */
export const STATS = [
  { value: `${CLIENTS.length}+`, label: "Clients and partners" },
  { value: String(SERVICES.length), label: "Services under one roof" },
  { value: "100%", label: "Founder-led projects" },
  { value: "30 min", label: "Free first call" },
];
