"use client";

import { useMemo } from "react";
import type { RoleCard } from "@/lib/jobs";
import { replaceSearch, useSearch } from "@/lib/use-search";
import { BoardHead, RoleRow } from "./role-row";

type FacetKey = "city" | "fn" | "level" | "mode" | "contract";
type Filters = Record<FacetKey, string[]>;
type Sort = "newest" | "az";

const FACETS: { key: FacetKey; label: string; values: (r: RoleCard) => string[] }[] = [
  { key: "fn", label: "Function", values: (r) => [r.fn] },
  { key: "city", label: "Location", values: (r) => (r.cities.length ? r.cities : r.workMode === "Remote" ? ["Remote"] : []) },
  { key: "level", label: "Level", values: (r) => (r.level ? [r.level] : []) },
  { key: "mode", label: "Work mode", values: (r) => (r.workMode ? [r.workMode] : []) },
  { key: "contract", label: "Contract", values: (r) => (r.contract ? [r.contract] : []) },
];

const LEVEL_ORDER = ["Associate", "Mid-level", "Senior", "Lead", "Leadership"];
const EMPTY_KEYS: FacetKey[] = ["city", "fn", "level", "mode", "contract"];
const refNumber = (ref: string) => Number(/\d+/.exec(ref)?.[0] ?? 0);

function matches(r: RoleCard, filters: Filters, query: string, skip?: FacetKey) {
  for (const f of FACETS) {
    if (f.key === skip) continue;
    const chosen = filters[f.key];
    if (chosen.length && !f.values(r).some((v) => chosen.includes(v))) return false;
  }
  if (!query) return true;
  const hay = `${r.title} ${r.ref} ${r.fn} ${r.location ?? ""} ${r.cities.join(" ")} ${r.pitch}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

/**
 * The board's state lives in the URL (?q=, ?sort=, ?fn=Data+%26+AI ...), so sector links from job pages and shared searches
 * land pre-filtered, and the back button keeps them.
 */
export function JobsBoard({ roles }: { roles: RoleCard[] }) {
  const params = useSearch();
  const query = params.get("q") ?? "";
  const sort: Sort = params.get("sort") === "az" ? "az" : "newest";
  const filterKey = EMPTY_KEYS.map((k) => params.getAll(k).join("|")).join("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps -- filterKey is the stable identity of the facet params
  const filters = useMemo(() => Object.fromEntries(EMPTY_KEYS.map((k) => [k, params.getAll(k)])) as Filters, [filterKey]);

  const update = (change: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(window.location.search);
    change(next);
    replaceSearch(next);
  };
  const setQuery = (q: string) => update((p) => (q ? p.set("q", q) : p.delete("q")));
  const setSort = (s: Sort) => update((p) => (s === "az" ? p.set("sort", s) : p.delete("sort")));

  const facets = useMemo(
    () =>
      FACETS.map((f) => {
        const counts = new Map<string, number>();
        for (const r of roles) for (const v of f.values(r)) counts.set(v, 0);
        for (const r of roles) if (matches(r, filters, query.trim(), f.key)) for (const v of f.values(r)) counts.set(v, (counts.get(v) ?? 0) + 1);
        const options = [...counts].sort((a, b) =>
          f.key === "level" ? LEVEL_ORDER.indexOf(a[0]) - LEVEL_ORDER.indexOf(b[0]) : b[1] - a[1] || a[0].localeCompare(b[0]),
        );
        return { ...f, options };
      }).filter((f) => f.options.length > 1 || filters[f.key].length),
    [roles, filters, query],
  );

  const shown = useMemo(() => {
    const list = roles.filter((r) => matches(r, filters, query.trim()));
    return sort === "az"
      ? list.sort((a, b) => a.title.localeCompare(b.title))
      : list.sort((a, b) => (b.posted ?? "").localeCompare(a.posted ?? "") || refNumber(b.ref) - refNumber(a.ref));
  }, [roles, filters, query, sort]);

  const active = FACETS.reduce((n, f) => n + filters[f.key].length, 0);
  const toggle = (key: FacetKey, value: string) =>
    update((p) => {
      const cur = p.getAll(key);
      p.delete(key);
      for (const v of cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]) p.append(key, v);
    });
  const reset = () => update((p) => [...EMPTY_KEYS, "q"].forEach((k) => p.delete(k)));

  return (
    <>
      <div className="jb-tools">
        <div className="ed-field jb-search">
          <label htmlFor="jb-q">Search roles</label>
          <input id="jb-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Workday, Oracle FLEXCUBE, Hyderabad, DM065…" autoComplete="off" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </div>
        <div className="ed-field">
          <label htmlFor="jb-sort">Sort by</label>
          <select id="jb-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">Newest first</option>
            <option value="az">Title, A to Z</option>
          </select>
        </div>
      </div>

      <div className="jb-layout">
        <aside className="jb-filters" aria-label="Filter roles">
          <details open>
            <summary>
              Filters{active ? ` (${active})` : ""}
              <span aria-hidden="true">+</span>
            </summary>
            <div>
              {facets.map((f) => (
                <fieldset key={f.key} className="jb-facet">
                  <legend className="ed-legend">{f.label}</legend>
                  {f.options.map(([value, n]) => {
                    const checked = filters[f.key].includes(value);
                    return (
                      <label key={value} className="jb-opt">
                        <input type="checkbox" checked={checked} disabled={!n && !checked} onChange={() => toggle(f.key, value)} />
                        <span>{value}</span>
                        <span className="n">{n}</span>
                      </label>
                    );
                  })}
                </fieldset>
              ))}
              {(active > 0 || query) && (
                <button type="button" className="jb-clear" onClick={reset}>
                  Clear all filters
                </button>
              )}
            </div>
          </details>
        </aside>

        <section aria-labelledby="jb-results">
          <h2 id="jb-results" className="sr">Matching roles</h2>
          <p className="jb-status" role="status" aria-live="polite">
            <span>
              Showing <strong>{shown.length}</strong> of <strong>{roles.length}</strong> open roles
            </span>
            <span>{sort === "az" ? "Title, A to Z" : "Newest first"}</span>
          </p>
          {shown.length ? (
            <>
              <BoardHead />
              <ul className="board">
                {shown.map((r) => (
                  <RoleRow key={r.slug} role={r} />
                ))}
              </ul>
            </>
          ) : (
            <div className="board-empty">
              <h3>No open role matches that search</h3>
              <p>Try a broader keyword, or clear the filters to see all {roles.length} roles.</p>
              <button type="button" className="ed-btn quiet board-more" onClick={reset}>
                Clear search and filters
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
