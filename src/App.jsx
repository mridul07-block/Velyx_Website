import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { getCalApi } from "@calcom/embed-react";
import AppRoutes from "./AppRoutes";
import ScrollManager from "./components/ScrollManager";
import { initClickTracking, track } from "./lib/analytics";
import { initClickTick } from "./lib/tick";

export default function App() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view", theme: "light" });
      cal("on", {
        action: "bookingSuccessful",
        callback: () => track("call_booked", { location: window.location.pathname }),
      });
    })();
  }, []);

  // GA4 conversion + outbound click tracking
  useEffect(() => initClickTracking(), []);

  // Kargul-style "tik" on every mouse press of a link or button
  useEffect(() => initClickTick(), []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <AppRoutes />
    </BrowserRouter>
  );
}
