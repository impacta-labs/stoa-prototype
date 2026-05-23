import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem, compress } from '../lib/motion'
import { Rule } from '../components'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { lisbonDecision } from '../data/fixtures'

type VerdictState = 'open' | 'committing' | 'settled'

function ProbabilityRow({ label, probability }: { label: string; probability: number }) {
  const pct = Math.round(probability * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--stoa-rule)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink)', width: 34, flexShrink: 0 }}>
        {pct}%
      </span>
      <div style={{ flex: 1, position: 'relative', height: 1, backgroundColor: 'var(--stoa-rule)' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 1,
            width: `${pct}%`,
            backgroundColor: pct > 40 ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
          }}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', flex: 2 }}>
        {label}
      </span>
    </div>
  )
}

export default function Chamber() {
  const [verdictState, setVerdictState] = useState<VerdictState>('open')
  const [selectedVerdict, setSelectedVerdict] = useState<string>('')
  const isMobile = useIsMobile()
  const d = lisbonDecision

  function commitVerdict() {
    if (!selectedVerdict) return
    setVerdictState('committing')
    setTimeout(() => setVerdictState('settled'), 700)
  }

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Chamber Header */}
      <div style={{ padding: isMobile ? '24px 20px 20px' : '28px 40px 24px', borderBottom: '1px solid var(--stoa-rule-strong)' }}>
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap' as const, gap: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' as const }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                Chamber
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
                {d.id}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: verdictState === 'settled' ? 'var(--stoa-resolve)' : 'var(--stoa-gold)',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {verdictState === 'settled' ? 'Settled' : 'In Deliberation'}
              </span>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                Opened {d.opened} · Due {d.deadline}
              </span>
            </div>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isMobile ? 20 : 26,
              fontWeight: 400,
              color: 'var(--stoa-ink)',
              margin: '0 0 8px',
              lineHeight: 1.25,
              maxWidth: 760,
              letterSpacing: '-0.01em',
            }}
          >
            {d.title}
          </h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
              Owner: {d.owner}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
              {d.deliberation.length} deliberation entries · Last activity {d.deliberation[d.deliberation.length - 1].timestamp}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Frame + Context + Options */}
      <div
        className="stoa-col-3-chamber"
        style={{ borderBottom: '1px solid var(--stoa-rule)' }}
      >
        {/* Frame */}
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '20px 20px' : '22px 24px 22px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Frame" />
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 13,
              color: 'var(--stoa-ink)',
              margin: '14px 0 0',
              lineHeight: 1.7,
            }}
          >
            {d.frame}
          </p>
        </motion.div>

        {/* Context */}
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '20px 20px' : '22px 24px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Context" />
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {d.context.map((c) => (
              <div key={c.heading}>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    fontWeight: 500,
                    color: 'var(--stoa-ink-3)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                    margin: '0 0 5px',
                  }}
                >
                  {c.heading}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    color: 'var(--stoa-ink-2)',
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Field of Options */}
        <motion.div
          variants={settle}
          style={{ padding: isMobile ? '20px 20px' : '22px 40px 22px 24px' }}
        >
          <SectionHeader label="Field of Options" />
          <div style={{ marginTop: 14 }}>
            {d.options.map((opt, i) => (
              <div
                key={opt.id}
                style={{
                  padding: '11px 0',
                  borderBottom: i < d.options.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', paddingTop: 1 }}>
                    {opt.id}
                  </span>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)', margin: 0 }}>
                    {opt.label}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 0 22px', lineHeight: 1.5 }}>
                  {opt.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stakeholders */}
      <motion.div
        variants={deposit}
        initial="hidden"
        animate="visible"
        style={{ padding: isMobile ? '20px 20px' : '20px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
      >
        <SectionHeader label="Stakeholders" meta={`${d.stakeholders.length} voices registered`} />
        <div style={{ marginTop: 14 }}>
          {d.stakeholders.map((s, i) => (
            <motion.div
              key={s.name}
              variants={depositItem}
              style={{
                display: isMobile ? 'flex' : 'grid',
                gridTemplateColumns: isMobile ? undefined : '160px 80px 130px 1fr',
                flexDirection: isMobile ? 'column' as const : undefined,
                gap: isMobile ? 4 : 20,
                padding: '10px 0',
                borderBottom: i < d.stakeholders.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', fontWeight: 500 }}>
                  {s.name}
                </span>
                {isMobile && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {s.role}
                  </span>
                )}
              </div>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                  {s.role}
                </span>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color:
                    s.position.toLowerCase().includes('favour')
                      ? 'var(--stoa-resolve)'
                      : s.position.toLowerCase().includes('concern')
                      ? 'var(--stoa-amber)'
                      : 'var(--stoa-ink-2)',
                  letterSpacing: '0.03em',
                }}
              >
                {s.position}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', lineHeight: 1.5 }}>
                {s.note}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Deliberation + Dissent */}
      <div
        className="stoa-col-right-340"
        style={{ borderBottom: '1px solid var(--stoa-rule)' }}
      >
        {/* Deliberation */}
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
          <SectionHeader label="Deliberation" meta={`${d.deliberation.length} entries`} />
          <div style={{ marginTop: 14 }}>
            {d.deliberation.map((entry, i) => (
              <motion.div
                key={i}
                variants={depositItem}
                style={{
                  padding: '14px 0',
                  borderBottom: i < d.deliberation.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                      {entry.participant}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                      {entry.role}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                    {entry.timestamp}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 14,
                    color: 'var(--stoa-ink)',
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {entry.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dissent */}
        <motion.div
          variants={settle}
          style={{ padding: isMobile ? '20px 20px' : '22px 40px 22px 24px' }}
        >
          <SectionHeader label="Dissent" />
          <div
            style={{
              marginTop: 14,
              padding: '16px',
              borderLeft: '2px solid var(--stoa-amber)',
              backgroundColor: 'rgba(181, 98, 26, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                  {d.dissent.participant}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', marginLeft: 8 }}>
                  {d.dissent.role}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                {d.dissent.timestamp}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 13,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              {d.dissent.text}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Predictions */}
      <motion.div
        variants={settle}
        style={{ padding: isMobile ? '20px 20px' : '20px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
      >
        <SectionHeader label="Predictions" meta="Weighted probability" />
        <div style={{ marginTop: 14, maxWidth: 640 }}>
          {d.predictions.map((p) => (
            <ProbabilityRow key={p.label} label={p.label} probability={p.probability} />
          ))}
        </div>
      </motion.div>

      {/* Verdict Block */}
      <motion.div
        variants={settle}
        style={{ padding: isMobile ? '20px 20px 32px' : '24px 40px 36px' }}
      >
        <AnimatePresence mode="wait">
          {verdictState === 'settled' ? (
            <motion.div
              key="settled"
              variants={compress}
              initial="hidden"
              animate="visible"
              style={{
                padding: isMobile ? '20px 20px' : '24px 28px',
                borderTop: '2px solid var(--stoa-gold)',
                borderLeft: '1px solid var(--stoa-border)',
                borderRight: '1px solid var(--stoa-border)',
                borderBottom: '1px solid var(--stoa-border)',
                backgroundColor: 'var(--stoa-surface-1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                      Verdict Settled
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                      {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 18,
                      fontWeight: 400,
                      color: 'var(--stoa-ink)',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {selectedVerdict}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--stoa-resolve)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {d.id} · Resolved
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  color: 'var(--stoa-ink-3)',
                  margin: '16px 0 0',
                  lineHeight: 1.6,
                }}
              >
                This decision has entered the Memory Layer. It will be available as context for future deliberations.
              </p>
            </motion.div>
          ) : verdictState === 'committing' ? (
            <motion.div
              key="committing"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.7, ease: 'easeIn' }}
              style={{
                padding: isMobile ? '20px 20px' : '24px 28px',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-border)',
              }}
            >
              <SectionHeader label="Verdict" />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: '14px 0 0', letterSpacing: '0.04em' }}>
                Settling…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{
                padding: isMobile ? '20px 20px' : '24px 28px',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-border)',
              }}
            >
              <SectionHeader label="Verdict" meta="Open — Pending deliberation" />
              <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {d.verdictOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVerdict(opt)}
                    style={{
                      padding: '11px 14px',
                      textAlign: 'left' as const,
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      fontWeight: selectedVerdict === opt ? 500 : 400,
                      color: selectedVerdict === opt ? 'var(--stoa-ink)' : 'var(--stoa-ink-2)',
                      backgroundColor: selectedVerdict === opt ? 'var(--stoa-surface-2)' : 'transparent',
                      border: selectedVerdict === opt
                        ? '1px solid var(--stoa-gold)'
                        : '1px solid var(--stoa-rule)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', marginRight: 8 }}>
                      {selectedVerdict === opt ? '●' : '○'}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <Rule />
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={commitVerdict}
                  disabled={!selectedVerdict}
                  style={{
                    padding: '9px 22px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    color: selectedVerdict ? 'var(--stoa-bg)' : 'var(--stoa-ink-3)',
                    backgroundColor: selectedVerdict ? 'var(--stoa-gold)' : 'var(--stoa-rule)',
                    border: 'none',
                    cursor: selectedVerdict ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Commit Verdict
                </button>
                {!selectedVerdict && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                    Select a verdict to proceed
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
