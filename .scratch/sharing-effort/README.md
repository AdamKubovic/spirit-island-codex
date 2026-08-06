# Sharing-effort: publishing and promoting the app

Decided 2026-08-06 (grill-with-docs session). Record: what we researched, what we decided, and why
sharing is within Greater Than Games' own stated position.

## Summary

The app goes public: the repo is made public, the site ships on GitHub Pages, and a single post on
r/spiritisland promotes it as a community resource. The strongest legal shield is the publisher's
own written position (below): free, clearly-unofficial fan content is explicitly allowed. The
remaining risk is a policy change or automated takedown, which we pre-commit to complying with.

## Decisions (settled in the session)

- **Publish vehicle:** the repo is owned personally (`AdamKubovic/spirit-island-codex`, transferred
  out of the `Tabletop-Atlas` org 2026-08-06) and goes public; GitHub Pages is the host at
  `adamkubovic.github.io/spirit-island-codex/`. Source, assets, and history are accepted as exposed.
  (The org's v4 "deliberately generic Tabletop-Atlas" naming for a multi-game vision is superseded —
  the project is Spirit-Island-only, hence `spirit-island-codex`.)
- **Promotion scope:** one r/spiritisland post, framed as a community resource seeking feedback.
  Do **not** mention the unanswered outreach to GtG.
- **Takedown posture:** comply immediately with any DMCA notice, C&D, or rights-holder request; file
  no counter-notice. (A counter-notice would consent to US federal jurisdiction.)
- **Attribution:** the app already carries "unofficial, not affiliated" (Homepage footer) and a
  "ⓘ Source" citation on every cited tier list (author + title + URL + methodology, per ADR 0001).
  Added: a link to the official game page + the FAQ's "Creating your own game elements" terms, and a
  footer credit line for Spirit Island Archive and 3 Minute Board Games.
- **Hygiene:** fixed the README's wrong link (spiritisland.com is an unrelated Florida sailing
  business, "Spirit Island Legacy Inc"; the game's page is shop.greaterthangames.com/pages/spirit-island).
  Retargeted the repo for the subpath: `base`/`start_url` → `/spirit-island-codex/`, deploy.sh + README
  references updated.
- **Traceability:** this doc + ADR 0016 record the why.

## The publisher's position, verbatim

From the official Spirit Island FAQ (maintained by designer R. Eric Reuss), section **"Creating your
own game elements"**, retrieved via Querki's raw endpoint:

- App: https://querki.net/u/darker/spirit-island-faq/#!Creating-your-own-game-elements
- Raw: https://querki.net/raw/darker/spirit-island-faq/Creating-your-own-game-elements
- Corroborating fan usage: BGG thread 1931409 (Reuss's own post)

> **The publisher (Greater Than Games) has the following position:**
>
> "Do what you like, so long it doesn't involve any of the following:
> - Charging money for it;
> - Portraying it as an official Spirit Island product;
> - Posting it on the official greaterthangames.com forums.
>
> We will not under any circumstances look at submissions of such things, and will delete any posts
> on greaterthangames.com which contain them."

> **The designer (R. Eric Reuss) has the following position:**
>
> "Please respect the publisher's desires. I'd quite enjoy being able to peruse people's ideas for
> Spirit Island game elements, but have been advised that I only ought to do so when the creator of
> said ideas agrees to the following:
> - I am under **no obligation** to look at your ideas or to reply to your post/communication.
> - You are owed **no acknowledgement** for your ideas, even if something similar, identical, or
>   derivative is later published.
> - You are owed **no compensation of any sort** for your ideas … If relevant, you assign any and all
>   rights / creative control over your Spirit Island ideas to me."

The designer's three points govern *submitting ideas to Reuss personally* — the part that matters for
us is the publisher's blanket "Do what you like" minus the three prohibitions. Our app satisfies all
three exclusions: free, non-commercial; not portrayed as official (footer disclaimer); not posted on
greaterthangames.com forums.

**Honest caveat:** this FAQ section governs *creating your own* game elements. It never explicitly
addresses *reproducing existing card text and art*. The publisher's blanket permission plus the
tolerance precedent (SICK, the TTS mod) make "this is within bounds" a strong inference — recorded as
an inference, not as a guarantee.

## Legal landscape (research findings)

- **Protected expression:** rules/mechanics are not copyrightable (17 USC §102(b); Copyright Office
  FL-108; *Tetris v. Xio*), but card text and artwork are protected expression. Transcribing card
  text and displaying scanned art are reproductions of that expression (US §106; EU InfoSoc
  2001/29/EC Art. 2). Non-commercial status does not make the copying lawful by itself.
- **Fair use:** non-commercial is only factor 1 of US §107; factors 2–3 (creative work, entire
  portions copied) cut against a finding. The EU has **no fair use** — only enumerated exceptions
  (private copying, quotation), neither of which a public website satisfies.
- **EU residence:** not a shield. Copyright is territorial; GtG's US works are protected in the EU,
  and the site's US host means enforcement flows through GitHub's DMCA process.
- **DMCA mechanics (GitHub):** rights-holder notice → GitHub posts it publicly and notifies you →
  ~1 business day to comply, else repo disabled → counter-notice possible (published; consents to US
  federal jurisdiction) → 10–14 business days reinstatement unless the rights holder sues
  (§512(g)). EU DSA Art. 16 notice-and-action is the parallel EU mechanism, without the automatic
  reinstatement clock.
- **Realistic worst case:** a DMCA takedown/C&D, repo disabled, site dark — not a lawsuit. Suits
  become more likely with: monetization, substitution for the commercial product, counter-notice
  escalation (*Tetris v. Xio* pattern), continued distribution after a formal C&D, or trademark
  confusion from using the "Spirit Island" name/logos as if official.
- **Precedent of tolerance:** SICK (oberien/spirit-island-card-katalog — public repo, live site,
  full card images + text, Apache-2.0/MIT, linked by the official wiki); the GtG-permitted TTS mod
  (~85k subscribers, public GitHub mirror); ArkhamDB, Scryfall, Dominion Strategy Wiki (decade-old
  free fan databases). Documented *takedowns* of non-commercial fan projects (Nintendo's AM2R and
  Pokémon Uranium) were takedowns of **fan games**, a different risk class from a reference
  database; no suit followed either.
- **No official fan-content policy exists at GtG.** The FAQ terms are the closest thing, and the
  community treats them as authoritative.

## Secret/credential sweep (before making the repo public)

- No `.env`, keys, tokens, or credentials in tracked files or git history (checked names, content
  patterns, and the file list).
- Personal data present and now public: `AdamKubovic`, `adam.kubovic@gmail.com` in a few `.scratch/`
  docs. Owner explicitly accepts this exposure.
- The `images/` archive (1.6GB originals) stays git-ignored; only the manifest and the committed
  `public/` webp derivatives ship.

## What changed in the repo (this effort)

- Repo transferred `Tabletop-Atlas/tabletop-atlas.github.io` → `AdamKubovic/spirit-island-codex` and
  renamed (2026-08-06).
- `README.md`: corrected the game link; rewrote the Deployment section for the subpath.
- `vite.config.ts`: `base` and PWA `start_url` → `/spirit-island-codex/`.
- `scripts/deploy.sh`: URL references updated.
- `src/components/Homepage.tsx`: footer now links the fan-content terms + official game page, and
  credits Spirit Island Archive and 3 Minute Board Games.
- `docs/adr/0016-public-sharing-posture.md`: the decision record.
