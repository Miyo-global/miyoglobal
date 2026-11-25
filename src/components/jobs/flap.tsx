/** Split-flap counter: each digit drops in once on load (CSS only, skipped under reduced motion). */
export function Flap({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0").split("");
  return (
    <span className="flap" role="img" aria-label={label}>
      {digits.map((d, i) => (
        <span key={i} className="flap-d" aria-hidden="true">
          <span style={{ "--i": i } as React.CSSProperties}>{d}</span>
        </span>
      ))}
    </span>
  );
}
