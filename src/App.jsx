import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { getCalApi } from "@calcom/embed-react";
import AppRoutes from "./AppRoutes";
import { initClickTracking } from "./lib/analytics";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
