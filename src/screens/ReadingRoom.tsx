import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, depositItem, deposit } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore } from '../store/decisions'
import { useOrgStore } from '../store/org'

export default function ReadingRoom() {
  const isMobile = useIsMobile()
  const { decisions } = useDecisionsStore()
  const { name: orgName, isConfigured } = useOrgStore()

  const userResolved = decisions
    .filter((d) => d.status === 'resuelta')
    .sort((a, b) => new Date(b.settledAt ?? 0).getTime() - new Date(a.settledAt ?? 0).getTime())

  const orgLabel = isConfigured ? orgName : 'la organización'

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
          flexWrap: 'wrap' as const,
          gap: 8,
        }}
      >
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Archivo Estratégico
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
            {orgLabel}
          </span>
        </motion.div>
        <motion.div variants={settle}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
            {userResolved.length} hilo{userResolved.length !== 1 ? 's' : ''} en memoria
          </span>
        </motion.div>
      </div>

      {userResolved.length === 0 ? (
        <motion.div
          variants={settle}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center' as const }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--stoa-ink-2)', margin: '0 0 8px', lineHeight: 1.4 }}>
            El archivo está vacío
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.7, maxWidth: 400 }}>
            Las decisiones resueltas quedan registradas aquí como memoria institucional permanente. Cada resolución genera un hilo de memoria accesible a todas las deliberaciones futuras.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ flex: 1 }}
        >
          <div style={{ padding: isMobile ? '20px 20px 12px' : '24px 40px 12px' }}>
            <SectionHeader label="Hilos de Memoria" meta={`${userResolved.length} decisión${userResolved.length !== 1 ? 'es' : ''} archivada${userResolved.length !== 1 ? 's' : ''}`} />
          </div>

          {userResolved.map((d, i) => (
            <motion.div
              key={d.id}
              variants={depositItem}
              style={{
                padding: isMobile ? '20px 20px' : '24px 40px',
                borderTop: '1px solid var(--stoa-rule)',
                borderBottom: i === userResolved.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
              }}
            >
              {/* Metadata row */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap' as const }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em' }}>{d.id}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>{d.tipoInnovacion}</span>
                {d.settledAt && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                    Resuelta {new Date(d.settledAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Strategic question */}
              <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: isMobile ? 15 : 18,
                    fontWeight: 400,
                    color: 'var(--stoa-ink)',
                    margin: '0 0 12px',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {d.preguntaEstrategica}
                </h3>
              </Link>

              {/* Resolution */}
              {d.selectedVerdict && (
                <div style={{ padding: '10px 14px', borderLeft: '2px solid var(--stoa-resolve)', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                    Resolución
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.55 }}>
                    {d.selectedVerdict}
                  </p>
                </div>
              )}

              {/* Prediction */}
              {d.prediccion && (
                <div style={{ padding: '10px 14px', borderLeft: '2px solid var(--stoa-ink-3)', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                    Predicción
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55 }}>
                    {d.prediccion}
                  </p>
                </div>
              )}

              {/* Hypothesis */}
              {d.businessImpact.hypothesis && (
                <div style={{ padding: '10px 14px', borderLeft: '2px solid var(--stoa-rule-strong)', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                    Hipótesis de impacto
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                    {d.businessImpact.hypothesis}
                  </p>
                </div>
              )}

              {/* Footer metadata */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginTop: 6, alignItems: 'baseline' }}>
                {d.owner && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{d.owner}</span>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                  Revisión: {d.businessImpact.reviewHorizon}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  Evidencia: {d.businessImpact.evidenceStatus}
                </span>
                {d.businessImpact.leadingIndicators.length > 0 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                    {d.businessImpact.leadingIndicators.length} indicador{d.businessImpact.leadingIndicators.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>

              {/* Leading indicators */}
              {d.businessImpact.leadingIndicators.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>
                    Indicadores tempranos
                  </span>
                  {d.businessImpact.leadingIndicators.slice(0, 3).map((ind, j) => (
                    <p key={j} style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 3px', lineHeight: 1.4 }}>
                      · {ind}
                    </p>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <Link
                  to={`/chamber/${d.id}`}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em', textDecoration: 'none' }}
                >
                  Ver sala completa →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
