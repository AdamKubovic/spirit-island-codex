import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './deck.css'
import App from './App.tsx'
import { useRegisterSW } from 'virtual:pwa-register/react'

// Registration lives here rather than inside App/Settings (#04): the virtual module vite-plugin-pwa
// generates is not guaranteed to resolve under the test runner, and main.tsx sits outside the
// appSmoke test's import graph, so a resolution failure there can never break that render.
function Root() {
  const { offlineReady: [offlineReady] } = useRegisterSW()
  return <App offlineReady={offlineReady} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
