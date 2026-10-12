/* 925 Studios' button hover: the label rolls up and an identical copy
   rolls in from below. The copy is hidden from assistive tech. */
export default function BtnLabel({ children }) {
  return (
    <span className="btn__roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
