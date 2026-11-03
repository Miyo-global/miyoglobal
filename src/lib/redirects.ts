export type RedirectRow = { fromPath: string; toPath: string };

export function planRedirect(
  existing: RedirectRow[],
  oldPath: string,
  newPath: string,
): { upsert: RedirectRow[]; remove: string[] } {
  if (oldPath === newPath) return { upsert: [], remove: [] };
  const upsert: RedirectRow[] = existing
    .filter((r) => r.toPath === oldPath && r.fromPath !== newPath)
    .map((r) => ({ fromPath: r.fromPath, toPath: newPath }));
  upsert.push({ fromPath: oldPath, toPath: newPath });
  const remove = existing.filter((r) => r.fromPath === newPath).map((r) => r.fromPath);
  return { upsert, remove };
}
