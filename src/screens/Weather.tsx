import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore } from '../store/decisions'
import { detectarPatrones } from '../lib/ai'

export default function Weather() {
  const isMobile = useIsMobile()
  const { decisions } = useDecisionsStore()

  const active   = decisions.filter((d) => d.status !== 'resuelta')
  const resolved = decisions.filter((d) => d.status === 'resuelta')
  const totalEntries = decisions.reduce((acc, d) => acc + d.deliberationEntries.length, 0)
  const userPatterns = detectarPatrones(decisions)

  // Threshold logic: climate becomes readable after meaningful deliberation
  const THRESHOLD = 5
  const thresholdItems = [
    { label: 'Decisiones registradas', met: decisions.length >= 2, value: decisions.length, needed: 2 },
    { label: 'Entradas de deliberación', met: totalEntries >= 3, value: totalEntries, needed: 3 },
    { label: 'Decisiones resueltas', met: resolved.length >= 1, value: resolved.length, needed: 1 },
    { label: 'Participantes distintos', met: [...new Set(decisions.map(d => d.owner).filter(Boolean))].length >= 2, value: [...new Set(decisions.map(d => d.owner).filter(Boolean))].length, needed: 2 },
  ]
  const thresholdMet = thresholdItems.filter((t) => t.met).length
  const climateReady = thresholdMet >= THRESHOLD - 1

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
          padding: isMobile ? '16px 20px' : '20px 40px',
          borderBottom: '1px solid var(--stoa-rule)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap' as const,
          gap: 8,
        }}
      >
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Pulso Organizativo
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
            Patrones detectados en el registro de decisiones
          </span>
        </motion.div>
        <motion.div variants={settle}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: climateReady ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>
            {thresholdMet}/{thresholdItems.length} indicadores cumplidos
          </span>
        </motion.div>
      </div>

      {/* Building state */}
      <motion.div variants={settle}>
        <div style={{ padding: isMobile ? '32px 20px 24px' : '48px 40px 32px', borderBottom: '1px solid var(--stoa-rule)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 16px', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
            {climateReady ? 'Datos suficientes para análisis' : 'Acumulando datos'}
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 18 : 22, fontWeight: 400, color: 'var(--stoa-ink-2)', margin: '0 0 20px', lineHeight: 1.45, maxWidth: 560 }}>
            {climateReady
              ? 'Hay suficientes decisiones registradas para detectar patrones en cómo decide la organización.'
              : 'Registra más decisiones para ver patrones de comportamiento estratégico.'
            }
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.65, maxWidth: 520 }}>
            STOA analiza el historial de decisiones para detectar patrones: concentración en ciertos tipos de iniciativas, decisiones sin responsable, hipótesis sin cuantificar. Cuantas más decisiones se registren, más preciso es el diagnóstico.
          </p>
        </div>

        {/* Threshold progress */}
        <div style={{ padding: isMobile ? '24px 20px' : '28px 40px', borderBottom: '1px solid var(--stoa-rule)' }}>
          <SectionHeader label="Indicadores de umbral" meta={`${thresholdMet} de ${thresholdItems.length} cumplidos`} />
          <div style={{ marginTop: 14 }}>
            {thresholdItems.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < thresholdItems.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.met ? 'var(--stoa-resolve)' : 'var(--stoa-rule-strong)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: item.met ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)', flex: 1 }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: item.met ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)' }}>
                  {item.value} / {item.needed}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Patterns — only shown if real patterns detected */}
      {userPatterns.length > 0 && (
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '24px 20px' : '28px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
        >
          <SectionHeader label="Patrones detectados" meta="Derivados del registro real" />
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {userPatterns.map((pattern, i) => (
              <motion.div key={i} variants={depositItem}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-gold)', margin: '0 0 4px' }}>
                  {pattern.label}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 5px', lineHeight: 1.65 }}>
                  {pattern.description}
                </p>
                {pattern.tracedTo.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>Trazado:</span>
                    {pattern.tracedTo.map((ref) => (
                      <Link key={ref} to={`/chamber/${ref}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>{ref}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        variants={settle}
        style={{ padding: isMobile ? '24px 20px' : '28px 40px', backgroundColor: 'var(--stoa-surface-1)', flex: 1 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 20 }}>
          {[
            { label: 'Decisiones activas', value: active.length },
            { label: 'Resueltas', value: resolved.length },
            { label: 'Entradas deliberación', value: totalEntries },
            { label: 'Participantes', value: [...new Set(decisions.map(d => d.owner).filter(Boolean))].length },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                {label}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--stoa-ink)', margin: 0 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
