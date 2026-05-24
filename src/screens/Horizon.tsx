import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore, daysActive } from '../store/decisions'
import { useOrgStore } from '../store/org'

const weightColor: Record<string, string> = {
  Crítica:      'var(--stoa-amber)',
  Mayor:        'var(--stoa-gold)',
  Significativa:'var(--stoa-ink-2)',
  Menor:        'var(--stoa-ink-3)',
}

const tipoLabel: Record<string, string> = {
  'tecnología / IA':       'Tecnología / IA',
  'proceso interno':       'Proceso',
  'eficiencia operativa':  'Eficiencia',
  'expansión':             'Expansión',
  'modelo de negocio':     'Modelo',
  'experiencia de cliente':'Experiencia',
  'partnership':           'Partnership',
  'cultura organizativa':  'Cultura',
}

export default function Horizon() {
  const isMobile = useIsMobile()
  const { decisions } = useDecisionsStore()
  const { name: orgName, isConfigured } = useOrgStore()

  const active = decisions
    .filter((d) => d.status !== 'resuelta')
    .sort((a, b) => {
      const order = { Crítica: 0, Mayor: 1, Significativa: 2, Menor: 3 }
      return (order[a.weight] ?? 4) - (order[b.weight] ?? 4)
    })

  const resolved = decisions
    .filter((d) => d.status === 'resuelta')
    .sort((a, b) => new Date(b.settledAt ?? 0).getTime() - new Date(a.settledAt ?? 0).getTime())

  const withPredictions = resolved.filter((d) => d.prediccion)

  const today = new Date()
  const period = `${today.getFullYear()}–${today.getFullYear() + 2}`

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
            Horizonte
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
            Apuestas activas · compromisos prospectivos · {period}
          </span>
        </motion.div>
        {!isMobile && (
          <motion.span variants={settle} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
            {isConfigured ? orgName : ''} · {active.length} apuesta{active.length !== 1 ? 's' : ''} activa{active.length !== 1 ? 's' : ''}
          </motion.span>
        )}
      </div>

      {decisions.length === 0 ? (
        <motion.div
          variants={settle}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center' as const }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--stoa-ink-2)', margin: '0 0 8px', lineHeight: 1.4 }}>
            Sin perspectiva registrada
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 20px', lineHeight: 1.7, maxWidth: 400 }}>
            Las decisiones activas representan las apuestas estratégicas de la organización. Las predicciones registradas al cerrar cada decisión forman el historial prospectivo.
          </p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
              Ir al Atrio →
            </span>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Active decisions as strategic bets + Predictions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : withPredictions.length > 0 ? '1fr 260px' : '1fr',
              borderBottom: '1px solid var(--stoa-rule)',
            }}
          >
            {/* Strategic bets (active decisions) */}
            <motion.div
              variants={deposit}
              initial="hidden"
              animate="visible"
              style={{
                padding: isMobile ? '20px 20px' : '24px 28px 24px 40px',
                borderRight: isMobile ? 'none' : (withPredictions.length > 0 ? '1px solid var(--stoa-rule)' : 'none'),
                borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
              }}
            >
              <SectionHeader
                label="Apuestas activas"
                meta={`${active.length} en deliberación`}
              />
              <div style={{ marginTop: 14 }}>
                {active.length === 0 ? (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '8px 0', lineHeight: 1.55 }}>
                    Todas las decisiones están resueltas.
                  </p>
                ) : (
                  active.map((d, i) => (
                    <motion.div
                      key={d.id}
                      variants={depositItem}
                      style={{ padding: '16px 0', borderBottom: i < active.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ flex: 1, marginRight: 12 }}>
                          <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 14 : 15, fontWeight: 400, color: 'var(--stoa-ink)', margin: '0 0 5px', lineHeight: 1.3 }}>
                              {d.preguntaEstrategica}
                            </p>
                          </Link>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' as const }}>
                            {d.owner && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{d.owner}</span>}
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                              {d.id} · Plazo {d.deadline}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                              {tipoLabel[d.tipoInnovacion] || d.tipoInnovacion}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                              {daysActive(d.opened)}d activa
                            </span>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: weightColor[d.weight] || 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 3 }}>
                          {d.weight}
                        </span>
                      </div>
                      {d.businessImpact.hypothesis && (
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: '0 0 8px', lineHeight: 1.65, borderLeft: '1px solid var(--stoa-rule)', paddingLeft: 12 }}>
                          {d.businessImpact.hypothesis}
                        </p>
                      )}
                      {d.businessImpact.leadingIndicators.length > 0 && !isMobile && (
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Indicadores tempranos</p>
                          {d.businessImpact.leadingIndicators.slice(0, 2).map((ind, j) => (
                            <p key={j} style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '2px 0 0' }}>· {ind}</p>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Predictions from resolved decisions */}
            {withPredictions.length > 0 && (
              <motion.div
                variants={deposit}
                initial="hidden"
                animate="visible"
                style={{ padding: isMobile ? '20px 20px' : '24px 40px 24px 24px' }}
              >
                <SectionHeader label="Compromisos prospectivos" meta={`${withPredictions.length} pendientes de verificación`} />
                <div style={{ marginTop: 14 }}>
                  {withPredictions.map((d, i) => (
                    <motion.div
                      key={d.id}
                      variants={depositItem}
                      style={{ padding: '14px 0', borderBottom: i < withPredictions.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>{d.id}</span>
                          </Link>
                          {d.businessImpact.reviewHorizon && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.04em' }}>
                              Revisión: {d.businessImpact.reviewHorizon}
                            </span>
                          )}
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                          pendiente
                        </span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: '0 0 8px', lineHeight: 1.45, borderLeft: '2px solid var(--stoa-gold)', paddingLeft: 10 }}>
                        {d.prediccion}
                      </p>
                      {d.businessImpact.leadingIndicators.length > 0 && (
                        <div style={{ paddingLeft: 12 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Confirma: </span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                            {d.businessImpact.leadingIndicators[0]}
                          </span>
                        </div>
                      )}
                      {d.businessImpact.plLever && (
                        <div style={{ paddingLeft: 12, marginTop: 3 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>P&L: </span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{d.businessImpact.plLever}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Resolution conditions as trigger conditions */}
          {active.some((d) => d.resolutionConditions.some((c) => !c.satisfied)) && (
            <motion.div
              variants={deposit}
              initial="hidden"
              animate="visible"
              style={{ padding: isMobile ? '20px 20px' : '24px 40px', borderBottom: '1px solid var(--stoa-rule)', flex: 1 }}
            >
              <SectionHeader
                label="Condiciones pendientes"
                meta="Lo que hay que resolver para cerrar las decisiones activas"
              />
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                {active.flatMap((d) =>
                  d.resolutionConditions.filter((c) => !c.satisfied).map((c) => (
                    <motion.div key={`${d.id}-${c.id}`} variants={depositItem}>
                      <div style={{ padding: '12px 14px', border: '1px solid var(--stoa-rule)', borderLeft: '2px solid var(--stoa-amber)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.06em' }}>{d.id}</span>
                          {c.owner && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{c.owner}</span>}
                        </div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink)', margin: '0 0 4px', lineHeight: 1.4 }}>
                          {c.label}
                        </p>
                        {c.due && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>Plazo: {c.due}</span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}
