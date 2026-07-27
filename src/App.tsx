import { AppShell, type NavItem } from './components/AppShell'
import { Browser } from './components/Browser'
import { CardsTab } from './components/CardsTab'
import { DashboardTab } from './components/DashboardTab'
import { GameLog } from './components/GameLog'
import { GlossaryTab } from './components/GlossaryTab'
import { Homepage } from './components/Homepage'
import { fromConfigId } from './domain/configurations'
import { spiritRoute, type Tab } from './domain/route'
import { RecommenderMain, RecommenderProvider, RecommenderSide } from './components/Recommender'
import { Settings } from './components/Settings'
import { TierBoard } from './components/TierBoard'
import { useRoute } from './useRoute'

/** Nav is fixed at both ends (#02 decision 4): Browse first, Settings last. Customise tiers is
 * dissolved (#15): tier editing is an edit mode on the Tier list tab. */
const NAV: NavItem<Tab>[] = [
  { id: 'browser', label: 'Browse' },
  { id: 'recommender', label: 'Recommend' },
  { id: 'cards', label: 'Archive' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tiers', label: 'Tier list' },
  { id: 'log', label: 'Log' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'settings', label: 'Settings' },
]

function App() {
  // spirit-link-new-tab: navigation lives in the URL, not in component state, so a spirit detail
  // has an address a new tab can cold-load. `route.tab` replaces the old `useState<Tab>`, and the
  // open spirit — previously `Browser`'s own `selected` — is now `route.spiritId`.
  const [route, navigate] = useRoute()
  const { tab } = route

  const goToTab = (next: Tab) => navigate({ tab: next })

  // #02's Recommend→Browse deep link lands here. It used to hand `Browser` a one-shot
  // `initialTarget` prop that had to be reported as consumed; now it just changes the URL, and
  // Browse renders whatever the URL says. No handshake to get wrong.
  function goToConfiguration(configId: string) {
    const { spiritId, aspectName } = fromConfigId(configId)
    navigate(spiritRoute(spiritId, aspectName))
  }

  return (
    <RecommenderProvider>
      <AppShell
        nav={NAV}
        current={tab}
        onNavigate={goToTab}
        onHome={() => goToTab('home')}
        side={tab === 'recommender' ? <RecommenderSide /> : null}
      >
        {tab === 'home' && <Homepage onNavigate={goToTab} />}
        {tab === 'recommender' && <RecommenderMain onSelectConfiguration={goToConfiguration} />}
        {tab === 'browser' && (
          <Browser
            target={route.spiritId ? { spiritId: route.spiritId, aspectSlug: route.aspectSlug } : null}
            onOpenSpirit={(spiritId, aspectName) => navigate(spiritRoute(spiritId, aspectName))}
            onCloseDetail={() => navigate({ tab: 'browser' })}
          />
        )}
        {tab === 'cards' && <CardsTab />}
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'tiers' && <TierBoard />}
        {tab === 'log' && <GameLog />}
        {tab === 'glossary' && <GlossaryTab />}
        {tab === 'settings' && <Settings />}
      </AppShell>
    </RecommenderProvider>
  )
}

export default App
