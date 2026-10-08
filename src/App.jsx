import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { getCalApi } from "@calcom/embed-react";
import AppRoutes from "./AppRoutes";
import ScrollManager from "./components/ScrollManager";
import { initClickTracking } from "./lib/analytics";

export default function App() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  // GA4 conversion + outbound click tracking
  useEffect(() => initClickTracking(), []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <AppRoutes />
    </BrowserRouter>
  );
}
