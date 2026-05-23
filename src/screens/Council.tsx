import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle } from '../lib/motion'
import { useIsMobile } from '../hooks/useViewport'
import { councilSession } from '../data/fixtures'

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

export default function Council() {
  const [activeStation, setActiveStation] = useState(councilSession.stations[0].id)
  const isMobile = useIsMobile()
  const session = councilSession
  const activeIndex = session.stations.findIndex((s) => s.id === activeStation)
  const currentStation = session.stations[activeIndex]
  const isClosing = currentStation.id === 'closing'
  const presentCount = session.participants.filter((p) => p.present).length

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
          padding: isMobile ? '16px 20px' : '20px 40px',
          borderBottom: '1px solid var(--stoa-rule-strong)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              Council
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.06em' }}>
              {session.sessionRef}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--stoa-gold)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase' as const,
              }}
            >
              In Session
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isMobile ? 16 : 20,
              fontWeight: 400,
              color: 'var(--stoa-ink)',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.005em',
            }}
          >
            {session.title}
          </h1>
        </motion.div>
        {!isMobile && (
          <motion.div variants={settle} style={{ textAlign: 'right' as const }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.04em' }}>
              {session.date} · Opened {session.startTime}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0 }}>
              Convened by {session.convener}
            </p>
          </motion.div>
        )}
      </div>

      {/* Main body: Agenda Rail + Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          flexDirection: isMobile ? 'column' as const : 'row' as const,
        }}
      >
        {/* Agenda Rail (desktop) / Horizontal tabs (mobile) */}
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--stoa-rule)',
              backgroundColor: 'var(--stoa-surface-1)',
              overflowX: 'auto' as const,
              flexShrink: 0,
            }}
          >
            {session.stations.map((station, i) => {
              const active = station.id === activeStation
              const past = i < activeIndex
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStation(station.id)}
                  style={{
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '2px solid var(--stoa-gold)' : '2px solid transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: active ? 'var(--stoa-gold)' : past ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                      }}
                    >
                      {ROMAN[i]}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 11,
                        fontWeight: active ? 500 : 400,
                        color: active ? 'var(--stoa-ink)' : 'var(--stoa-ink-3)',
                        whiteSpace: 'nowrap' as const,
                      }}
                    >
                      {station.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div
            style={{
              width: 188,
              borderRight: '1px solid var(--stoa-rule)',
              backgroundColor: 'var(--stoa-surface-1)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Session mini-card */}
            <div
              style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid var(--stoa-rule)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                {session.sessionRef}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)', margin: '0 0 2px' }}>
                {session.date}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0 }}>
                {session.convener.split(' ')[1]} · {session.startTime}
              </p>
            </div>

            {/* Agenda items */}
            <div style={{ flex: 1 }}>
              {session.stations.map((station, i) => {
                const active = station.id === activeStation
                const past = i < activeIndex
                return (
                  <button
                    key={station.id}
                    onClick={() => setActiveStation(station.id)}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 18px',
                      textAlign: 'left' as const,
                      background: 'none',
                      border: 'none',
                      borderLeft: active ? '2px solid var(--stoa-gold)' : '2px solid transparent',
                      borderBottom: '1px solid var(--stoa-rule)',
                      cursor: 'pointer',
                      backgroundColor: active ? 'var(--stoa-gold-subtle)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: active ? 'var(--stoa-gold)' : past ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                          width: 18,
                          flexShrink: 0,
                        }}
                      >
                        {ROMAN[i]}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 12,
                          fontWeight: active ? 500 : 400,
                          color: active ? 'var(--stoa-ink)' : past ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)',
                          lineHeight: 1.2,
                        }}
                      >
                        {station.label}
                      </span>
                      {past && (
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: 'var(--stoa-resolve)',
                            flexShrink: 0,
                            marginLeft: 'auto',
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 10,
                        color: 'var(--stoa-ink-3)',
                        margin: '0 0 0 28px',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}
                    >
                      {station.description}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Record attribution */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--stoa-rule)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                Record in progress
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '2px 0 0', letterSpacing: '0.03em' }}>
                Next: {session.nextCouncil}
              </p>
            </div>
          </div>
        )}

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Station header */}
          <div
            style={{
              padding: isMobile ? '16px 20px' : '20px 40px 16px',
              borderBottom: '1px solid var(--stoa-rule)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--stoa-ink-3)',
                  letterSpacing: '0.06em',
                }}
              >
                {ROMAN[activeIndex]}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 17 : 20,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {currentStation.label}
              </h2>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                color: 'var(--stoa-ink-3)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {currentStation.description}
            </p>
          </div>

          {/* Minutes content */}
          <div
            style={{
              flex: 1,
              padding: isMobile ? '16px 20px' : '20px 40px',
              overflowY: 'auto' as const,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {currentStation.content.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: isMobile ? 14 : 20,
                      padding: '16px 0',
                      borderBottom: i < currentStation.content.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--stoa-ink-3)',
                        width: 20,
                        flexShrink: 0,
                        paddingTop: 3,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: isMobile ? 14 : 15,
                        color: isClosing ? 'var(--stoa-ink)' : 'var(--stoa-ink)',
                        margin: 0,
                        lineHeight: 1.7,
                        flex: 1,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}

                {/* Closing resolution footer */}
                {isClosing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.4 } }}
                    style={{
                      marginTop: 28,
                      paddingTop: 20,
                      borderTop: '1px solid var(--stoa-rule-strong)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                        Session Record
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 12,
                        color: 'var(--stoa-ink-3)',
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      This record will enter the Memory Layer on session close.
                      Verdict on D-042 required before 30 Jun 2026.
                      Next council: {session.nextCouncil}.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Participants + Status bar */}
      <div
        style={{
          borderTop: '1px solid var(--stoa-rule)',
          padding: isMobile ? '0 20px' : '0 40px',
          height: isMobile ? 40 : 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--stoa-surface-1)',
          flexShrink: 0,
        }}
      >
        {/* Participants */}
        <div style={{ display: 'flex', gap: isMobile ? 14 : 20, alignItems: 'center', overflow: 'hidden' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--stoa-ink-3)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase' as const,
              flexShrink: 0,
            }}
          >
            {presentCount}/{session.participants.length}
          </span>
          {session.participants.map((p) => (
            <div key={p.name} style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: p.present ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isMobile ? 10 : 11,
                  color: p.present ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)',
                  fontStyle: p.present ? 'normal' : 'italic',
                }}
              >
                {isMobile
                  ? p.name.split(' ')[0][0] + '. ' + p.name.split(' ')[1]
                  : p.name.split(' ')[0] + ' ' + p.name.split(' ')[1][0] + '.'}
              </span>
            </div>
          ))}
        </div>

        {/* Session reference + status */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          {!isMobile && (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                {session.sessionRef}
              </span>
              <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)' }} />
            </>
          )}
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
            In Session
          </span>
        </div>
      </div>
    </motion.div>
  )
}
