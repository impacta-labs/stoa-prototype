import { motion } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import {
  organization,
  weeklyStanding,
  inDeliberation,
  ripeningPredictions,
  recentlySettled,
  memoryBand,
  systemStatus,
  councilHistory,
} from '../data/fixtures'

const statusColor: Record<string, string> = {
  deliberating: 'var(--stoa-gold)',
  open:         'var(--stoa-ink-3)',
  overdue:      'var(--stoa-amber)',
}

const statusLabel: Record<string, string> = {
  deliberating: 'En deliberación',
  open:         'Abierta',
  overdue:      'Vencida',
}

const hypothesisColor: Record<string, string> = {
  'confirmada':            'var(--stoa-resolve)',
  'parcialmente confirmada': 'var(--stoa-gold)',
  'refutada':              'var(--stoa-amber)',
  'inconclusa':            'var(--stoa-ink-3)',
}

export default function Atrium() {
  const isMobile = useIsMobile()

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Organization Header */}
      <div
        style={{
          padding: isMobile ? '24px 20px 20px' : '32px 40px 24px',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                  Atrio
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>
                  {organization.period}
                </span>
                {systemStatus.overdueDecisions > 0 && (
                  <>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                      {systemStatus.overdueDecisions} vencida
                    </span>
                  </>
                )}
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  margin: '0 0 5px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                }}
              >
                {organization.name}
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 300, color: 'var(--stoa-ink-3)', margin: '0 0 3px' }}>
                {organization.chapter}
              </p>
              {!isMobile && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0, fontWeight: 300 }}>
                  {organization.focus}
                </p>
              )}
            </div>
            {!isMobile && (
              <div style={{ textAlign: 'right' as const }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.05em' }}>
                  {organization.location} · Fund. {organization.founded}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.05em' }}>
                  Último consejo {weeklyStanding.lastConvened}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.05em' }}>
                  Sincronizado {systemStatus.lastSync}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Weekly Standing + In Deliberation */}
      <div
        className="stoa-col-left-280"
        style={{ borderBottom: '1px solid var(--stoa-rule)' }}
      >
        {/* Standing */}
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '20px 20px' : '22px 24px 22px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Estado Actual" meta={`Período hasta ${weeklyStanding.nextCouncil}`} />
          <div style={{ marginTop: 14 }}>
            {[
              { label: 'Decisiones Activas',       value: weeklyStanding.activeDecisions,     note: weeklyStanding.activeDecisionsChange },
              { label: 'Carga Deliberativa',        value: weeklyStanding.deliberationLoad,     note: weeklyStanding.deliberationLoadTrend },
              { label: 'Resueltas este Trimestre',  value: weeklyStanding.settledThisQuarter,   note: weeklyStanding.settledThisQuarterChange },
              { label: 'Entradas de Memoria',       value: weeklyStanding.memoryEntries,        note: weeklyStanding.memoryEntriesChange },
              { label: 'Participantes',             value: weeklyStanding.activeParticipants,   note: null },
            ].map(({ label, value, note }, i, arr) => (
              <div
                key={label}
                style={{
                  padding: '9px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: label === 'Carga Deliberativa' ? 'var(--stoa-amber)' : 'var(--stoa-ink)' }}>
                    {value}
                  </span>
                </div>
                {note && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '2px 0 0', textAlign: 'right' as const, letterSpacing: '0.03em' }}>
                    {note}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              Próximo Consejo
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-gold)', margin: '0 0 2px' }}>
              {weeklyStanding.nextCouncil}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 12px' }}>
              {systemStatus.pendingActions} acciones pendientes · {systemStatus.sessionRef} en sesión
            </p>
            <div style={{ borderTop: '1px solid var(--stoa-rule)', paddingTop: 10 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 5px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                Sesiones recientes
              </p>
              {councilHistory.slice(0, 3).map((h) => (
                <div key={h.ref} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                    {h.ref}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                    {h.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* In Deliberation */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '20px 20px' : '22px 40px 22px 24px' }}
        >
          <SectionHeader label="En Deliberación" meta={`${inDeliberation.length} activas`} />
          <div style={{ marginTop: 14 }}>
            {inDeliberation.map((d, i) => (
              <motion.div key={d.id} variants={depositItem}>
                <div
                  style={{
                    padding: '12px 0',
                    borderBottom: i < inDeliberation.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 5 }}>
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: statusColor[d.status],
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 13,
                            color: d.overdue ? 'var(--stoa-ink-2)' : 'var(--stoa-ink)',
                            lineHeight: 1.4,
                          }}
                        >
                          {d.title}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            color: statusColor[d.status],
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          {statusLabel[d.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingLeft: 14,
                      display: 'flex',
                      flexWrap: 'wrap' as const,
                      gap: '2px 14px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.03em' }}>
                      {d.id}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                      {d.owner}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: d.overdue ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)' }}>
                      {d.overdue ? `Venció ${d.deadline}` : `Plazo ${d.deadline}`}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                      {d.daysActive}d activa
                    </span>
                    {d.deliberationEntries > 0 ? (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                        {d.deliberationEntries} entradas
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', fontStyle: 'italic' }}>
                        sin entradas
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: d.overdue ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)' }}>
                      Última: {d.lastActivity}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ripening + Recently Settled */}
      <div
        className="stoa-col-2"
        style={{ borderBottom: '1px solid var(--stoa-rule)', flex: 1 }}
      >
        {/* En Maduración */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '20px 20px' : '22px 24px 22px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="En Maduración" meta={`${ripeningPredictions.length} próximas al umbral`} />
          <div style={{ marginTop: 14 }}>
            {ripeningPredictions.map((r, i) => (
              <motion.div
                key={r.id}
                variants={depositItem}
                style={{
                  padding: '13px 0',
                  borderBottom: i < ripeningPredictions.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: 'var(--stoa-amber)',
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                        {r.id}
                      </span>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.3 }}>
                        {r.signal}
                      </p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.4 }}>
                      {r.trigger}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recientemente Resueltas */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '20px 20px' : '22px 40px 22px 24px' }}
        >
          <SectionHeader label="Recientemente Resueltas" meta={`${recentlySettled.length} decisiones`} />
          <div style={{ marginTop: 14 }}>
            {recentlySettled.map((d, i) => (
              <motion.div
                key={d.id}
                variants={depositItem}
                style={{
                  padding: '11px 0',
                  borderBottom: i < recentlySettled.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: 'var(--stoa-resolve)',
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.35 }}>
                        {d.title}
                      </p>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                          {d.id}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                          {d.settled}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.4 }}>
                      {d.verdict}
                    </p>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginTop: 3 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.03em' }}>
                        Hilo: {d.thread}
                      </p>
                      {d.hypothesisStatus && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: hypothesisColor[d.hypothesisStatus] || 'var(--stoa-ink-3)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase' as const,
                        }}>
                          Hipótesis {d.hypothesisStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Memory Band */}
      <motion.div
        variants={settle}
        style={{
          padding: isMobile ? '0 20px' : '0 40px',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          overflow: 'hidden',
          backgroundColor: 'var(--stoa-surface-1)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
          Memoria
        </span>
        <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', overflow: 'hidden' }}>
          {memoryBand.map((entry, i) => (
            <span
              key={entry.id}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                color: i === 0 ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)',
                whiteSpace: 'nowrap' as const,
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, marginRight: 5, color: 'var(--stoa-ink-3)', letterSpacing: '0.03em' }}>
                {entry.id}
              </span>
              {entry.title}
              {!isMobile && (
                <span style={{ marginLeft: 8, color: 'var(--stoa-ink-3)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>
                  {entry.date}
                </span>
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
