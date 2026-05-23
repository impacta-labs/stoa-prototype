import { motion } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import {
  organization,
  weeklyStanding,
  inDeliberation,
  ripeningPredictions,
  recentlySettled,
  memoryBand,
} from '../data/fixtures'

export default function Atrium() {
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
          padding: '44px 40px 36px',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 42,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  margin: '0 0 10px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                {organization.name}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  fontWeight: 300,
                  color: 'var(--stoa-ink-2)',
                  margin: 0,
                  letterSpacing: '0.01em',
                }}
              >
                {organization.chapter}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--stoa-ink-3)',
                  margin: '0 0 4px',
                }}
              >
                {organization.period}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--stoa-ink-3)',
                  margin: 0,
                }}
              >
                {organization.location} · Est. {organization.founded}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Standing + In Deliberation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        {/* Weekly Standing */}
        <motion.div
          variants={settle}
          style={{
            padding: '28px 32px 28px 40px',
            borderRight: '1px solid var(--stoa-rule)',
          }}
        >
          <SectionHeader label="Weekly Standing" meta={`Last convened ${weeklyStanding.lastConvened}`} />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Active Decisions', value: weeklyStanding.activeDecisions, unit: '' },
              { label: 'Deliberation Load', value: weeklyStanding.deliberationLoad, unit: '' },
              { label: 'Settled this quarter', value: weeklyStanding.settledThisQuarter, unit: '' },
              { label: 'Memory Entries', value: weeklyStanding.memoryEntries, unit: '' },
              { label: 'Participants', value: weeklyStanding.activeParticipants, unit: '' },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '11px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--stoa-ink-2)',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--stoa-ink)',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--stoa-ink-3)',
                margin: '0 0 2px',
              }}
            >
              Next Council
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--stoa-gold)',
                margin: 0,
              }}
            >
              {weeklyStanding.nextCouncil}
            </p>
          </div>
        </motion.div>

        {/* In Deliberation */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '28px 40px 28px 32px' }}
        >
          <SectionHeader label="In Deliberation" meta={`${inDeliberation.length} active`} />
          <div style={{ marginTop: 16 }}>
            {inDeliberation.map((d, i) => (
              <motion.div key={d.id} variants={depositItem}>
                <div
                  style={{
                    padding: '14px 0',
                    borderBottom: i < inDeliberation.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor:
                        d.status === 'deliberating' ? 'var(--stoa-gold)' : 'var(--stoa-ink-2)',
                      marginTop: 8,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 15,
                          color: 'var(--stoa-ink)',
                          lineHeight: 1.4,
                        }}
                      >
                        {d.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--stoa-ink-3)',
                        }}
                      >
                        {d.id}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 12,
                          color: 'var(--stoa-ink-3)',
                        }}
                      >
                        {d.owner} · Due {d.deadline}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: d.status === 'deliberating' ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {d.status === 'deliberating' ? 'In deliberation' : 'Open'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ripening + Recently Settled */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--stoa-rule)',
          flex: 1,
        }}
      >
        {/* Ripening Predictions */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: '28px 32px 28px 40px',
            borderRight: '1px solid var(--stoa-rule)',
          }}
        >
          <SectionHeader label="Ripening" meta="Decisions approaching threshold" />
          <div style={{ marginTop: 16 }}>
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
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor: r.urgency === 'high' ? 'var(--stoa-amber)' : 'var(--stoa-gold)',
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 14,
                        color: 'var(--stoa-ink)',
                        margin: '0 0 5px',
                        lineHeight: 1.4,
                      }}
                    >
                      {r.signal}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        color: 'var(--stoa-ink-3)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
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
          style={{ padding: '28px 40px 28px 32px' }}
        >
          <SectionHeader label="Recently Settled" meta={`${recentlySettled.length} entries`} />
          <div style={{ marginTop: 16 }}>
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
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor: 'var(--stoa-resolve)',
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 14,
                        color: 'var(--stoa-ink-2)',
                        margin: '0 0 5px',
                        lineHeight: 1.4,
                      }}
                    >
                      {d.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        color: 'var(--stoa-ink-3)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {d.verdict}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--stoa-ink-3)',
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {d.settled}
                  </span>
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
          padding: '0 40px',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          overflow: 'hidden',
          borderBottom: '1px solid var(--stoa-rule)',
          backgroundColor: 'var(--stoa-surface-1)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--stoa-ink-3)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            flexShrink: 0,
          }}
        >
          Memory
        </span>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', overflow: 'hidden' }}>
          {memoryBand.map((entry, i) => (
            <span
              key={entry.id}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                color: i === 0 ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)',
                whiteSpace: 'nowrap' as const,
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginRight: 6 }}>
                {entry.id}
              </span>
              {entry.title}
              <span style={{ marginLeft: 8, color: 'var(--stoa-ink-3)', fontSize: 11 }}>
                {entry.date}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
