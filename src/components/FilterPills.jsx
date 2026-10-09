export default function FilterPills({ options, value, onChange, label }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button key={key} type="button" className="filter" aria-pressed={value === key} onClick={() => onChange(key)}>
          {text}
        </button>
      ))}
    </div>
  );
}
