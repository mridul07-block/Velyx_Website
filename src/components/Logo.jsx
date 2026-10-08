const ICON =
  "https://res.cloudinary.com/dmhabztbf/image/upload/w_96,f_auto,q_auto/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png";

export default function Logo() {
  return (
    <span className="logo">
      <img src={ICON} alt="" width="36" height="36" className="logo__icon" />
      <span className="logo__word">
        vely<span className="logo__x">x</span> labs
      </span>
    </span>
  );
}
