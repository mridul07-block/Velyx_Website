import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/Preloader";

// Lazy-load all pages so Three.js is only bundled when a route is visited.
// This splits the single 953 KB chunk into smaller per-page chunks.
const Home        = lazy(() => import("./pages/Home"));
const Services    = lazy(() => import("./pages/Services"));
const Portfolio   = lazy(() => import("./pages/Portfolio"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact     = lazy(() => import("./pages/Contact"));

// Minimal fallback that matches the site background — no white flash
function PageFallback() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #0d0b07)",
    }} />
  );
}

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

import { getCalApi } from "@calcom/embed-react";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/services"     element={<Services />} />
            <Route path="/portfolio"    element={<Portfolio />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact"      element={<Contact />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

