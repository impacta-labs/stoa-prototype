import { motion } from 'framer-motion'
import { Wordmark, Rule, Signal } from '../components'
import { chamberEnter, settle, deposit } from '../lib/motion'
import { signals } from '../data/fixtures'

const NAV_ITEMS = ['Chamber', 'Archive', 'Memory']

export default function Shell() {
  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--stoa-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          borderBottom: '1px solid var(--stoa-rule)',
          flexShrink: 0,
        }}
      >
        <motion.div variants={settle}>
          <Wordmark />
        </motion.div>

        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', gap: 28, alignItems: 'center' }}
        >
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item}
              variants={settle}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--stoa-ink-2)',
                letterSpacing: '0.02em',
                padding: 0,
              }}
            >
              {item}
            </motion.button>
          ))}
        </motion.div>
      </nav>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: '72px 40px 56px',
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Display */}
        <motion.div variants={settle} style={{ marginBottom: 64 }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 42,
              fontWeight: 400,
              lineHeight: 1.18,
              color: 'var(--stoa-ink)',
              maxWidth: 560,
              margin: '0 0 20px',
              letterSpacing: '-0.01em',
            }}
          >
            The organization<br />is becoming self-aware.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              fontWeight: 300,
              color: 'var(--stoa-ink-2)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Foundation established. Awaiting specification.
          </p>
        </motion.div>

        <Rule weight="strong" />

        {/* Column headers */}
        <motion.div
          variants={settle}
          style={{
            display: 'flex',
            gap: 0,
            padding: '16px 0 14px',
            alignItems: 'center',
          }}
        >
          {['Decision', 'Status', 'Context', 'Record'].map((col, i) => (
            <span key={col}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 400,
                  color: 'var(--stoa-ink-3)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {col}
              </span>
              {i < 3 && (
                <span
                  style={{
                    color: 'var(--stoa-rule)',
                    margin: '0 16px',
                    fontSize: 11,
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </motion.div>

        <Rule />

        {/* Signals */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
        >
          {signals.map((signal, i) => (
            <div key={signal.id}>
              <Signal
                label={signal.label}
                status={signal.status}
                context={signal.context}
                timestamp={signal.timestamp}
              />
              {i < signals.length - 1 && <Rule />}
            </div>
          ))}
        </motion.div>
      </main>

      {/* Status bar */}
      <motion.footer
        variants={settle}
        style={{
          height: 36,
          borderTop: '1px solid var(--stoa-rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--stoa-ink-3)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
          }}
        >
          Stoa · Foundation · v0.1
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--stoa-ink-3)',
          }}
        >
          {new Date().toISOString().slice(0, 10)}
        </span>
      </motion.footer>
    </motion.div>
  )
}
