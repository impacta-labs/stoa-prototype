import { NavLink, useLocation } from 'react-router-dom'
import { organization, councilSession } from '../data/fixtures'
import { useIsMobile } from '../hooks/useViewport'

const SCREENS = [
  { path: '/',            label: 'Atrium',       short: 'ATR' },
  { path: '/chamber',     label: 'Chamber',      short: 'D-042' },
  { path: '/reading-room',label: 'Reading Room', short: 'M-017' },
  { path: '/council',     label: 'Council',      short: 'SES' },
  { path: '/weather',     label: 'Weather',      short: 'WX' },
  { path: '/horizon',     label: 'Horizon',      short: 'HZN' },
]

export default function Nav() {
  const location = useLocation()
  const isMobile = useIsMobile()

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

      {/* System state */}
      {!isMobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingLeft: 24,
            borderLeft: '1px solid var(--stoa-rule)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--stoa-ink-3)',
              letterSpacing: '0.06em',
            }}
          >
            {councilSession.sessionRef}
          </span>
          <div
            style={{
              width: 1,
              height: 12,
              backgroundColor: 'var(--stoa-rule-strong)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'var(--stoa-gold)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                color: 'var(--stoa-ink-2)',
                letterSpacing: '0.02em',
              }}
            >
              {organization.name}
            </span>
          </div>
        </div>
      )}
    </nav>
  )
}
