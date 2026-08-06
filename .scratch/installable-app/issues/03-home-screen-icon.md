# 03 — The home-screen icon

**What to build:** The installed app shows its own icon in the Android launcher and task switcher —
readable at launcher size, uncropped by Android's adaptive-icon mask, and in the app's own colours —
rather than a browser-supplied favicon fallback.

The source is the existing favicon glyph. Three changes to it:

- **Recolour to the green accent token**, not the legacy purple. The purple predates the island
  retheme and no longer matches anything in the app it opens. (The owner confirmed green.)
- **Composite on the dark background token** rather than leaving it transparent, so the mask has
  something to bite on.
- **Pad into the adaptive-icon safe zone and declare it maskable**, so Android does not crop it into
  a fragment or shrink it inside a white circle.

Export at 192 and 512, commit both, and reference them from the manifest.

Generation is a one-off script following the existing `scripts/*.mjs` convention, using Playwright —
already a devDependency, so no new tooling. The outputs are committed, so the script is a record of
provenance rather than a build step; it should not run on every build.

**Blocked by:** 02 (needs a manifest to attach the icons to).

**Status:** ready-for-agent

- [ ] 192 and 512 PNG icons exist and are committed
- [ ] Glyph is the green accent colour, composited on the dark background token
- [ ] Padded into the adaptive-icon safe zone and declared maskable in the manifest
- [ ] A one-off generation script exists under `scripts/`, uses the already-installed Playwright, and
      adds no new dependency
- [ ] The script is not wired into the build
- [ ] Icons are precached along with everything else, so they survive offline
- [ ] Verified on the device: the launcher shows the icon, uncropped and legible at icon size
