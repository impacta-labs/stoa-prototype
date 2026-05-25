import { useEffect, useRef } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import NuevaIniciativa from './components/NuevaIniciativa'
import OrgSetup from './components/OrgSetup'
import AuthGate from './components/AuthGate'
import Atrium from './screens/Atrium'
import Chamber from './screens/Chamber'
import DecisionChamber from './screens/DecisionChamber'
import ReadingRoom from './screens/ReadingRoom'
import Council from './screens/Council'
import Weather from './screens/Weather'
import Horizon from './screens/Horizon'
import ExecutiveExport from './screens/ExecutiveExport'
import { useDecisionsStore } from './store/decisions'
import { useOrgStore } from './store/org'
import { useAuthStore } from './store/auth'
import { SUPABASE_ENABLED } from './lib/supabase'

function Layout({ children }: { children: React.ReactNode }) {
  const showCreateModal = useDecisionsStore((s) => s.showCreateModal)
  const { isConfigured, showSetup, showOnboarding } = useOrgStore()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--stoa-bg)' }}>
      <Nav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {showCreateModal && <NuevaIniciativa />}
      {!isConfigured && <OrgSetup isFirstTime />}
      {isConfigured && showSetup && <OrgSetup />}
      {isConfigured && showOnboarding && <OrgSetup isFirstTime />}
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Atrium /></Layout>} />
      <Route path="/chamber" element={<Layout><Chamber /></Layout>} />
      <Route path="/chamber/:id" element={<Layout><DecisionChamber /></Layout>} />
      <Route path="/reading-room" element={<Layout><ReadingRoom /></Layout>} />
      <Route path="/council" element={<Layout><Council /></Layout>} />
      <Route path="/weather" element={<Layout><Weather /></Layout>} />
      <Route path="/horizon" element={<Layout><Horizon /></Layout>} />
      <Route path="/chamber/:id/export" element={<ExecutiveExport />} />
    </Routes>
  )
}

export default function App() {
  const { initialized, user, initialize, syncDecisions, syncOrg } = useAuthStore()
  const decisions = useDecisionsStore((s) => s.decisions)
  const { name, sector, context, isConfigured } = useOrgStore()
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const orgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Boot: initialize Supabase session once
  useEffect(() => {
    initialize()
  }, [])

  // Debounced decisions sync → Supabase
  useEffect(() => {
    if (!SUPABASE_ENABLED || !user) return
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => syncDecisions(), 1200)
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current) }
  }, [decisions, user])

  // Debounced org sync → Supabase
  useEffect(() => {
    if (!SUPABASE_ENABLED || !user || !isConfigured) return
    if (orgTimer.current) clearTimeout(orgTimer.current)
    orgTimer.current = setTimeout(() => syncOrg(name, sector, context), 1200)
    return () => { if (orgTimer.current) clearTimeout(orgTimer.current) }
  }, [name, sector, context, isConfigured, user])

  // Loading spinner while Supabase session is being checked
  if (SUPABASE_ENABLED && !initialized) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--stoa-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--stoa-ink-3)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Cargando…
        </span>
      </div>
    )
  }

  // Auth gate — only when Supabase is configured and no session
  if (SUPABASE_ENABLED && !user) {
    return <AuthGate />
  }

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
