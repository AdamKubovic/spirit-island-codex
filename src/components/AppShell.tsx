import { useState, type ReactNode } from 'react'

export interface NavItem<T extends string> {
  id: T
  label: string
}

/**
 * The "command deck" shell: a persistent sidebar (brand, nav) beside a dense main pane.
 *
 * mobile-panel: at the phone breakpoint (≤640px, see deck.css) the shell instead shows a
 * sticky top bar (logo + hamburger) and the nav slides in as a drawer. The drawer is
 * CSS-off-canvas, never unmounted — the nav destinations stay in the rendered markup with
 * the drawer closed. Tabs own all their live controls in the main pane (recommender-results
 * -polish #01: the recommend answers panel moved onto its results board, and the shell
 * stopped carrying a `side` slot for survey state).
 */
export function AppShell<T extends string>({
  nav,
  current,
  onNavigate,
  onHome,
  children,
}: {
  nav: NavItem<T>[]
  current: T
  onNavigate: (id: T) => void
  /** The logo is the only route home (#01 decision 3) — there is no Home nav button. */
  onHome: () => void
  children: ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const logo = (
    <img className="deck-brand" src={`${import.meta.env.BASE_URL}spirit-island-logo.webp`} alt="Spirit Island" />
  )

  return (
    <div className="deck" data-drawer-open={drawerOpen}>
      <header className="deck-topbar">
        <button
          type="button"
          className="deck-brand-button"
          onClick={() => {
            setDrawerOpen(false)
            onHome()
          }}
          aria-label="Home"
        >
          {logo}
        </button>
        <button
          type="button"
          className="deck-menu-toggle"
          onClick={() => setDrawerOpen((open) => !open)}
          aria-expanded={drawerOpen}
          aria-controls="deck-drawer"
          aria-label="Menu"
        >
          <span className="deck-menu-icon" aria-hidden="true" />
        </button>
      </header>
      <aside className="deck-side">
        <button type="button" className="deck-brand-button" onClick={onHome} aria-label="Home">
          {logo}
        </button>
        {/* the drawer IS the navigation landmark — aria-controls points at the labelled <nav> */}
        <nav id="deck-drawer" className="deck-drawer deck-nav" aria-label="Main">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={current === item.id}
              aria-current={current === item.id ? 'page' : undefined}
              onClick={() => {
                setDrawerOpen(false)
                onNavigate(item.id)
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="deck-drawer-backdrop" aria-hidden="true" onClick={() => setDrawerOpen(false)} />
      <main className="deck-main">{children}</main>
    </div>
  )
}
