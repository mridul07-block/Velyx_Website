import { useEffect, useRef } from "react";

/* Modal image viewer: Esc closes, arrows navigate (wrapping), Tab is
   trapped inside, and focus returns to the opener on close. */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const n = items.length;

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onIndex]);

  const trapTab = (e) => {
    if (e.key !== "Tab") return;
    const focusables = [...dialogRef.current.querySelectorAll("button")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const item = items[index];
  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onKeyDown={trapTab}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" className="lightbox__close" aria-label="Close" onClick={onClose}>×</button>
      <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image" onClick={() => onIndex((index - 1 + n) % n)}>←</button>
      <img src={item.src} width={item.w} height={item.h} alt="" className="lightbox__img" />
      <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image" onClick={() => onIndex((index + 1) % n)}>→</button>
      <p className="lightbox__count">{index + 1} / {n}</p>
    </div>
  );
}
