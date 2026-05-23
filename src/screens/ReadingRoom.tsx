import { motion } from 'framer-motion'
import { chamberEnter, settle, depositItem, deposit } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { memoryThread } from '../data/fixtures'

export default function ReadingRoom() {
  const t = memoryThread

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Room Header */}
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
            Reading Room
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
            Alpha Espai Archive
          </span>
        </motion.div>
        <motion.span
          variants={settle}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}
        >
          {t.id}
        </motion.span>
      </div>

      {/* Document */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', flex: 1 }}>
        {/* Main text */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: '52px 56px 64px 40px',
            borderRight: '1px solid var(--stoa-rule)',
          }}
        >
          {/* Title */}
          <motion.div variants={depositItem} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  color: 'var(--stoa-resolve)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Memory Thread
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                Settled {t.settled}
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 32,
                fontWeight: 400,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                maxWidth: 580,
              }}
            >
              {t.title}
            </h1>
          </motion.div>

          {/* Byline rule */}
          <motion.div variants={depositItem}>
            <div
              style={{
                display: 'flex',
                gap: 20,
                padding: '14px 0',
                borderTop: '1px solid var(--stoa-border-strong)',
                borderBottom: '1px solid var(--stoa-rule)',
                marginBottom: 40,
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)' }}>
                {t.author}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-3)' }}>
                {t.role}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)', marginLeft: 'auto' }}>
                {t.settled}
              </span>
            </div>
          </motion.div>

          {/* Body */}
          <div style={{ maxWidth: 640 }}>
            {t.body.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={depositItem}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 16,
                  fontWeight: 400,
                  color: i === 1 ? 'var(--stoa-ink)' : 'var(--stoa-ink)',
                  lineHeight: 1.75,
                  margin: '0 0 24px',
                  fontStyle: i === 1 ? 'italic' : 'normal',
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Dissent */}
          <motion.div
            variants={depositItem}
            style={{
              marginTop: 16,
              padding: '20px 20px 20px 20px',
              borderLeft: '2px solid var(--stoa-amber)',
              borderTop: '1px solid var(--stoa-rule)',
              paddingTop: 20,
              backgroundColor: 'rgba(181, 98, 26, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-amber)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Dissent Recorded
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                {t.dissent.participant}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', marginLeft: 8 }}>
                {t.dissent.role} · {t.dissent.timestamp}
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
              {t.dissent.text}
            </p>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: '52px 40px 40px 28px' }}
        >
          <motion.div variants={depositItem} style={{ marginBottom: 32 }}>
            <SectionHeader label="Thread metadata" />
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Reference', value: t.id },
                { label: 'Settled', value: t.settled },
                { label: 'Author', value: t.author },
                { label: 'Decision', value: t.relatedDecision },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  style={{
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: 2,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink-2)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={depositItem} style={{ marginBottom: 32 }}>
            <SectionHeader label="Tags" />
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--stoa-ink-3)',
                    padding: '3px 8px',
                    border: '1px solid var(--stoa-rule)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={depositItem}>
            <SectionHeader label="Context" />
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--stoa-ink-3)',
                margin: '14px 0 0',
                lineHeight: 1.6,
              }}
            >
              This thread is the settled record of Decision {t.relatedDecision}. It was written to preserve the reasoning, not the outcome. Future deliberations may read this thread for precedent.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
