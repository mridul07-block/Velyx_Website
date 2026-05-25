import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BrandMark from "./BrandMark";

export default function CineNav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("--:--:--");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentActive = active || location.pathname.replace("/", "") || "home";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const t = setInterval(() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    }, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { id: "home", label: "Home", to: "/" },
    { id: "services", label: "Services", to: "/services" },
    { id: "portfolio", label: "Portfolio", to: "/portfolio" },
    { id: "testimonials", label: "Testimonials", to: "/testimonials" },
    { id: "contact", label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="nav__brand" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png" alt="Velyx Labs Icon" style={{ height: 52, width: 52, objectFit: "contain", marginRight: 2 }} />
          <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom, transparent, rgba(240,146,15,0.7), transparent)" }} />
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 26, letterSpacing: "-0.01em", marginLeft: 14 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--fg, #f6f1e7)" }}>vely</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#f0920f" }}>x</span>
            <span style={{ fontFamily: "var(--font-sans, sans-serif)", fontWeight: 400, color: "var(--fg, #f6f1e7)", marginLeft: 6 }}>labs</span>
          </div>
        </Link>
        <div className="nav__links">
          {links.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              className={currentActive === l.id ? "active" : ""}
              style={currentActive === l.id ? { color: "var(--fg)" } : {}}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav__meta">
          <span className="nav__time">
            <span className="pulse" />
            {time} BLR
          </span>
          <Link to="/contact" className="nav__cta">
            <span className="dot" />
            Book a call
          </Link>
          <button 
            className={`nav__hamburger ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="nav__mobile"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%", transition: { delay: 0.2, duration: 0.4 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="nav__mobile-inner">
              <div className="nav__mobile-links">
                {links.map((l, i) => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={l.to}
                      className={currentActive === l.id ? "active" : ""}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="num">0{i + 1}</span>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="nav__mobile-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="contact-info">
                  <a href="mailto:hi@velyx.com">hi@velyx.com</a>
                  <a href="#">X / Twitter</a>
                  <a href="#">LinkedIn</a>
                </div>
                <Link to="/contact" className="btn btn--primary" onClick={() => setMobileMenuOpen(false)}>
                  Book a strategy call <span className="arr">↗</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="progress-bar" id="progressBar" />
    </>
  );
}
