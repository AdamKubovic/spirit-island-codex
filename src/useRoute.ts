import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { formatRoute, parseHash, type Route } from './domain/route'

/**
 * spirit-link-new-tab: the DOM half of the routing model. `domain/route.ts` holds the pure parse /
 * format rules and knows nothing about the browser; this file is the only place that touches
 * `window.location`, which is what keeps the interesting logic unit-testable without a DOM.
 *
 * `useSyncExternalStore` rather than `useState` + a `useEffect` listener: the hash *is* external
 * state owned by the browser, and this is the primitive for reading it without tearing. It also
 * takes a server snapshot, which matters here — the test suite renders `<App />` through
 * `renderToStaticMarkup` (`appSmoke.test.tsx`), where there is no `window` at all.
 */

function subscribe(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}

/** A string, so `useSyncExternalStore`'s identity check compares by value and doesn't re-render
 * on every tick the way a fresh object would. Parsing happens after, memoised on this. */
function getSnapshot(): string {
  return window.location.hash
}

/** Server / static render: no `window`, so the boot state is the bare route — home. */
function getServerSnapshot(): string {
  return ''
}

/**
 * The current route, plus the one way to change it. Navigation is a hash assignment: it pushes a
 * history entry, so browser back/forward walk the app for free, and it fires `hashchange`, which
 * is what re-renders through the subscription above.
 */
export function useRoute(): [Route, (next: Route) => void] {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  // Memoised on the raw hash so the route object keeps a stable identity between renders and is
  // safe to use in a dependency array.
  const route = useMemo(() => parseHash(hash), [hash])
  const navigate = useCallback((next: Route) => {
    window.location.hash = formatRoute(next)
  }, [])
  return [route, navigate]
}
