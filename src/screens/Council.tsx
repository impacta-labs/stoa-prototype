import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem, compress } from '../lib/motion'
import { councilSession } from '../data/fixtures'

export default function Council() {
  const [activeStation, setActiveStation] = useState(councilSession.stations[1].id)
  const session = councilSession
  const currentStation = session.stations.find((s) => s.id === activeStation)!

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      {/* Session Header */}
      <div
        style={{
          padding: '24px 40px 20px',
          borderBottom: '1px solid var(--stoa-border-strong)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
              Council
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--stoa-gold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}
            >
              Live
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 22,
              fontWeight: 400,
              color: 'var(--stoa-ink)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {session.title}
          </h1>
        </motion.div>
        <motion.div variants={settle} style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 4px' }}>
            {session.date}
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0 }}>
            Convened by {session.convener}
          </p>
        </motion.div>
      </div>

      {/* Station tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--stoa-rule)',
          backgroundColor: 'var(--stoa-surface-1)',
        }}
      >
        {session.stations.map((station, i) => {
          const active = station.id === activeStation
          return (
            <button
              key={station.id}
              onClick={() => setActiveStation(station.id)}
              style={{
                flex: 1,
                padding: '14px 20px',
                textAlign: 'left' as const,
                background: 'none',
                border: 'none',
                borderRight: i < session.stations.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                borderBottom: active ? '2px solid var(--stoa-gold)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--stoa-ink)' : 'var(--stoa-ink-2)',
                  letterSpacing: '0.02em',
                  display: 'block',
                  marginBottom: 3,
                }}
              >
                {station.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  color: 'var(--stoa-ink-3)',
                  lineHeight: 1.3,
                  display: 'block',
                }}
              >
                {station.description}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active Station Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStation}
            variants={compress}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ flex: 1, padding: '28px 40px', overflowY: 'auto' as const }}
          >
            <motion.div
              variants={deposit}
              initial="hidden"
              animate="visible"
            >
              {currentStation.content.map((item, i) => (
                <motion.div
                  key={i}
                  variants={depositItem}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '14px 0',
                    borderBottom: i < currentStation.content.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--stoa-ink-3)',
                      width: 20,
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 15,
                      color: 'var(--stoa-ink)',
                      margin: 0,
                      lineHeight: 1.65,
                    }}
                  >
                    {item}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Participants + Status bar */}
      <div
        style={{
          borderTop: '1px solid var(--stoa-rule)',
          padding: '0 40px',
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--stoa-surface-1)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              color: 'var(--stoa-ink-3)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              marginRight: 4,
            }}
          >
            Participants
          </span>
          {session.participants.map((p) => (
            <div key={p.name} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: p.present ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  color: p.present ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)',
                }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
            {session.date}
          </span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--stoa-gold)',
              animation: 'none',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            In Session
          </span>
        </div>
      </div>
    </motion.div>
  )
}
