/** The Spirit Island Wiki's page URL pattern (verified from the wiki itself, 2026-08-08):
 * every page is `index.php?title=<MediaWiki-encoded title>` - spaces become underscores,
 * and the wiki percent-encodes what browsers leave raw (`'` → %27, `&` → %26, ...). */
export const WIKI_BASE = 'https://spiritislandwiki.com/index.php?title='

/** The wiki home page - the footer's sources line links here. */
export const WIKI_SITE = 'https://spiritislandwiki.com/'

/** The wiki's catalog page for each Archive segment (ADR 0020 link-out: the Archive sends the
 * visitor to the wiki's own list rather than claiming to be the full reference). Titles verified
 * against the wiki's own navigation, 2026-08-08 - List_of_Power_Cards, List_of_Fear_Cards,
 * List_of_Event_Cards, List_of_Blight_Cards, List_of_Adversaries, List_of_Scenarios all resolve. */
export const SEGMENT_WIKI: Record<string, string> = {
  Powers: 'List of Power Cards',
  Fear: 'List of Fear Cards',
  Events: 'List of Event Cards',
  Blight: 'List of Blight Cards',
  Adversaries: 'List of Adversaries',
  Scenarios: 'List of Scenarios',
}

/** A page title → its canonical wiki URL (`"Lightning's Swift Strike"` →
 * `https://spiritislandwiki.com/index.php?title=Lightning%27s_Swift_Strike`). The link-outs
 * that make the companion stance concrete (ADR 0020): wherever the app shows content the wiki
 * also owns, it sends the visitor back. */
export function wikiLink(title: string): string {
  const underscore = title.replace(/ /g, '_')
  const encoded = encodeURIComponent(underscore).replace(/[!'()*~]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`)
  return `${WIKI_BASE}${encoded}`
}
