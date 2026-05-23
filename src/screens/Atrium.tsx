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
} from '../data/fixtures'

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
          padding: isMobile ? '28px 20px 22px' : '36px 40px 28px',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--stoa-ink-3)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Atrium
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                  {organization.period}
                </span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 24 : 30,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  margin: '0 0 6px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                }}
              >
                {organization.name}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'var(--stoa-ink-3)',
                  margin: 0,
                  letterSpacing: '0.01em',
                }}
              >
                {organization.chapter}
              </p>
            </div>
            {!isMobile && (
              <div style={{ textAlign: 'right' as const }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--stoa-ink-3)',
                    margin: '0 0 3px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {organization.location} · Est. {organization.founded}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--stoa-ink-3)',
                    margin: 0,
                    letterSpacing: '0.05em',
                  }}
                >
                  Last convened {weeklyStanding.lastConvened}
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
        {/* Weekly Standing */}
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '20px 20px' : '24px 28px 24px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Standing" meta={`Period ends ${weeklyStanding.nextCouncil}`} />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Active Decisions',      value: weeklyStanding.activeDecisions },
              { label: 'Deliberation Load',     value: weeklyStanding.deliberationLoad },
              { label: 'Settled this Quarter',  value: weeklyStanding.settledThisQuarter },
              { label: 'Memory Entries',        value: weeklyStanding.memoryEntries },
              { label: 'Participants',          value: weeklyStanding.activeParticipants },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '10px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
              Next Council
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-gold)', margin: 0 }}>
              {weeklyStanding.nextCouncil}
            </p>
          </div>
        </motion.div>

        {/* In Deliberation */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '20px 20px' : '24px 40px 24px 28px' }}
        >
          <SectionHeader label="In Deliberation" meta={`${inDeliberation.length} active`} />
          <div style={{ marginTop: 14 }}>
            {inDeliberation.map((d, i) => (
              <motion.div key={d.id} variants={depositItem}>
                <div
                  style={{
                    padding: '13px 0',
                    borderBottom: i < inDeliberation.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: d.status === 'deliberating' ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 14,
                          color: 'var(--stoa-ink)',
                          lineHeight: 1.4,
                        }}
                      >
                        {d.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: d.status === 'deliberating' ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase' as const,
                          flexShrink: 0,
                          paddingTop: 2,
                        }}
                      >
                        {d.status === 'deliberating' ? 'Active' : 'Open'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                        {d.id}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                        {d.owner} · Due {d.deadline}
                      </span>
                    </div>
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
        {/* Ripening */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '20px 20px' : '24px 28px 24px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Ripening" meta="Approaching threshold" />
          <div style={{ marginTop: 14 }}>
            {ripeningPredictions.map((r, i) => (
              <motion.div
                key={r.id}
                variants={depositItem}
                style={{
                  padding: '14px 0',
                  borderBottom: i < ripeningPredictions.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: r.urgency === 'high' ? 'var(--stoa-amber)' : 'var(--stoa-gold)',
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', margin: '0 0 4px', lineHeight: 1.4 }}>
                      {r.signal}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.4 }}>
                      {r.trigger}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recently Settled */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '20px 20px' : '24px 40px 24px 28px' }}
        >
          <SectionHeader label="Recently Settled" meta={`${recentlySettled.length} entries`} />
          <div style={{ marginTop: 14 }}>
            {recentlySettled.map((d, i) => (
              <motion.div
                key={d.id}
                variants={depositItem}
                style={{
                  padding: '14px 0',
                  borderBottom: i < recentlySettled.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: 'var(--stoa-resolve)',
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.4 }}>
                        {d.title}
                      </p>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', flexShrink: 0, paddingTop: 2 }}>
                        {d.settled}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.4 }}>
                      {d.verdict}
                    </p>
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
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--stoa-ink-3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            flexShrink: 0,
          }}
        >
          Memory
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
