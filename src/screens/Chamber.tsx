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
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '8px 0', borderBottom: '1px solid var(--stoa-rule)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink)', width: 32, flexShrink: 0 }}>
        {pct}%
      </span>
      <div style={{ flex: 1, position: 'relative', height: 1, backgroundColor: 'var(--stoa-rule)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: 1, width: `${pct}%`, backgroundColor: pct > 40 ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)', flex: 2 }}>
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

  const respondedCount = d.stakeholders.filter(s => s.responded).length
  const lastContributor = d.stakeholders.reduce((a, b) =>
    new Date(a.lastContribution || 0) > new Date(b.lastContribution || 0) ? a : b
  )
  const conditionsMet = d.resolutionConditions.filter(c => c.satisfied).length

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
      <div style={{ padding: isMobile ? '18px 20px 14px' : '22px 40px 18px', borderBottom: '1px solid var(--stoa-rule-strong)' }}>
        <motion.div variants={settle}>
          {/* Status line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap' as const, gap: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' as const }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                Chamber
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
                {d.id}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: verdictState === 'settled' ? 'var(--stoa-resolve)' : 'var(--stoa-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                {verdictState === 'settled' ? 'Settled' : 'In Deliberation'}
              </span>
              {verdictState !== 'settled' && (
                <>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: conditionsMet === d.resolutionConditions.length ? 'var(--stoa-resolve)' : 'var(--stoa-amber)', letterSpacing: '0.06em' }}>
                    {conditionsMet}/{d.resolutionConditions.length} conditions met
                  </span>
                </>
              )}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.03em' }}>
              Opened {d.opened} · Due {d.deadline}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isMobile ? 17 : 22,
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

          {/* Decision lifecycle */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              {[
                { label: 'Opened', done: true },
                { label: verdictState === 'settled' ? 'Deliberated' : 'Deliberating', active: verdictState !== 'settled', done: verdictState === 'settled' },
                { label: verdictState === 'settled' ? 'Settled' : 'Verdict pending', active: verdictState === 'settled', done: verdictState === 'settled' },
                { label: 'Memory', done: verdictState === 'settled' },
              ].map((stage, i) => (
                <span key={stage.label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                    color: stage.active ? 'var(--stoa-gold)' : stage.done ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                  }}>
                    {stage.label}
                  </span>
                  {i < 3 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>→</span>}
                </span>
              ))}
            </div>
          )}

          {/* Operational metadata */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '3px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
              {d.daysActive}d active
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
              {d.deliberationEntries} entries
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
              Last: {d.lastActivity}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
              Owner: {d.owner}
            </span>
            {d.relatedMemory && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                See: {d.relatedMemory} · Precedes: {d.precedent}
              </span>
            )}
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
            padding: isMobile ? '18px 20px' : '18px 20px 18px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Frame" />
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isMobile ? 13 : 13,
              color: 'var(--stoa-ink)',
              margin: '10px 0 0',
              lineHeight: 1.75,
              whiteSpace: 'pre-line' as const,
            }}
          >
            {d.frame}
          </p>
        </motion.div>

        {/* Context */}
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '18px 20px' : '18px 20px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Context" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {d.context.map((c) => (
              <div key={c.heading}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 500, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, margin: '0 0 3px' }}>
                  {c.heading}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Field of Options */}
        <motion.div variants={settle} style={{ padding: isMobile ? '18px 20px' : '18px 40px 18px 20px' }}>
          <SectionHeader label="Field of Options" />
          <div style={{ marginTop: 10 }}>
            {d.options.map((opt, i) => (
              <div
                key={opt.id}
                style={{
                  padding: '10px 0',
                  borderBottom: i < d.options.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', gap: 7, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', paddingTop: 1, letterSpacing: '0.04em', flexShrink: 0 }}>
                    {opt.id}
                  </span>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)', margin: 0 }}>
                    {opt.label}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 5px 0', lineHeight: 1.45 }}>
                  {opt.description}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.4, borderLeft: '1px solid var(--stoa-rule)', paddingLeft: 8, fontStyle: 'italic' }}>
                  {opt.consequence}
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
        style={{ padding: isMobile ? '16px 20px' : '16px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
      >
        {/* Stakeholder status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 9, borderBottom: '1px solid var(--stoa-rule)', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 500, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
              Stakeholders
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
              {respondedCount} of {d.stakeholders.length} voices
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-resolve)', letterSpacing: '0.04em' }}>
            All positions submitted · Last: {lastContributor.name.split(' ')[1]} {lastContributor.lastContribution}
          </span>
        </div>
        <div>
          {d.stakeholders.map((s, i) => (
            <motion.div
              key={s.name}
              variants={depositItem}
              style={{
                display: isMobile ? 'flex' : 'grid',
                gridTemplateColumns: isMobile ? undefined : '156px 84px 120px 1fr 96px',
                flexDirection: isMobile ? 'column' as const : undefined,
                gap: isMobile ? 2 : 14,
                padding: '8px 0',
                borderBottom: i < d.stakeholders.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                alignItems: isMobile ? undefined : 'baseline',
              }}
            >
              <div style={{ display: 'flex', gap: 7, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink)', fontWeight: 500 }}>
                  {s.name}
                </span>
                {isMobile && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                    {s.role}
                  </span>
                )}
              </div>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                  {s.role}
                </span>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color:
                    s.position.toLowerCase().includes('favour') || s.position.toLowerCase().includes('strongly')
                      ? 'var(--stoa-resolve)'
                      : s.position.toLowerCase().includes('concern')
                      ? 'var(--stoa-amber)'
                      : 'var(--stoa-ink-2)',
                  letterSpacing: '0.02em',
                }}
              >
                {s.position}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)', lineHeight: 1.45 }}>
                {s.note}
              </span>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', textAlign: 'right' as const }}>
                  {s.lastContribution}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Deliberation + Dissent + Predictions */}
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
            padding: isMobile ? '16px 20px' : '16px 20px 16px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Deliberation" meta={`${d.deliberation.length} entries · ${d.daysActive} days`} />
          <div style={{ marginTop: 10 }}>
            {d.deliberation.map((entry, i) => (
              <motion.div
                key={i}
                variants={depositItem}
                style={{
                  padding: '11px 0',
                  borderBottom: i < d.deliberation.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 8 }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                      {entry.participant}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                      {entry.role}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', flexShrink: 0 }}>
                    {entry.timestamp}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.68 }}>
                  {entry.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dissent + Predictions */}
        <motion.div variants={settle} style={{ padding: isMobile ? '16px 20px' : '16px 40px 16px 20px' }}>
          <SectionHeader label="Dissent" />
          <div
            style={{
              marginTop: 10,
              padding: '13px 14px 13px 14px',
              borderLeft: '2px solid var(--stoa-amber)',
              backgroundColor: 'rgba(181, 98, 26, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                  {d.dissent.participant}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', marginLeft: 7 }}>
                  {d.dissent.role}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                {d.dissent.timestamp}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.68, fontStyle: 'italic' }}>
              {d.dissent.text}
            </p>
          </div>

          {/* Resolution conditions */}
          <div style={{ marginTop: 20 }}>
            <SectionHeader label="Resolution Conditions" meta={`${conditionsMet} of ${d.resolutionConditions.length} met`} />
            <div style={{ marginTop: 8 }}>
              {d.resolutionConditions.map((rc) => (
                <div
                  key={rc.id}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    padding: '7px 0',
                    borderBottom: '1px solid var(--stoa-rule)',
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: rc.satisfied ? 'var(--stoa-resolve)' : 'var(--stoa-amber)',
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: rc.satisfied ? 'var(--stoa-ink-2)' : 'var(--stoa-ink)', margin: '0 0 2px', lineHeight: 1.4 }}>
                      {rc.label}
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                        {rc.owner}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: rc.satisfied ? 'var(--stoa-resolve)' : 'var(--stoa-amber)', letterSpacing: '0.03em' }}>
                        {rc.satisfied ? 'Met' : `Due ${rc.due}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions */}
          <div style={{ marginTop: 20 }}>
            <SectionHeader label="Predictions" meta="Weighted probability" />
            <div style={{ marginTop: 8 }}>
              {d.predictions.map((p) => (
                <ProbabilityRow key={p.label} label={p.label} probability={p.probability} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verdict Block */}
      <motion.div variants={settle} style={{ padding: isMobile ? '18px 20px 24px' : '20px 40px 28px' }}>
        <AnimatePresence mode="wait">
          {verdictState === 'settled' ? (
            <motion.div
              key="settled"
              variants={compress}
              initial="hidden"
              animate="visible"
              style={{
                padding: isMobile ? '16px 18px' : '20px 24px',
                borderTop: '2px solid var(--stoa-gold)',
                borderLeft: '1px solid var(--stoa-border)',
                borderRight: '1px solid var(--stoa-border)',
                borderBottom: '1px solid var(--stoa-border)',
                backgroundColor: 'var(--stoa-surface-1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 7 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                      Verdict Settled
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                      {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 15 : 17, fontWeight: 400, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.3 }}>
                    {selectedVerdict}
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                  {d.id} · Resolved
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '12px 0 0', lineHeight: 1.55 }}>
                This decision has entered the Memory Layer. It will be available as precedent for future deliberations.
                A memory thread reference will be assigned by the system.
              </p>
            </motion.div>
          ) : verdictState === 'committing' ? (
            <motion.div
              key="committing"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.7, ease: 'easeIn' }}
              style={{ padding: isMobile ? '16px 18px' : '20px 24px', backgroundColor: 'var(--stoa-surface-1)', border: '1px solid var(--stoa-border)' }}
            >
              <SectionHeader label="Verdict" />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)', margin: '10px 0 0', letterSpacing: '0.05em' }}>
                Settling…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{ padding: isMobile ? '16px 18px' : '20px 24px', backgroundColor: 'var(--stoa-surface-1)', border: '1px solid var(--stoa-border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <SectionHeader label="Verdict" meta="Open — Pending deliberation" />
                {conditionsMet < d.resolutionConditions.length && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.06em' }}>
                    {d.resolutionConditions.length - conditionsMet} precondition{d.resolutionConditions.length - conditionsMet > 1 ? 's' : ''} unmet
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 6, marginBottom: 16 }}>
                {d.verdictOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVerdict(opt)}
                    style={{
                      padding: '9px 13px',
                      textAlign: 'left' as const,
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      fontWeight: selectedVerdict === opt ? 500 : 400,
                      color: selectedVerdict === opt ? 'var(--stoa-ink)' : 'var(--stoa-ink-2)',
                      backgroundColor: selectedVerdict === opt ? 'var(--stoa-surface-2)' : 'transparent',
                      border: selectedVerdict === opt ? '1px solid var(--stoa-gold)' : '1px solid var(--stoa-rule)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', marginRight: 7 }}>
                      {selectedVerdict === opt ? '●' : '○'}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <Rule />
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={commitVerdict}
                  disabled={!selectedVerdict}
                  style={{
                    padding: '7px 18px',
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
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
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
