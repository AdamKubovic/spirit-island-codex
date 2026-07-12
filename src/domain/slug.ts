/** Shared with `scripts/extract-scenarios.mjs` (imported directly) so adversary and scenario
 * image paths are derived from names the same way — one slug rule, not two that can drift. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
