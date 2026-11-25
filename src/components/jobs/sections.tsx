import { LABEL, type Section } from "@/lib/jobs";

/** "Banking Domain: Prior exposure ..." renders with its label in bold. */
function Labelled({ text }: { text: string }) {
  const m = LABEL.exec(text);
  if (!m) return <>{text}</>;
  return (
    <>
      <b className="font-semibold">{m[1]}:</b> {text.slice(m[0].length)}
    </>
  );
}

/** One bucket of a parsed description, in `.prose`. Runs of short lines read better as a list than as stacked paragraphs. */
export function Sections({ sections, hideFirstHeading }: { sections: Section[]; hideFirstHeading?: boolean }) {
  return (
    <div className="prose">
      {sections.map((s, i) => {
        const asList = s.paragraphs.length > 1 && s.paragraphs.every((p) => p.length < 320);
        const items = asList ? [...s.paragraphs, ...s.bullets] : s.bullets;
        return (
          <div key={i} className="space-y-4">
            {s.heading && !(hideFirstHeading && i === 0) && <h3>{s.heading}</h3>}
            {!asList &&
              s.paragraphs.map((p, j) => (
                <p key={j}>
                  <Labelled text={p} />
                </p>
              ))}
            {items.length > 0 && (
              <ul>
                {items.map((b, j) => (
                  <li key={j}>
                    <Labelled text={b} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
