import { motion } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { horizonData } from '../data/fixtures'

const convictionColor: Record<string, string> = {
  High: 'var(--stoa-gold)',
  Medium: 'var(--stoa-ink-2)',
  Low: 'var(--stoa-ink-3)',
}

export default function Horizon() {
  const h = horizonData

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px 40px 20px',
          borderBottom: '1px solid var(--stoa-rule)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <motion.div variants={settle} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
            Horizon
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
            Forward-looking bets and watched signals
          </span>
        </motion.div>
        <motion.span variants={settle} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
          Alpha Espai · 2026–2028
        </motion.span>
      </div>

      {/* Bets + Predictions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        {/* Bets */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '28px 32px 28px 40px', borderRight: '1px solid var(--stoa-rule)' }}
        >
          <SectionHeader label="Bets" meta={`${h.bets.length} registered`} />
          <div style={{ marginTop: 16 }}>
            {h.bets.map((bet, i) => (
              <motion.div
                key={bet.id}
                variants={depositItem}
                style={{
                  padding: '18px 0',
                  borderBottom: i < h.bets.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1, marginRight: 16 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 16,
                        fontWeight: 400,
                        color: 'var(--stoa-ink)',
                        margin: '0 0 6px',
                        lineHeight: 1.3,
                      }}
                    >
                      {bet.title}
                    </p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                        {bet.owner}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                        Horizon: {bet.horizon}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: convictionColor[bet.conviction],
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      flexShrink: 0,
                      paddingTop: 3,
                    }}
                  >
                    {bet.conviction} conviction
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--stoa-ink-2)',
                    margin: 0,
                    lineHeight: 1.6,
                    borderLeft: '1px solid var(--stoa-rule)',
                    paddingLeft: 12,
                  }}
                >
                  {bet.rationale}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Predictions */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '28px 40px 28px 28px' }}
        >
          <SectionHeader label="Predictions" meta="Weighted" />
          <div style={{ marginTop: 16 }}>
            {h.predictions.map((p, i) => (
              <motion.div
                key={p.id}
                variants={depositItem}
                style={{
                  padding: '12px 0',
                  borderBottom: i < h.predictions.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--stoa-ink)', width: 40, flexShrink: 0 }}>
                    {Math.round(p.probability * 100)}%
                  </span>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.4 }}>
                    {p.label}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 52 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--stoa-rule)' }}>
                    <div
                      style={{
                        height: 1,
                        width: `${Math.round(p.probability * 100)}%`,
                        backgroundColor: 'var(--stoa-ink-3)',
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {p.owner.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Triggers + Watched Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>
        {/* Trigger Conditions */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '28px 32px 28px 40px', borderRight: '1px solid var(--stoa-rule)' }}
        >
          <SectionHeader label="Trigger Conditions" meta={`${h.triggers.length} active`} />
          <div style={{ marginTop: 16 }}>
            {h.triggers.map((t, i) => (
              <motion.div
                key={t.id}
                variants={depositItem}
                style={{
                  padding: '16px 0',
                  borderBottom: i < h.triggers.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {t.id}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                    Watched by {t.watchedBy.split(' ')[0]}
                  </span>
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--stoa-surface-1)',
                    border: '1px solid var(--stoa-rule)',
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                    If
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.4 }}>
                    {t.condition}
                  </p>
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    borderLeft: '2px solid var(--stoa-gold)',
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                    Then
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.4 }}>
                    {t.consequence}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Watched Signals */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '28px 40px 28px 32px' }}
        >
          <SectionHeader label="Watched Signals" meta={`${h.watchedSignals.length} signals`} />
          <div style={{ marginTop: 16 }}>
            {h.watchedSignals.map((s, i) => (
              <motion.div
                key={s.id}
                variants={depositItem}
                style={{
                  padding: '14px 0',
                  borderBottom: i < h.watchedSignals.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                      {s.id}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                      {s.label}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', flexShrink: 0, marginLeft: 8 }}>
                    {s.owner.split(' ')[0]}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--stoa-ink-2)',
                    margin: '0 0 5px',
                    lineHeight: 1.4,
                    borderLeft: '1px solid var(--stoa-gold)',
                    paddingLeft: 10,
                  }}
                >
                  {s.reading}
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {s.source}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {s.lastRead}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
