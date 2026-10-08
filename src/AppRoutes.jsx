import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// Main conversion pages load eagerly so they paint without a second
// round-trip (each is only a few KB). Secondary routes stay lazy.
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

const Start = lazy(() => import("./pages/Start"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Matches the site background so there is no white flash between routes.
function PageFallback() {
  return <div className="page-fallback" />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/start" element={<Start />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
