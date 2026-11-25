import Link from "next/link";
import type { RoleCard } from "@/lib/jobs";
import { Tag } from "../ui/tag";

/** Chips under a role: only facts the sheet actually states. Pay gets the accent chip. */
export function RoleChips({ role, level = true }: { role: RoleCard; level?: boolean }) {
  const chips = [level ? role.level : null, role.workMode, role.contract, role.experience].filter(Boolean) as string[];
  if (!chips.length && !role.ctc) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {role.ctc && <Tag tone="accent">{role.ctc}</Tag>}
      {chips.map((c) => (
        <Tag key={c}>{c}</Tag>
      ))}
    </div>
  );
}

export function destination(role: Pick<RoleCard, "cities" | "location" | "workMode">) {
  if (role.cities.length) return { main: role.cities[0], more: role.cities.length > 1 ? `+${role.cities.length - 1} more` : role.workMode === "Remote" ? "or remote" : null };
  if (role.workMode === "Remote") return { main: "Remote", more: null };
  return { main: role.location ?? "Shared on request", more: null };
}

/**
 * One line of the Departure Board: ref, role, function, chips, city, status. The title link is stretched over the whole row,
 * so the row is one target while the title stays the accessible name.
 */
export function RoleRow({ role, headingLevel = 3 }: { role: RoleCard; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const dest = destination(role);
  return (
    <li className="group relative grid-12 gap-y-2 border-b border-rule py-6 transition-colors duration-150 ease-brand hover:bg-surface">
      <span className="num col-span-4 text-small text-accent-text md:col-span-2 md:pt-1">{role.ref}</span>
      <div className="col-span-4 md:col-span-6">
        <H className="text-h3">
          <Link href={`/jobs/${role.slug}`} className="no-underline after:absolute after:inset-0 group-hover:underline">
            {role.title}
          </Link>
        </H>
        <p className="mt-1 text-small text-muted">{role.fn}</p>
        <RoleChips role={role} />
      </div>
      <p className="col-span-3 text-small text-ink md:col-span-3 md:pt-1">
        {dest.main}
        {dest.more && <span className="block text-muted">{dest.more}</span>}
      </p>
      <p className="meta col-span-1 text-right text-ok md:pt-1">Open</p>
    </li>
  );
}

/** Column labels above a list of RoleRows (visual only; each row carries its own text). */
export function BoardHead() {
  return (
    <div className="meta hidden border-b border-rule-strong pb-3 text-muted md:grid md:grid-cols-12 md:gap-x-gutter" aria-hidden="true">
      <span className="col-span-2">Ref</span>
      <span className="col-span-6">Role</span>
      <span className="col-span-3">Location</span>
      <span className="col-span-1 text-right">Status</span>
    </div>
  );
}
