export function LegalDoc({ eyebrow, title, sections }: { eyebrow: string; title: string; sections: [string, string][] }) {
  return (
    <article className="wrap section stack" style={{ ["--gap" as string]: "32px", maxWidth: 800 }}>
      <header className="stack">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted small">Last updated 26 Nov 2026 · Beta version</p>
      </header>
      {sections.map(([h, body]) => (
        <section key={h} className="stack" style={{ ["--gap" as string]: "8px" }}>
          <h2 style={{ fontSize: 24 }}>{h}</h2>
          <p className="measure">{body}</p>
        </section>
      ))}
    </article>
  );
}
