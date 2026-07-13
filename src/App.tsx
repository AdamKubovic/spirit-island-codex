import { useState } from 'react'
import { AppShell, type NavItem } from './components/AppShell'
import { Browser } from './components/Browser'
import { CardsTab } from './components/CardsTab'
import { GameLog } from './components/GameLog'
import { Homepage } from './components/Homepage'
import { RecommenderMain, RecommenderProvider, RecommenderSide } from './components/Recommender'
import { TierBoard } from './components/TierBoard'
import { TierEditor } from './components/TierEditor'

/** 'home' is not a nav tab (#01 decision 3): the clickable logo is the only route home, and
 * while it is current no nav item matches it, so none shows active. */
type Tab = 'home' | 'recommender' | 'browser' | 'cards' | 'tiers' | 'customise' | 'log'

const NAV: NavItem<Tab>[] = [
  { id: 'browser', label: 'Browse' },
  { id: 'recommender', label: 'Recommend' },
  { id: 'cards', label: 'Archive' },
  { id: 'tiers', label: 'Tier list' },
  { id: 'customise', label: 'Customise tiers' },
  { id: 'log', label: 'Log' },
]

function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <RecommenderProvider>
      <AppShell
        nav={NAV}
        current={tab}
        onNavigate={setTab}
        onHome={() => setTab('home')}
        side={tab === 'recommender' ? <RecommenderSide /> : null}
      >
        {tab === 'home' && <Homepage onNavigate={setTab} />}
        {tab === 'recommender' && <RecommenderMain />}
        {tab === 'browser' && <Browser />}
        {tab === 'cards' && <CardsTab />}
        {tab === 'tiers' && <TierBoard />}
        {tab === 'customise' && <TierEditor />}
        {tab === 'log' && <GameLog />}
      </AppShell>
    </RecommenderProvider>
  )
}

export default App
