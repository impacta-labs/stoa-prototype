import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import NuevaIniciativa from './components/NuevaIniciativa'
import Atrium from './screens/Atrium'
import Chamber from './screens/Chamber'
import DecisionChamber from './screens/DecisionChamber'
import ReadingRoom from './screens/ReadingRoom'
import Council from './screens/Council'
import Weather from './screens/Weather'
import Horizon from './screens/Horizon'
import { useDecisionsStore } from './store/decisions'

function Layout({ children }: { children: React.ReactNode }) {
  const showCreateModal = useDecisionsStore((s) => s.showCreateModal)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--stoa-bg)' }}>
      <Nav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {showCreateModal && <NuevaIniciativa />}
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout><Atrium /></Layout>} />
        <Route path="/chamber" element={<Layout><Chamber /></Layout>} />
        <Route path="/chamber/:id" element={<Layout><DecisionChamber /></Layout>} />
        <Route path="/reading-room" element={<Layout><ReadingRoom /></Layout>} />
        <Route path="/council" element={<Layout><Council /></Layout>} />
        <Route path="/weather" element={<Layout><Weather /></Layout>} />
        <Route path="/horizon" element={<Layout><Horizon /></Layout>} />
      </Routes>
    </HashRouter>
  )
}
