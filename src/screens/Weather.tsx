import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { weatherData } from '../data/fixtures'

export default function Weather() {
  const [unlocked, setUnlocked] = useState(weatherData.unlocked)
  const w = weatherData

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
            Weather
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
            Organizational climate reading
          </span>
        </motion.div>
        <motion.div variants={settle} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          {unlocked && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
              Generated {w.generatedAt}
            </span>
          )}
          <button
            onClick={() => setUnlocked(!unlocked)}
            style={{
              background: 'none',
              border: '1px solid var(--stoa-rule)',
              padding: '4px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--stoa-ink-3)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
            }}
          >
            {unlocked ? 'Lock' : 'Unlock (demo)'}
          </button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          /* Locked State */
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 40px',
            }}
          >
            <div style={{ maxWidth: 480, textAlign: 'center' as const }}>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  fontWeight: 400,
                  color: 'var(--stoa-ink-2)',
                  margin: '0 0 32px',
                  lineHeight: 1.4,
                }}
              >
                Weather emerges after sufficient deliberation has accumulated.
              </p>
              <div
                style={{
                  borderTop: '1px solid var(--stoa-rule)',
                  borderBottom: '1px solid var(--stoa-rule)',
                  padding: '24px 0',
                  margin: '0 0 32px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--stoa-ink-3)',
                    margin: '0 0 20px',
                    lineHeight: 1.6,
                  }}
                >
                  The Weather reading requires a minimum threshold of deliberation mass — enough decisions in motion, enough voices recorded, enough time elapsed. Until that threshold is met, the reading would be noise rather than signal.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink-2)' }}>
                    {w.thresholdMet} of {w.thresholdRequired}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-3)' }}>
                    threshold indicators met
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--stoa-ink-3)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  margin: 0,
                }}
              >
                {w.thresholdMet >= w.thresholdRequired ? 'Threshold met — reading available' : 'Accumulating deliberation'}
              </p>
            </div>
          </motion.div>
        ) : (
          /* Unlocked State */
          <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {/* Pressure Systems + Winds */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: '1px solid var(--stoa-rule)',
              }}
            >
              {/* Pressure Systems */}
              <motion.div
                variants={deposit}
                initial="hidden"
                animate="visible"
                style={{ padding: '28px 32px 28px 40px', borderRight: '1px solid var(--stoa-rule)' }}
              >
                <SectionHeader label="Pressure Systems" />
                <div style={{ marginTop: 16 }}>
                  {w.pressureSystems.map((ps, i) => (
                    <motion.div
                      key={i}
                      variants={depositItem}
                      style={{
                        padding: '16px 0',
                        borderBottom: i < w.pressureSystems.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                          {ps.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            color: ps.intensity === 'High' ? 'var(--stoa-amber)' : 'var(--stoa-resolve)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                          }}
                        >
                          {ps.intensity}
                        </span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                        {ps.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Prevailing Winds + Calm */}
              <motion.div
                variants={deposit}
                initial="hidden"
                animate="visible"
                style={{ padding: '28px 40px 28px 32px' }}
              >
                <SectionHeader label="Prevailing Winds" />
                <motion.div variants={depositItem} style={{ marginTop: 16, marginBottom: 28 }}>
                  <div
                    style={{
                      padding: '14px 16px',
                      borderLeft: '2px solid var(--stoa-gold)',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)', margin: '0 0 6px' }}>
                      Direction: {w.prevailingWinds.direction}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                      {w.prevailingWinds.description}
                    </p>
                  </div>
                </motion.div>

                <SectionHeader label="Calm" />
                <div style={{ marginTop: 16 }}>
                  {w.calm.map((c, i) => (
                    <motion.div
                      key={i}
                      variants={depositItem}
                      style={{
                        padding: '12px 0',
                        borderBottom: i < w.calm.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)', margin: '0 0 4px' }}>
                        {c.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                        {c.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Storm Fronts */}
            <motion.div
              variants={deposit}
              initial="hidden"
              animate="visible"
              style={{ padding: '28px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
            >
              <SectionHeader label="Storm Fronts" meta="Active conditions" />
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {w.stormFronts.map((sf, i) => (
                  <motion.div
                    key={i}
                    variants={depositItem}
                    style={{
                      padding: '16px',
                      borderLeft: `2px solid ${sf.severity === 'significant' ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)'}`,
                      backgroundColor: sf.severity === 'significant' ? 'rgba(181, 98, 26, 0.03)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                        {sf.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: sf.severity === 'significant' ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase' as const,
                        }}
                      >
                        {sf.severity}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                      {sf.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Backtest */}
            <motion.div
              variants={settle}
              style={{ padding: '24px 40px', backgroundColor: 'var(--stoa-surface-1)' }}
            >
              <SectionHeader label="Backtest Reading" meta={`Period: ${w.backtestReading.period}`} />
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: 'var(--stoa-ink-2)',
                  margin: '16px 0 0',
                  lineHeight: 1.7,
                  maxWidth: 720,
                }}
              >
                {w.backtestReading.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
