import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// Main pages load eagerly so they paint without a second round-trip.
// Secondary routes stay lazy.
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import StartProject from "./pages/StartProject";
import IntroCall from "./pages/IntroCall";
import PricingPage from "./pages/PricingPage";

const Services = lazy(() => import("./pages/Services"));
const SwipeFile = lazy(() => import("./pages/SwipeFile"));
const Start = lazy(() => import("./pages/Start"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Matches the site background so there is no flash between routes.
function PageFallback() {
  return <div className="page-fallback" />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/services" element={<Services />} />
        <Route path="/swipe-file" element={<SwipeFile />} />
        <Route path="/start-a-project" element={<StartProject />} />
        <Route path="/start" element={<Start />} />
        <Route path="/intro-call" element={<IntroCall />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
