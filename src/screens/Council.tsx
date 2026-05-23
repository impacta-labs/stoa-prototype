import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle } from '../lib/motion'
import { useIsMobile } from '../hooks/useViewport'
import { councilSession, councilHistory, type StationItem } from '../data/fixtures'

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

function ResolvedItem({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '14px 0',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, paddingTop: 3 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
          Resolved
        </span>
      </div>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.65, flex: 1 }}>
        {text}
      </p>
    </div>
  )
}

function ActionItem({ actor, due, text }: { actor?: string; due?: string; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '14px 0',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, flexShrink: 0, paddingTop: 2 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            Action
          </span>
        </div>
        {actor && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-2)', paddingLeft: 10 }}>
            {actor}
          </span>
        )}
        {due && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', paddingLeft: 10, letterSpacing: '0.03em' }}>
            Due {due}
          </span>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.65, flex: 1 }}>
        {text}
      </p>
    </div>
  )
}

function ScheduleItem({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '14px 0',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-ink-3)', flexShrink: 0, marginTop: 5 }} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.65, flex: 1, letterSpacing: '0.02em' }}>
        {text}
      </p>
    </div>
  )
}

function AttributedItem({ actor, date, text, index }: { actor?: string; date?: string; text: string; index: number }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 0',
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', width: 20, flexShrink: 0, paddingTop: 2 }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div style={{ flex: 1 }}>
        {(actor || date) && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
            {actor && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, color: 'var(--stoa-ink-2)' }}>{actor}</span>}
            {date && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{date}</span>}
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.65 }}>
          {text}
        </p>
      </div>
    </div>
  )
}

function NoteItem({ text, index }: { text: string; index: number }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 0',
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', width: 20, flexShrink: 0, paddingTop: 2 }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.65, flex: 1 }}>
        {text}
      </p>
    </div>
  )
}

function SignalItem_({ ref_: ref_, text, index }: { ref_?: string; text: string; index: number }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 0',
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', width: 20, flexShrink: 0, paddingTop: 2 }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div style={{ flex: 1 }}>
        {ref_ && (
          <div style={{ marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
              {ref_}
            </span>
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.65 }}>
          {text}
        </p>
      </div>
    </div>
  )
}

function renderStationItem(item: StationItem, index: number, isClosing: boolean) {
  if (isClosing) {
    switch (item.type) {
      case 'resolved':
        return (
          <div key={index} style={{ borderBottom: '1px solid var(--stoa-rule)' }}>
            <ResolvedItem text={item.text} />
          </div>
        )
      case 'action':
        return (
          <div key={index} style={{ borderBottom: '1px solid var(--stoa-rule)' }}>
            <ActionItem actor={item.actor} due={item.due} text={item.text} />
          </div>
        )
      case 'schedule':
        return (
          <div key={index} style={{ borderBottom: '1px solid var(--stoa-rule)' }}>
            <ScheduleItem text={item.text} />
          </div>
        )
      default:
        return (
          <div key={index} style={{ borderBottom: '1px solid var(--stoa-rule)' }}>
            <NoteItem text={item.text} index={index} />
          </div>
        )
    }
  }

  const withBorder = { borderBottom: '1px solid var(--stoa-rule)' }
  switch (item.type) {
    case 'signal':
      return (
        <div key={index} style={withBorder}>
          <SignalItem_  ref_={item.ref} text={item.text} index={index} />
        </div>
      )
    case 'attributed':
      return (
        <div key={index} style={withBorder}>
          <AttributedItem actor={item.actor} date={item.date} text={item.text} index={index} />
        </div>
      )
    default:
      return (
        <div key={index} style={withBorder}>
          <NoteItem text={item.text} index={index} />
        </div>
      )
  }
}

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
          padding: isMobile ? '14px 20px' : '18px 40px',
          borderBottom: '1px solid var(--stoa-rule-strong)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
              Council
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.06em' }}>
              {session.sessionRef}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                In Session
              </span>
            </div>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isMobile ? 15 : 19,
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
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.04em' }}>
              {session.date} · Opened {session.startTime}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 2px' }}>
              Convened by {session.convener}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.03em' }}>
              Previous: {session.previousSession.ref} · {session.previousSession.date}
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
              scrollbarWidth: 'none' as const,
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
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '2px solid var(--stoa-gold)' : '2px solid transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: active ? 'var(--stoa-gold)' : past ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)' }}>
                      {ROMAN[i]}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: active ? 500 : 400, color: active ? 'var(--stoa-ink)' : 'var(--stoa-ink-3)', whiteSpace: 'nowrap' as const }}>
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
              width: 200,
              borderRight: '1px solid var(--stoa-rule)',
              backgroundColor: 'var(--stoa-surface-1)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Session mini-card */}
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--stoa-rule)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', margin: '0 0 3px', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                {session.sessionRef}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)', margin: '0 0 2px' }}>
                {session.date}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 10px' }}>
                {session.convener.split(' ')[0]} {session.convener.split(' ')[1][0]}. · {session.startTime}
              </p>
              <div style={{ paddingTop: 8, borderTop: '1px solid var(--stoa-rule)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.05em' }}>
                  Prev: {session.previousSession.ref}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.35 }}>
                  {session.previousSession.focus}
                </p>
              </div>
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
                      padding: '13px 16px 13px 18px',
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
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: active ? 'var(--stoa-gold)' : past ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)', width: 18, flexShrink: 0 }}>
                        {ROMAN[i]}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: active ? 500 : 400, color: active ? 'var(--stoa-ink)' : past ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)', lineHeight: 1.2 }}>
                        {station.label}
                      </span>
                      {past && (
                        <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)', flexShrink: 0, marginLeft: 'auto' }} />
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 0 28px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {station.description}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* History */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--stoa-rule)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 6px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                Session history
              </p>
              {councilHistory.slice(0, 2).map((h) => (
                <div key={h.ref} style={{ marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                    {h.ref}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', marginLeft: 6 }}>
                    {h.date.replace('2026', '').trim().replace(' · ', '')}
                  </span>
                </div>
              ))}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '8px 0 0', letterSpacing: '0.05em' }}>
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
              padding: isMobile ? '14px 20px 12px' : '18px 40px 14px',
              borderBottom: '1px solid var(--stoa-rule)',
              flexShrink: 0,
              backgroundColor: isClosing ? 'var(--stoa-surface-1)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: isClosing ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>
                {ROMAN[activeIndex]}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 16 : 19,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {currentStation.label}
              </h2>
              {isClosing && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                  {currentStation.content.filter(c => c.type === 'resolved').length} resolved · {currentStation.content.filter(c => c.type === 'action').length} actions
                </span>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.45 }}>
              {currentStation.description}
            </p>
          </div>

          {/* Minutes content */}
          <div style={{ flex: 1, padding: isMobile ? '0 20px' : '0 40px', overflowY: 'auto' as const, backgroundColor: isClosing ? 'rgba(196, 149, 42, 0.02)' : 'transparent' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                {currentStation.content.map((item, i) =>
                  renderStationItem(item, i, isClosing)
                )}

                {/* Closing resolution footer */}
                {isClosing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }}
                    style={{ paddingTop: 20, paddingBottom: 24 }}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                        Session record
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                        {session.sessionRef} · {session.date}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '8px 0 0 12px', lineHeight: 1.6 }}>
                      This record will enter the Memory Layer on session close.
                      Verdict on D-042 required before 30 Jun 2026.
                      Next council: {session.nextCouncil}.
                    </p>
                  </motion.div>
                )}

                {/* Non-closing: padding at bottom */}
                {!isClosing && <div style={{ height: 24 }} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Participants + Status bar */}
      <div
        style={{
          borderTop: '1px solid var(--stoa-rule)',
          padding: isMobile ? '0 16px' : '0 40px',
          height: isMobile ? 38 : 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--stoa-surface-1)',
          flexShrink: 0,
        }}
      >
        {/* Participants */}
        <div style={{ display: 'flex', gap: isMobile ? 10 : 18, alignItems: 'center', overflow: 'hidden' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
            {presentCount}/{session.participants.length}
          </span>
          {session.participants.map((p) => (
            <div key={p.name} style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: p.present ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 10 : 11, color: p.present ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)', fontStyle: p.present ? 'normal' : 'italic' }}>
                {isMobile
                  ? p.name.split(' ')[0][0] + '. ' + p.name.split(' ')[1]
                  : p.name.split(' ')[0] + ' ' + p.name.split(' ')[1][0] + '.'}
              </span>
            </div>
          ))}
        </div>

        {/* Session reference */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
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
