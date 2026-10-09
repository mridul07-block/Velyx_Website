import { LOGO_ICON } from "../lib/brand";

export default function Logo() {
  return (
    <span className="logo">
      <img src={LOGO_ICON} alt="" width="28" height="28" className="logo__icon" />
      <span className="logo__word">velyx labs</span>
    </span>
  );
}
