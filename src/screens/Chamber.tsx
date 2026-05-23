import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem, compress } from '../lib/motion'
import { Rule } from '../components'
import SectionHeader from '../components/primitives/SectionHeader'
import { lisbonDecision } from '../data/fixtures'

type VerdictState = 'open' | 'committing' | 'settled'

function ProbabilityRow({ label, probability }: { label: string; probability: number }) {
  const pct = Math.round(probability * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--stoa-rule)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink)', width: 36, flexShrink: 0 }}>
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
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', flex: 2 }}>
        {label}
      </span>
    </div>
  )
}

export default function Chamber() {
  const [verdictState, setVerdictState] = useState<VerdictState>('open')
  const [selectedVerdict, setSelectedVerdict] = useState<string>('')
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
      <div style={{ padding: '36px 40px 28px', borderBottom: '1px solid var(--stoa-border-strong)' }}>
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                Chamber
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-gold)' }}>
                {d.id}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: verdictState === 'settled' ? 'var(--stoa-resolve)' : 'var(--stoa-gold)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {verdictState === 'settled' ? 'SETTLED' : 'IN DELIBERATION'}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                Opened {d.opened} · Due {d.deadline}
              </span>
            </div>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 28,
              fontWeight: 400,
              color: 'var(--stoa-ink)',
              margin: 0,
              lineHeight: 1.25,
              maxWidth: 820,
              letterSpacing: '-0.01em',
            }}
          >
            {d.title}
          </h1>
        </motion.div>
      </div>

      {/* Frame + Context + Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 280px',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        {/* Frame */}
        <motion.div
          variants={settle}
          style={{ padding: '24px 28px 24px 40px', borderRight: '1px solid var(--stoa-rule)' }}
        >
          <SectionHeader label="Frame" />
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              color: 'var(--stoa-ink)',
              margin: '16px 0 0',
              lineHeight: 1.65,
            }}
          >
            {d.frame}
          </p>
        </motion.div>

        {/* Context */}
        <motion.div
          variants={settle}
          style={{ padding: '24px 28px', borderRight: '1px solid var(--stoa-rule)' }}
        >
          <SectionHeader label="Context" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {d.context.map((c) => (
              <div key={c.heading}>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--stoa-ink-3)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                    margin: '0 0 6px',
                  }}
                >
                  {c.heading}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--stoa-ink-2)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Field of Options */}
        <motion.div variants={settle} style={{ padding: '24px 40px 24px 28px' }}>
          <SectionHeader label="Field of Options" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {d.options.map((opt, i) => (
              <div
                key={opt.id}
                style={{
                  padding: '12px 0',
                  borderBottom: i < d.options.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--stoa-ink)',
                    margin: '0 0 4px',
                  }}
                >
                  {opt.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    color: 'var(--stoa-ink-3)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
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
        style={{ padding: '24px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
      >
        <SectionHeader label="Stakeholders" meta={`${d.stakeholders.length} voices`} />
        <div style={{ marginTop: 16 }}>
          {d.stakeholders.map((s, i) => (
            <motion.div
              key={s.name}
              variants={depositItem}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 80px 120px 1fr',
                gap: 24,
                padding: '11px 0',
                borderBottom: i < d.stakeholders.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', fontWeight: 500 }}>
                {s.name}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                {s.role}
              </span>
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
                  letterSpacing: '0.04em',
                }}
              >
                {s.position}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', lineHeight: 1.5 }}>
                {s.note}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Deliberation + Dissent */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          borderBottom: '1px solid var(--stoa-rule)',
        }}
      >
        {/* Deliberation */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '24px 28px 24px 40px', borderRight: '1px solid var(--stoa-rule)' }}
        >
          <SectionHeader label="Deliberation" meta={`${d.deliberation.length} entries`} />
          <div style={{ marginTop: 16 }}>
            {d.deliberation.map((entry, i) => (
              <motion.div
                key={i}
                variants={depositItem}
                style={{
                  padding: '14px 0',
                  borderBottom: i < d.deliberation.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                      {entry.participant}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                      {entry.role}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {entry.timestamp}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 14,
                    color: 'var(--stoa-ink)',
                    margin: 0,
                    lineHeight: 1.6,
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
          style={{ padding: '24px 40px 24px 28px' }}
        >
          <SectionHeader label="Dissent" />
          <div
            style={{
              marginTop: 16,
              padding: '16px',
              borderLeft: '2px solid var(--stoa-amber)',
              backgroundColor: 'rgba(181, 98, 26, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                  {d.dissent.participant}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', marginLeft: 8 }}>
                  {d.dissent.role}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                {d.dissent.timestamp}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.65,
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
        style={{ padding: '24px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
      >
        <SectionHeader label="Predictions" meta="Weighted probability" />
        <div style={{ marginTop: 16, maxWidth: 680 }}>
          {d.predictions.map((p) => (
            <ProbabilityRow key={p.label} label={p.label} probability={p.probability} />
          ))}
        </div>
      </motion.div>

      {/* Verdict Block */}
      <motion.div
        variants={settle}
        style={{ padding: '28px 40px 40px' }}
      >
        <AnimatePresence mode="wait">
          {verdictState === 'settled' ? (
            <motion.div
              key="settled"
              variants={compress}
              initial="hidden"
              animate="visible"
              style={{
                padding: '24px 28px',
                borderTop: '2px solid var(--stoa-gold)',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-border)',
                borderTopColor: 'var(--stoa-gold)',
                borderTopWidth: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-resolve)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                      Verdict Settled
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                      {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 20,
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
                    fontSize: 11,
                    color: 'var(--stoa-resolve)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {d.id} · Resolved
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  color: 'var(--stoa-ink-3)',
                  margin: '16px 0 0',
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
                padding: '24px 28px',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-border)',
              }}
            >
              <SectionHeader label="Verdict" />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '16px 0 0' }}>
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
                padding: '24px 28px',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-border)',
              }}
            >
              <SectionHeader label="Verdict" meta="Open — Pending deliberation" />
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {d.verdictOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVerdict(opt)}
                    style={{
                      padding: '12px 16px',
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
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', marginRight: 8, letterSpacing: '0.04em' }}>
                      {selectedVerdict === opt ? '●' : '○'}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <Rule />
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  onClick={commitVerdict}
                  disabled={!selectedVerdict}
                  style={{
                    padding: '10px 24px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: selectedVerdict ? 'var(--stoa-bg)' : 'var(--stoa-ink-3)',
                    backgroundColor: selectedVerdict ? 'var(--stoa-gold)' : 'var(--stoa-rule)',
                    border: 'none',
                    cursor: selectedVerdict ? 'pointer' : 'not-allowed',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Commit Verdict
                </button>
                {!selectedVerdict && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                    Select an option to proceed
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
