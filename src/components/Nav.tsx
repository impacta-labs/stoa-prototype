import { NavLink, useLocation } from 'react-router-dom'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore } from '../store/decisions'
import { useOrgStore } from '../store/org'

const SCREENS = [
  { path: '/',             label: 'Atrio',     short: 'ATR' },
  { path: '/chamber',     label: 'Decisiones',  short: 'DEC' },
  { path: '/reading-room',label: 'Archivo',    short: 'M-017' },
  { path: '/council',     label: 'Consejo',    short: 'SES' },
  { path: '/weather',     label: 'Clima',      short: 'CLIMA' },
  { path: '/horizon',     label: 'Horizonte',  short: 'HZN' },
]

export default function Nav() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const { pilotMode, togglePilotMode, openCreateModal, decisions } = useDecisionsStore()
  const { name: orgName, isConfigured, openSetup } = useOrgStore()
  const today = new Date()
  const sessionRef = `S-${String(today.getFullYear()).slice(2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

  return (
    <nav
      style={{
        height: isMobile ? 44 : 48,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 40px',
        borderBottom: '1px solid var(--stoa-rule)',
        flexShrink: 0,
        backgroundColor: 'var(--stoa-surface-1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Wordmark */}
      <NavLink
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          paddingRight: isMobile ? 12 : 32,
          borderRight: '1px solid var(--stoa-rule)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 400,
            color: 'var(--stoa-ink)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
          }}
        >
          Stoa
        </span>
      </NavLink>

      {/* Nav links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flex: 1,
          overflowX: 'auto' as const,
          scrollbarWidth: 'none' as const,
          msOverflowStyle: 'none' as const,
        }}
      >
        {SCREENS.map(({ path, label, short }) => {
          const active = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)
          return (
            <NavLink
              key={path}
              to={path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '0 10px' : '0 14px',
                fontFamily: 'var(--font-sans)',
                fontSize: isMobile ? 11 : 12,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--stoa-ink)' : 'var(--stoa-ink-3)',
                borderBottom: active ? '1px solid var(--stoa-gold)' : '1px solid transparent',
                letterSpacing: '0.02em',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                whiteSpace: 'nowrap' as const,
                flexShrink: 0,
              }}
            >
              {isMobile ? short : label}
            </NavLink>
          )
        })}
      </div>

      {/* Right zone */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 8 : 12,
          paddingLeft: isMobile ? 8 : 16,
          borderLeft: '1px solid var(--stoa-rule)',
          flexShrink: 0,
        }}
      >
        {/* Nueva iniciativa */}
        <button
          onClick={openCreateModal}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--stoa-bg)',
            backgroundColor: 'var(--stoa-gold)',
            border: 'none',
            padding: isMobile ? '4px 10px' : '5px 14px',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}
        >
          {isMobile ? '+' : '+ Nueva'}
        </button>

        {/* Pilot mode toggle */}
        {!isMobile && (
          <button
            onClick={togglePilotMode}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: pilotMode ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
              background: 'none',
              border: `1px solid ${pilotMode ? 'var(--stoa-gold)' : 'var(--stoa-rule)'}`,
              padding: '3px 8px',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              flexShrink: 0,
            }}
          >
            {pilotMode ? 'Piloto ●' : 'Piloto'}
          </button>
        )}

        {/* System state */}
        {!isMobile && (
          <>
            <div style={{ width: 1, height: 12, backgroundColor: 'var(--stoa-rule-strong)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>
              {sessionRef}
            </span>
            <div style={{ width: 1, height: 12, backgroundColor: 'var(--stoa-rule-strong)' }} />
            <button
              onClick={openSetup}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column' as const, gap: 1 }}
              title="Configurar organización"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: isConfigured ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)', letterSpacing: '0.02em' }}>
                  {isConfigured ? orgName : 'Configurar org'}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', paddingLeft: 10, letterSpacing: '0.04em' }}>
                {decisions.length} decisión{decisions.length !== 1 ? 'es' : ''}
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
