import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { deposit, depositItem } from '../lib/motion'
import Wordmark from './primitives/Wordmark'
import { organization } from '../data/fixtures'

const SCREENS = [
  { path: '/', label: 'Atrium' },
  { path: '/chamber', label: 'Chamber' },
  { path: '/reading-room', label: 'Reading Room' },
  { path: '/council', label: 'Council' },
  { path: '/weather', label: 'Weather' },
  { path: '/horizon', label: 'Horizon' },
]

export default function Nav() {
  const location = useLocation()

  return (
    <nav
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid var(--stoa-rule)',
        flexShrink: 0,
        backgroundColor: 'var(--stoa-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <Wordmark />
      </NavLink>

      <motion.div
        variants={deposit}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', gap: 4, alignItems: 'center' }}
      >
        {SCREENS.map(({ path, label }) => {
          const active = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)
          return (
            <motion.div key={path} variants={depositItem}>
              <NavLink
                to={path}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--stoa-ink)' : 'var(--stoa-ink-2)',
                  borderBottom: active ? '1px solid var(--stoa-gold)' : '1px solid transparent',
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                {label}
              </NavLink>
            </motion.div>
          )
        })}
      </motion.div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: 'var(--stoa-gold)',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 400,
            color: 'var(--stoa-ink-2)',
            letterSpacing: '0.04em',
          }}
        >
          {organization.name}
        </span>
      </div>
    </nav>
  )
}
