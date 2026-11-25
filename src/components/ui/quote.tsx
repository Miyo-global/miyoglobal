/** Pull quote with attribution. Only for real, attributable quotes; never placeholder testimonials. */
export function Quote({ children, name, role }: { children: React.ReactNode; name: string; role?: string }) {
  return (
    <figure className="border-l-2 border-accent pl-6">
      <blockquote className="font-display text-h3">{children}</blockquote>
      <figcaption className="mt-4 text-small text-muted">
        <span className="font-semibold text-ink">{name}</span>
        {role && <>, {role}</>}
      </figcaption>
    </figure>
  );
}
