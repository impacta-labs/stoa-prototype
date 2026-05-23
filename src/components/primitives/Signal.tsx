import { motion } from 'framer-motion'
import { depositItem } from '../../lib/motion'

export type SignalStatus = 'open' | 'deliberating' | 'resolved' | 'blocked'

interface SignalProps {
  label: string
  status: SignalStatus
  context?: string
  timestamp?: string
  index?: number
}

const statusColor: Record<SignalStatus, string> = {
  open: 'var(--stoa-ink-2)',
  deliberating: 'var(--stoa-gold)',
  resolved: 'var(--stoa-resolve)',
  blocked: 'var(--stoa-critical)',
}

const statusLabel: Record<SignalStatus, string> = {
  open: 'OPEN',
  deliberating: 'IN DELIBERATION',
  resolved: 'RESOLVED',
  blocked: 'BLOCKED',
}

export default function Signal({ label, status, context, timestamp }: SignalProps) {
  return (
    <motion.div
      variants={depositItem}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: '14px 0',
      }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: statusColor[status],
          marginTop: 7,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              fontWeight: 400,
              color: status === 'resolved' ? 'var(--stoa-ink-2)' : 'var(--stoa-ink)',
              lineHeight: 1.4,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: statusColor[status],
              letterSpacing: '0.08em',
              flexShrink: 0,
            }}
          >
            {statusLabel[status]}
          </span>
        </div>
        {context && (
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              color: 'var(--stoa-ink-3)',
              margin: '3px 0 0',
              lineHeight: 1.5,
            }}
          >
            {context}
          </p>
        )}
      </div>
      {timestamp && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--stoa-ink-3)',
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          {timestamp}
        </span>
      )}
    </motion.div>
  )
}
