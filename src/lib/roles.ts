export type Role = "admin" | "editor";

export const capabilities = {
  writePosts: ["admin", "editor"],
  uploadMedia: ["admin", "editor"],
  manageTaxonomy: ["admin", "editor"],
  deletePosts: ["admin"],
  customJsonLd: ["admin"],
  manageUsers: ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Capability = keyof typeof capabilities;

export function can(role: string | null | undefined, capability: Capability): boolean {
  return (capabilities[capability] as readonly string[]).includes(role ?? "");
}
