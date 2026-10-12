import AuditBar from "./AuditBar";
import PillNav from "./PillNav";
import SiteFooter from "./SiteFooter";

export default function Layout({ children }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <AuditBar />
      <PillNav />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
