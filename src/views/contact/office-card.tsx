import { Card } from "@/components/ui/card";
import { OFFICES } from "./offices";

/** One office: region in mono, city as h3, full postal address in an <address>. */
export function OfficeCard({ office, className }: { office: (typeof OFFICES)[number]; className?: string }) {
  return (
    <Card as="article" variant="plain" className={className}>
      <p className="meta text-muted">{office.region}</p>
      <h3 className="mt-3">{office.city}</h3>
      <address className="mt-4 not-italic text-body text-ink">
        {office.lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </address>
      {office.note && <p className="mt-4 text-small text-muted">{office.note}</p>}
    </Card>
  );
}
