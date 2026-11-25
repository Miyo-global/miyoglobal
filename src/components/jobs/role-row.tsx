import Link from "next/link";
import type { RoleCard } from "@/lib/jobs";

/** Chips under a role: only facts the sheet actually states. */
export function RoleChips({ role, level = true }: { role: RoleCard; level?: boolean }) {
  const chips = [level ? role.level : null, role.workMode, role.contract, role.experience].filter(Boolean) as string[];
  if (!chips.length && !role.ctc) return null;
  return (
    <div className="board-chips">
      {role.ctc && <span className="chip pay">{role.ctc}</span>}
      {chips.map((c) => (
        <span key={c} className="chip">{c}</span>
      ))}
    </div>
  );
}

export function destination(role: Pick<RoleCard, "cities" | "location" | "workMode">) {
  if (role.cities.length) return { main: role.cities[0], more: role.cities.length > 1 ? `+${role.cities.length - 1} more` : role.workMode === "Remote" ? "or remote" : null };
  if (role.workMode === "Remote") return { main: "Remote", more: null };
  return { main: role.location ?? "Shared on request", more: null };
}

/** One line of the departure board. The whole row is the link target; the title carries the accessible name. */
export function RoleRow({ role, headingLevel = 3 }: { role: RoleCard; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const dest = destination(role);
  return (
    <li className="board-row">
      <span className="ref">{role.ref}</span>
      <div>
        <H>
          <Link href={`/jobs/${role.slug}`}>{role.title}</Link>
        </H>
        <p className="sub">{role.fn}</p>
        <RoleChips role={role} />
      </div>
      <span className="dest">
        {dest.main}
        {dest.more && <small>{dest.more}</small>}
      </span>
      <span className="st">Open</span>
    </li>
  );
}

export function BoardHead() {
  return (
    <div className="board-head" aria-hidden="true">
      <span>Ref</span>
      <span>Role</span>
      <span>Location</span>
      <span>Status</span>
    </div>
  );
}
