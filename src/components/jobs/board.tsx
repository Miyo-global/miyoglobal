"use client";

import { useMemo } from "react";
import type { RoleCard } from "@/lib/jobs";
import { replaceSearch, useSearch } from "@/lib/use-search";
import { Button } from "../ui/button";
import { Field, Select } from "../ui/field";
import { BoardHead, RoleRow } from "./role-row";

type FacetKey = "fn" | "city" | "mode" | "contract" | "level";
type Filters = Record<FacetKey, string[]>;
type Sort = "newest" | "az";

const FACETS: { key: FacetKey; label: string; values: (r: RoleCard) => string[] }[] = [
  { key: "fn", label: "Sector", values: (r) => [r.fn] },
  { key: "city", label: "Location", values: (r) => (r.cities.length ? r.cities : r.workMode === "Remote" ? ["Remote"] : []) },
  { key: "mode", label: "Work mode", values: (r) => (r.workMode ? [r.workMode] : []) },
  { key: "contract", label: "Contract", values: (r) => (r.contract ? [r.contract] : []) },
  { key: "level", label: "Level", values: (r) => (r.level ? [r.level] : []) },
];

const KEYS = FACETS.map((f) => f.key);
const LEVEL_ORDER = ["Associate", "Mid-level", "Senior", "Lead", "Leadership"];
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
 * The Departure Board. Its state lives in the URL (?q=, ?sort=, ?fn=Data+%26+AI ...), so sector links from job pages and shared
 * searches land pre-filtered, and the back button keeps them. Facet counts reflect every other active filter.
 */
export function JobsBoard({ roles }: { roles: RoleCard[] }) {
  const params = useSearch();
  const query = params.get("q") ?? "";
  const sort: Sort = params.get("sort") === "az" ? "az" : "newest";
  const filterKey = KEYS.map((k) => params.getAll(k).join("|")).join("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps -- filterKey is the stable identity of the facet params
  const filters = useMemo(() => Object.fromEntries(KEYS.map((k) => [k, params.getAll(k)])) as Filters, [filterKey]);

  const update = (change: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(window.location.search);
    change(next);
    replaceSearch(next);
  };
  const setQuery = (q: string) => update((p) => (q ? p.set("q", q) : p.delete("q")));
  const setSort = (s: Sort) => update((p) => (s === "az" ? p.set("sort", s) : p.delete("sort")));
  const toggle = (key: FacetKey, value: string) =>
    update((p) => {
      const cur = p.getAll(key);
      p.delete(key);
      for (const v of cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]) p.append(key, v);
    });
  const reset = () => update((p) => [...KEYS, "q"].forEach((k) => p.delete(k)));

  const facets = useMemo(
    () =>
      FACETS.map((f) => {
        const counts = new Map<string, number>();
        for (const r of roles) for (const v of f.values(r)) counts.set(v, 0);
        for (const r of roles) if (matches(r, filters, query.trim(), f.key)) for (const v of f.values(r)) counts.set(v, (counts.get(v) ?? 0) + 1);
        const options = [...counts].sort((a, b) => (f.key === "level" ? LEVEL_ORDER.indexOf(a[0]) - LEVEL_ORDER.indexOf(b[0]) : b[1] - a[1] || a[0].localeCompare(b[0])));
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

  const active = KEYS.reduce((n, k) => n + filters[k].length, 0);

  return (
    <div className="grid-12 gap-y-8">
      <div className="col-span-4 grid gap-6 border-b border-rule-strong pb-8 md:col-span-12 md:grid-cols-12 md:gap-x-gutter">
        <Field
          id="jb-q"
          label="Search roles"
          type="search"
          required={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Workday, Oracle FLEXCUBE, Hyderabad, DM065"
          autoComplete="off"
          className="md:col-span-8"
        />
        <Select id="jb-sort" label="Sort by" required={false} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="md:col-span-4">
          <option value="newest">Newest first</option>
          <option value="az">Title, A to Z</option>
        </Select>
      </div>

      <aside className="col-span-4 md:col-span-3" aria-label="Filter roles">
        <details open className="group">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between border-b border-rule-strong text-small font-semibold text-ink">
            <span>
              Filters{active ? <span className="num"> ({active})</span> : null}
            </span>
            <span aria-hidden="true" className="num text-muted group-open:hidden">
              +
            </span>
            <span aria-hidden="true" className="num hidden text-muted group-open:inline">
              −
            </span>
          </summary>
          <div className="grid gap-8 pt-6">
            {facets.map((f) => (
              <fieldset key={f.key}>
                <legend className="meta mb-2 text-accent-text">{f.label}</legend>
                {f.options.map(([value, n]) => {
                  const checked = filters[f.key].includes(value);
                  const id = `jb-${f.key}-${value.replace(/\W+/g, "-")}`;
                  return (
                    <div key={value} className="flex min-h-12 items-center gap-3 border-b border-rule text-small">
                      <input id={id} type="checkbox" className="size-4 shrink-0 accent-ink" checked={checked} disabled={!n && !checked} onChange={() => toggle(f.key, value)} />
                      <label htmlFor={id} className="flex flex-1 cursor-pointer items-center justify-between gap-3 py-3 text-ink">
                        <span>{value}</span>
                        <span className="num text-muted">{n}</span>
                      </label>
                    </div>
                  );
                })}
              </fieldset>
            ))}
            {(active > 0 || query) && (
              <Button type="button" variant="ghost" onClick={reset} className="justify-start">
                Clear all filters
              </Button>
            )}
          </div>
        </details>
      </aside>

      <section className="col-span-4 md:col-span-9" aria-labelledby="jb-results">
        <h2 id="jb-results" className="sr-only">
          Matching roles
        </h2>
        <p className="mb-6 flex flex-wrap justify-between gap-2 text-small text-muted" role="status" aria-live="polite">
          <span>
            Showing <strong className="num font-semibold text-ink">{shown.length}</strong> of <strong className="num font-semibold text-ink">{roles.length}</strong> open roles
          </span>
          <span className="meta">{sort === "az" ? "Title, A to Z" : "Newest first"}</span>
        </p>
        {shown.length ? (
          <>
            <BoardHead />
            <ul>
              {shown.map((r) => (
                <RoleRow key={r.slug} role={r} />
              ))}
            </ul>
          </>
        ) : (
          <div className="border-t border-rule-strong pt-8">
            <h3 className="text-h3">No open role matches that search</h3>
            <p className="mt-2 text-muted">
              Try a broader keyword, or clear the filters to see all <span className="num">{roles.length}</span> roles.
            </p>
            <Button type="button" variant="secondary" onClick={reset} className="mt-6">
              Clear search and filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
