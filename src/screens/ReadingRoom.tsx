import { motion } from 'framer-motion'
import { chamberEnter, settle, depositItem, deposit } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { memoryThread } from '../data/fixtures'

export default function ReadingRoom() {
  const isMobile = useIsMobile()
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
          padding: isMobile ? '16px 20px' : '20px 40px',
          borderBottom: '1px solid var(--stoa-rule)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Reading Room
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
            Alpha Espai Archive
          </span>
        </motion.div>
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-resolve)', letterSpacing: '0.06em' }}>
            {t.id}
          </span>
          {!isMobile && (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                Settled {t.settled}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* Document */}
      <div
        className="stoa-col-right-240"
        style={{ flex: 1 }}
      >
        {/* Main text */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '28px 20px 40px' : '44px 48px 56px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
          }}
        >
          {/* Title block */}
          <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--stoa-resolve)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Memory Thread
              </span>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                  Settled {t.settled}
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? 22 : 28,
                fontWeight: 400,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                maxWidth: 520,
              }}
            >
              {t.title}
            </h1>
          </motion.div>

          {/* Byline */}
          <motion.div variants={depositItem}>
            <div
              style={{
                display: 'flex',
                gap: 16,
                padding: '12px 0',
                borderTop: '1px solid var(--stoa-rule-strong)',
                borderBottom: '1px solid var(--stoa-rule)',
                marginBottom: 36,
                flexWrap: 'wrap' as const,
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)' }}>
                {t.author}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                {t.role}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', marginLeft: 'auto' }}>
                {t.settled}
              </span>
            </div>
          </motion.div>

          {/* Body */}
          <div style={{ maxWidth: 580 }}>
            {t.body.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={depositItem}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 14 : 15,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  lineHeight: 1.8,
                  margin: '0 0 22px',
                  fontStyle: i === 1 ? 'italic' : 'normal',
                  opacity: i === 1 ? 0.9 : 1,
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Dissent block */}
          <motion.div
            variants={depositItem}
            style={{
              marginTop: 8,
              padding: '18px 18px 18px 16px',
              borderLeft: '2px solid var(--stoa-amber)',
              backgroundColor: 'rgba(181, 98, 26, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap' as const, gap: 4 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                  Dissent Recorded
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                {t.dissent.timestamp}
              </span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                {t.dissent.participant}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', marginLeft: 8 }}>
                {t.dissent.role}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              {t.dissent.text}
            </p>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            variants={deposit}
            initial="hidden"
            animate="visible"
            style={{
              padding: '44px 36px 40px 28px',
              backgroundColor: 'var(--stoa-surface-1)',
            }}
          >
            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Thread Metadata" />
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Reference',  value: t.id },
                  { label: 'Settled',    value: t.settled },
                  { label: 'Author',     value: t.author },
                  { label: 'Decision',   value: t.relatedDecision },
                  { label: 'Views',      value: `${t.views} since settlement` },
                  { label: 'Accessed',   value: '23 May 2026 · 09:42' },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    style={{
                      padding: '9px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: 2,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Tags" />
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--stoa-ink-3)',
                      padding: '3px 7px',
                      border: '1px solid var(--stoa-rule)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Cited In" />
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {t.citedIn.map((ref) => (
                  <span
                    key={ref}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--stoa-gold)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ref}
                  </span>
                ))}
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', marginTop: 2 }}>
                  Active deliberation references this thread as precedent.
                </span>
              </div>
            </motion.div>

            <motion.div variants={depositItem}>
              <SectionHeader label="Related Threads" />
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {t.relatedThreads.map((ref) => (
                  <span
                    key={ref}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--stoa-ink-3)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
