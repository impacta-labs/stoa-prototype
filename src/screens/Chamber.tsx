import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore, daysActive } from '../store/decisions'
import { useOrgStore } from '../store/org'

function parseFinancialImpact(text: string): string | null {
  if (!text) return null
  const rp = text.match(/€\s*(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*M/i)
  if (rp) return `€${rp[1]}–${rp[2]}M`
  const rs = text.match(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*M€/i)
  if (rs) return `€${rs[1]}–${rs[2]}M`
  const sp = text.match(/€\s*(\d+(?:[.,]\d+)?)\s*M/i)
  if (sp) return `€${sp[1]}M`
  const ss = text.match(/(\d+(?:[.,]\d+)?)\s*M€/i)
  if (ss) return `€${ss[1]}M`
  return null
}

const statusColor: Record<string, string> = {
  evaluacion:  'var(--stoa-ink-3)',
  deliberando: 'var(--stoa-gold)',
  resuelta:    'var(--stoa-resolve)',
}

const statusLabel: Record<string, string> = {
  evaluacion:  'En evaluación',
  deliberando: 'En deliberación',
  resuelta:    'Resuelta',
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

export default function Chamber() {
  const isMobile = useIsMobile()
  const { decisions, openCreateModal } = useDecisionsStore()
  const { name: orgName, isConfigured } = useOrgStore()

  const WEIGHT_ORDER: Record<string, number> = { 'Crítica': 4, 'Mayor': 3, 'Significativa': 2, 'Menor': 1 }
  const active   = decisions.filter((d) => d.status !== 'resuelta')
    .sort((a, b) => (WEIGHT_ORDER[b.weight] ?? 1) - (WEIGHT_ORDER[a.weight] ?? 1))
  const resolved = decisions.filter((d) => d.status === 'resuelta')

  const today = new Date()
  const period = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ padding: isMobile ? '18px 20px 14px' : '22px 40px 18px', borderBottom: '1px solid var(--stoa-rule-strong)' }}>
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                  Sala de Decisiones
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>
                  {period}
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 18 : 22, fontWeight: 400, color: 'var(--stoa-ink)', margin: '0 0 5px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {isConfigured ? orgName : 'Decisiones'}
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0 }}>
                {decisions.length === 0
                  ? 'Sin decisiones registradas'
                  : `${active.length} activa${active.length !== 1 ? 's' : ''} · ${resolved.length} resuelta${resolved.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <button
              onClick={openCreateModal}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--stoa-bg)',
                backgroundColor: 'var(--stoa-gold)',
                border: 'none',
                padding: '8px 18px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}
            >
              + Nueva iniciativa
            </button>
          </div>
        </motion.div>
      </div>

      {decisions.length === 0 ? (
        <motion.div
          variants={settle}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center' as const }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--stoa-ink-2)', margin: '0 0 8px', lineHeight: 1.4 }}>
            Ninguna decisión en registro
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 400 }}>
            Registra tu primera iniciativa. La IA genera automáticamente la pregunta estratégica, la hipótesis de impacto en euros y los indicadores de éxito.
          </p>
          <button
            onClick={openCreateModal}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: 'var(--stoa-gold)',
              background: 'none',
              border: '1px solid var(--stoa-gold)',
              padding: '8px 20px',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            + Nueva iniciativa
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ flex: 1 }}
        >
          {/* Active decisions */}
          {active.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--stoa-rule)' }}>
              <div style={{ padding: isMobile ? '16px 20px 10px' : '18px 40px 10px' }}>
                <SectionHeader label="Activas" meta={`${active.length} iniciativa${active.length !== 1 ? 's' : ''}`} />
              </div>
              {active.map((d, i) => (
                <motion.div key={d.id} variants={depositItem}>
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        padding: isMobile ? '14px 20px' : '16px 40px',
                        borderTop: i === 0 ? '1px solid var(--stoa-rule)' : undefined,
                        borderBottom: '1px solid var(--stoa-rule)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                      }}
                    >
                      <div style={{ paddingTop: 6, flexShrink: 0 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: statusColor[d.status] || 'var(--stoa-ink-3)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 5 }}>
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.4 }}>
                            {d.preguntaEstrategica}
                          </p>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: statusColor[d.status] || 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 3 }}>
                            {statusLabel[d.status] || d.status}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: '0 0 5px', lineHeight: 1.4 }}>
                          {d.titulo}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '2px 14px', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.03em' }}>{d.id}</span>
                          {(() => {
                            const fi = parseFinancialImpact(d.businessImpact?.plLever || '') || parseFinancialImpact(d.businessImpact?.hypothesis || '')
                            return fi ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-gold)', fontWeight: 500 }}>{fi}</span> : null
                          })()}
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{d.owner || 'Sin responsable'}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>Plazo {d.deadline}</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{tipoLabel[d.tipoInnovacion] || d.tipoInnovacion}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{daysActive(d.opened)}d activa</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Resolved decisions */}
          {resolved.length > 0 && (
            <div>
              <div style={{ padding: isMobile ? '16px 20px 10px' : '18px 40px 10px' }}>
                <SectionHeader label="Resueltas" meta={`${resolved.length} en archivo`} />
              </div>
              {resolved.map((d, i) => (
                <motion.div key={d.id} variants={depositItem}>
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        padding: isMobile ? '14px 20px' : '16px 40px',
                        borderTop: i === 0 ? '1px solid var(--stoa-rule)' : undefined,
                        borderBottom: '1px solid var(--stoa-rule)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                      }}
                    >
                      <div style={{ paddingTop: 6, flexShrink: 0 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 5 }}>
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.4 }}>
                            {d.preguntaEstrategica}
                          </p>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 3 }}>
                            Resuelta
                          </span>
                        </div>
                        {d.selectedVerdict && (
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 5px', lineHeight: 1.4, fontStyle: 'italic' }}>
                            {d.selectedVerdict}
                          </p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '2px 14px', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.03em' }}>{d.id}</span>
                          {(() => {
                            const fi = parseFinancialImpact(d.businessImpact?.plLever || '') || parseFinancialImpact(d.businessImpact?.hypothesis || '')
                            return fi ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-resolve)' }}>{fi}</span> : null
                          })()}
                          {d.owner && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{d.owner}</span>}
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{tipoLabel[d.tipoInnovacion] || d.tipoInnovacion}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
