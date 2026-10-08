import Nav from "./Nav";
import Footer from "./Footer";
import StickyCta from "./StickyCta";

export default function Layout({ children }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <StickyCta />
    </>
  );
}
