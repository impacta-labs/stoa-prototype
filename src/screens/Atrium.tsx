import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore } from '../store/decisions'
import { useOrgStore } from '../store/org'
import { generarDiagnosticoPortfolioIA } from '../lib/ai'
import { IFF_ORG, IFF_DECISIONS } from '../data/iffDemo'
import type { UserDecision } from '../types'

const statusColor: Record<string, string> = {
  evaluacion:  '#4A4744',
  deliberando: '#C4952A',
  resuelta:    '#4A7A5A',
}
const statusLabel: Record<string, string> = {
  evaluacion:  'En evaluación',
  deliberando: 'Deliberando',
  resuelta:    'Resuelta',
}
const weightColor: Record<string, string> = {
  Crítica:      'var(--stoa-amber)',
  Mayor:        'var(--stoa-gold)',
  Significativa:'var(--stoa-ink-2)',
  Menor:        'var(--stoa-ink-3)',
}

// Extract the first monetary value (€ + millions) from free text
function parseFinancialImpact(text: string): { display: string; minValue: number } | null {
  if (!text) return null
  // Range, € prefix: €35–55M, €2.4–3.2M
  const rp = text.match(/€\s*(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*M/i)
  if (rp) return { display: `€${rp[1]}–${rp[2]}M`, minValue: parseFloat(rp[1].replace(',', '.')) }
  // Range, € suffix: 35–55M€
  const rs = text.match(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*M€/i)
  if (rs) return { display: `€${rs[1]}–${rs[2]}M`, minValue: parseFloat(rs[1].replace(',', '.')) }
  // Single, € prefix: €180M, €2.4M
  const sp = text.match(/€\s*(\d+(?:[.,]\d+)?)\s*M/i)
  if (sp) return { display: `€${sp[1]}M`, minValue: parseFloat(sp[1].replace(',', '.')) }
  // Single, € suffix: 2.4M€, 8M€
  const ss = text.match(/(\d+(?:[.,]\d+)?)\s*M€/i)
  if (ss) return { display: `€${ss[1]}M`, minValue: parseFloat(ss[1].replace(',', '.')) }
  return null
}

function formatMillions(m: number): string {
  if (m >= 1000) return `€${(m / 1000).toFixed(1)}B`
  const r = Math.round(m * 10) / 10
  return `€${Number.isInteger(r) ? r : r.toFixed(1)}M`
}

function plLeverCategory(plLever: string): { label: string; color: string } {
  const l = (plLever || '').toLowerCase()
  if (l.includes('ingreso') || l.includes('revenue') || l.includes('crecimiento') || l.includes('venta') || l.includes('recurrente'))
    return { label: 'Ingresos', color: '#4A7A5A' }
  if (l.includes('retención') || l.includes('cliente') || l.includes('satisfacción') || l.includes('arR') || l.includes('wallet'))
    return { label: 'Retención / cliente', color: '#5A7A9A' }
  if (l.includes('coste') || l.includes('ahorro') || l.includes('reducción') || l.includes('eficiencia') || l.includes('operativo'))
    return { label: 'Reducción de costes', color: '#C4952A' }
  if (l.includes('capacidad') || l.includes('productividad') || l.includes('margen'))
    return { label: 'Eficiencia operativa', color: '#8A6A1E' }
  return { label: 'Impacto estratégico', color: '#4A4744' }
}

type DEnriched = UserDecision & {
  fi: { display: string; minValue: number } | null
  ri: { display: string; minValue: number } | null
  sinHipotesis: boolean
}

export default function Atrium() {
  const isMobile = useIsMobile()
  const { decisions, openCreateModal, loadDemoDecisions, clearDecisions } = useDecisionsStore()
  const { name: orgName, sector, isConfigured, configure, resetOrg } = useOrgStore()
  const [diagnosisText, setDiagnosisText] = useState<string | null>(null)
  const [diagnosisLoading, setDiagnosisLoading] = useState(false)

  const handleLoadIFF = () => {
    configure(IFF_ORG.name, IFF_ORG.sector, IFF_ORG.context)
    loadDemoDecisions(IFF_DECISIONS)
    setDiagnosisText(null)
  }

  const handleClear = () => {
    if (window.confirm('¿Resetear todos los datos? Esta acción no se puede deshacer.')) {
      clearDecisions()
      resetOrg()
      setDiagnosisText(null)
    }
  }

  const handleDiagnosis = async () => {
    if (diagnosisLoading || decisions.length === 0) return
    setDiagnosisLoading(true)
    setDiagnosisText(null)
    const text = await generarDiagnosticoPortfolioIA(decisions, orgName || undefined, sector || undefined)
    setDiagnosisText(text)
    setDiagnosisLoading(false)
  }

  const userActive   = decisions.filter(d => d.status === 'evaluacion' || d.status === 'deliberando')
  const userResolved = decisions.filter(d => d.status === 'resuelta')

  // Enrich each decision with parsed financial impact
  const enriched: DEnriched[] = decisions.map(d => {
    // Priority: plLever (executive P&L estimate) → hypothesis → prediccion
    const fi = parseFinancialImpact(d.businessImpact.plLever || '')
            || parseFinancialImpact(d.businessImpact.hypothesis || '')
            || parseFinancialImpact(d.prediccion || '')
    // Confirmed: hypothesis validated → use fi value; else parse retrospectiva
    const ri = d.hypothesisStatus === 'confirmada'
      ? (parseFinancialImpact(d.retrospectiva || '') || fi)
      : (d.retrospectiva ? parseFinancialImpact(d.retrospectiva) : null)
    return { ...d, fi, ri, sinHipotesis: !d.businessImpact.hypothesis?.trim() }
  })

  const withValue    = enriched.filter(d => d.fi)
  const sinCuantif   = enriched.filter(d => !d.fi)
  const totalMin     = withValue.reduce((s, d) => s + (d.fi?.minValue || 0), 0)
  const confirmedMin = enriched.filter(d => d.ri).reduce((s, d) => s + (d.ri?.minValue || 0), 0)
  const sinHipCount  = enriched.filter(d => d.sinHipotesis).length
  const cicloCompleto = userResolved.filter(d => d.prediccion?.trim() && d.businessImpact.hypothesis?.trim()).length

  const totalDisplay     = totalMin > 0 ? `${formatMillions(Math.round(totalMin))}+` : '—'
  const confirmedDisplay = confirmedMin > 0 ? formatMillions(confirmedMin) : '—'

  // Group by P&L lever — sorted by group total descending
  const plGroups: Record<string, { items: DEnriched[]; color: string; groupMin: number }> = {}
  withValue.forEach(d => {
    const { label, color } = plLeverCategory(d.businessImpact.plLever)
    if (!plGroups[label]) plGroups[label] = { items: [], color, groupMin: 0 }
    plGroups[label].items.push(d)
    plGroups[label].groupMin += d.fi?.minValue || 0
  })
  const sortedGroups = Object.entries(plGroups).sort((a, b) => b[1].groupMin - a[1].groupMin)

  // Alert strip
  const sinAterrizar = userActive.filter(
    d => !d.businessImpact.leadingIndicators.length || !d.businessImpact.hypothesis?.trim() || !d.owner
  )

  const today   = new Date()
  const year    = today.getFullYear()
  const month   = String(today.getMonth() + 1).padStart(2, '0')
  const day     = String(today.getDate()).padStart(2, '0')
  const period  = `${day}/${month}/${year}`
  const sessionRef   = `S-${String(year).slice(2)}${month}${day}`
  const displayName  = isConfigured ? orgName : 'Tu organización'

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >

      {/* ── Header ── */}
      <div style={{ padding: isMobile ? '20px 20px 16px' : '28px 40px 20px', borderBottom: '1px solid var(--stoa-rule)' }}>
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 12 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                  Panel de Control
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>{period}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 22 : 30, fontWeight: 400, color: 'var(--stoa-ink)', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {displayName}
              </h1>
              {sector && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '4px 0 0' }}>{sector}</p>}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
              {!isMobile && decisions.length > 0 && (
                <>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>{sessionRef}</span>
                  <div style={{ width: 1, height: 12, backgroundColor: 'var(--stoa-rule-strong)' }} />
                  <button onClick={handleClear} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' as const, padding: '4px 6px' }}>
                    Resetear
                  </button>
                  <div style={{ width: 1, height: 12, backgroundColor: 'var(--stoa-rule-strong)' }} />
                </>
              )}
              <button
                onClick={openCreateModal}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-bg)', backgroundColor: 'var(--stoa-gold)', border: 'none', padding: isMobile ? '7px 14px' : '8px 20px', cursor: 'pointer', letterSpacing: '0.02em' }}
              >
                {isMobile ? '+ Nueva' : '+ Nueva iniciativa'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Empty State ── */}
      {decisions.length === 0 && (
        <motion.div
          variants={settle}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px 24px' : '60px 40px', gap: 32, textAlign: 'center' as const }}
        >
          <div style={{ maxWidth: 520 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, margin: '0 0 16px' }}>
              Sistema de trazabilidad de decisiones estratégicas
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 20 : 26, color: 'var(--stoa-ink-2)', margin: '0 0 14px', lineHeight: 1.35 }}>
              Cada decisión de innovación necesita una hipótesis medible y un impacto comprometido en la cuenta de resultados.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.7, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
              STOA cierra el ciclo completo: hipótesis → decisión → predicción → aprendizaje económico. El único sistema que conecta la innovación con la cuenta de resultados.
            </p>
          </div>
          <div style={{ border: '1px solid var(--stoa-rule)', padding: isMobile ? '24px 24px' : '28px 36px', maxWidth: 460, width: '100%', textAlign: 'left' as const, position: 'relative' as const }}>
            <div style={{ position: 'absolute' as const, top: -1, left: 0, right: 0, height: 2, backgroundColor: 'var(--stoa-gold)' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 8px' }}>Escenario de demostración</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--stoa-ink)', margin: '0 0 6px', lineHeight: 1.25 }}>IFF — Post-transformación estratégica</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 8px', lineHeight: 1.6 }}>Ingredientes · Fragancias · Sabores · 5 decisiones reales</p>
            <div style={{ display: 'flex', gap: isMobile ? 16 : 24, marginBottom: 20, flexWrap: 'wrap' as const }}>
              {[{ v: '€243M+', l: 'potencial en portfolio' }, { v: '€2.4M', l: 'impacto confirmado' }, { v: '2', l: 'ciclos completos' }].map(({ v, l }) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--stoa-gold)', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginTop: 3, letterSpacing: '0.05em' }}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={handleLoadIFF} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-bg)', backgroundColor: 'var(--stoa-gold)', border: 'none', padding: '10px 0', cursor: 'pointer', letterSpacing: '0.02em', width: '100%' }}>
              Cargar escenario IFF →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 1, backgroundColor: 'var(--stoa-rule)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em' }}>O</span>
              <div style={{ width: 36, height: 1, backgroundColor: 'var(--stoa-rule)' }} />
            </div>
            <button onClick={openCreateModal} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-gold)', background: 'none', border: '1px solid rgba(196, 149, 42, 0.4)', padding: '8px 20px', cursor: 'pointer', letterSpacing: '0.02em' }}>
              + Empezar con tu organización
            </button>
          </div>
        </motion.div>
      )}

      {decisions.length > 0 && <>

        {/* ── Impacto Financiero — Hero ── */}
        <motion.div variants={settle} style={{ padding: isMobile ? '20px 20px 18px' : '24px 40px 20px', borderBottom: '1px solid var(--stoa-rule)', backgroundColor: 'var(--stoa-surface-1)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: isMobile ? 18 : 22 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Impacto Financiero del Portfolio</span>
            {!isMobile && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                · {decisions.length} iniciativa{decisions.length !== 1 ? 's' : ''} · {userActive.length} activa{userActive.length !== 1 ? 's' : ''} · {userResolved.length} resuelta{userResolved.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '20px 24px' : 0 }}>
            {[
              {
                value: totalDisplay,
                label: 'Potencial estimado',
                sub: 'suma hipótesis activas',
                color: totalMin > 0 ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                hero: true,
              },
              {
                value: confirmedDisplay,
                label: 'Impacto confirmado',
                sub: 'resultados verificados',
                color: confirmedMin > 0 ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                hero: true,
              },
              {
                value: sinHipCount > 0 ? `${sinHipCount}` : '✓',
                label: sinHipCount > 0 ? 'Sin hipótesis formal' : 'Todas con hipótesis',
                sub: sinHipCount > 0 ? 'decisiones sin caso de negocio' : 'impacto articulado',
                color: sinHipCount > 0 ? 'var(--stoa-amber)' : 'var(--stoa-resolve)',
                hero: false,
              },
              {
                value: cicloCompleto,
                label: 'Ciclo completo',
                sub: 'hipótesis + predicción aterrizada',
                color: cicloCompleto > 0 ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                hero: false,
              },
            ].map(({ value, label, sub, color, hero }, i, arr) => (
              <div
                key={label}
                style={{
                  paddingLeft: !isMobile && i > 0 ? 28 : 0,
                  paddingRight: !isMobile && i < arr.length - 1 ? 28 : 0,
                  borderLeft: !isMobile && i > 0 ? '1px solid var(--stoa-rule)' : 'none',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: hero ? (isMobile ? 30 : 38) : (isMobile ? 22 : 28), color, lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 10 : 11, color: 'var(--stoa-ink-3)', marginTop: 6, lineHeight: 1.2 }}>{label}</div>
                {!isMobile && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginTop: 3, letterSpacing: '0.04em' }}>{sub}</div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Alertas ── */}
        {sinAterrizar.length > 0 && (
          <motion.div variants={settle} style={{ padding: isMobile ? '10px 20px' : '10px 40px', borderBottom: '1px solid var(--stoa-rule)', backgroundColor: 'rgba(181, 98, 26, 0.04)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>Requieren atención</span>
            {sinAterrizar.map(d => (
              <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-amber)' }}>{d.titulo}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginLeft: 6 }}>
                  {!d.owner ? '· sin responsable' : !d.businessImpact.leadingIndicators.length ? '· sin indicadores' : '· hipótesis incompleta'}
                </span>
              </Link>
            ))}
          </motion.div>
        )}

        {/* ── Cuenta de Explotación ── */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ borderBottom: '1px solid var(--stoa-rule)' }}
        >
          {/* Section header */}
          <div style={{ padding: isMobile ? '14px 20px 0' : '18px 40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
              Contribución a la Cuenta de Explotación
            </span>
            {totalMin > 0 && !isMobile && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                {withValue.length} con impacto cuantificado · {sinCuantif.length} pendientes
              </span>
            )}
          </div>

          {/* P&L groups sorted by value */}
          {sortedGroups.map(([catLabel, { items, color, groupMin }]) => (
            <motion.div key={catLabel} variants={depositItem}>
              {/* Group header */}
              <div style={{
                padding: isMobile ? '12px 20px 6px' : '14px 40px 6px',
                borderTop: '1px solid var(--stoa-rule)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color, letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
                  {catLabel}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 13 : 15, color }}>
                  {formatMillions(Math.round(groupMin * 10) / 10)}+
                </span>
              </div>
              {/* Decision rows */}
              {items.map(d => (
                <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      padding: isMobile ? '8px 20px 8px 28px' : '9px 40px 9px 56px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 12 : 13, color: d.sinHipotesis ? 'var(--stoa-ink-3)' : 'var(--stoa-ink-2)', lineHeight: 1.35 }}>
                        {d.titulo.length > (isMobile ? 36 : 60) ? d.titulo.slice(0, isMobile ? 36 : 60) + '…' : d.titulo}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em', flexShrink: 0 }}>{d.id}</span>
                      {d.sinHipotesis && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-amber)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, flexShrink: 0 }}>⚠ hipótesis pendiente</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 12 : 14, color: d.ri ? 'var(--stoa-resolve)' : color }}>
                        {d.fi?.display}
                      </span>
                      {d.ri && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-resolve)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, border: '1px solid var(--stoa-resolve)', padding: '1px 5px' }}>
                          REAL
                        </span>
                      )}
                      {!d.ri && d.status === 'resuelta' && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>
                          estimado
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          ))}

          {/* Sin cuantificar — no financial value in any field */}
          {sinCuantif.length > 0 && (
            <motion.div variants={depositItem} style={{ borderTop: '1px solid var(--stoa-rule)' }}>
              <div style={{ padding: isMobile ? '12px 20px 6px' : '14px 40px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-amber)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
                  Sin cuantificar
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-amber)' }}>⚠ impacto desconocido</span>
              </div>
              {sinCuantif.map(d => (
                <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ padding: isMobile ? '8px 20px 8px 28px' : '9px 40px 9px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 12 : 13, color: 'var(--stoa-ink-3)' }}>
                        {d.titulo.length > (isMobile ? 36 : 60) ? d.titulo.slice(0, isMobile ? 36 : 60) + '…' : d.titulo}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em', flexShrink: 0 }}>{d.id}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-amber)', flexShrink: 0 }}>añadir caso de negocio →</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          <div style={{ height: 12 }} />
        </motion.div>

        {/* ── Diagnóstico IA del Portfolio ── */}
        <motion.div variants={settle} style={{ borderBottom: '1px solid var(--stoa-rule)', padding: isMobile ? '16px 20px' : '16px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>Diagnóstico IA del portfolio</span>
              {!diagnosisText && !diagnosisLoading && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '3px 0 0' }}>
                  Balance estratégico · riesgos · siguiente acción recomendada
                </p>
              )}
            </div>
            <button
              onClick={handleDiagnosis}
              disabled={diagnosisLoading}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                fontWeight: 500,
                color: diagnosisLoading ? 'var(--stoa-ink-3)' : 'var(--stoa-bg)',
                backgroundColor: diagnosisLoading ? 'var(--stoa-rule)' : 'var(--stoa-gold)',
                border: 'none',
                padding: '7px 16px',
                cursor: diagnosisLoading ? 'default' : 'pointer',
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}
            >
              {diagnosisLoading ? 'Analizando…' : diagnosisText ? 'Regenerar análisis' : 'Pedir diagnóstico a la IA'}
            </button>
          </div>
          {diagnosisText && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginTop: 14, padding: '16px 20px', backgroundColor: 'var(--stoa-surface-2)', borderLeft: '2px solid var(--stoa-gold)' }}
            >
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' as const }}>
                {diagnosisText}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ── Decisiones activas + Resueltas ── */}
        <div className="stoa-col-2" style={{ borderBottom: '1px solid var(--stoa-rule)', flex: 1 }}>

          {/* Activas */}
          <motion.div
            variants={deposit}
            initial="hidden"
            animate="visible"
            style={{ padding: isMobile ? '20px 20px' : '20px 28px 20px 40px', borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)', borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>Decisiones activas</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{userActive.length}</span>
            </div>
            {userActive.length === 0 ? (
              <motion.div variants={depositItem} style={{ padding: '20px 0', textAlign: 'center' as const }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 12px' }}>Sin decisiones activas</p>
                <button onClick={openCreateModal} style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-gold)', background: 'none', border: '1px solid var(--stoa-gold)', padding: '6px 14px', cursor: 'pointer' }}>
                  + Nueva iniciativa
                </button>
              </motion.div>
            ) : (
              userActive.map((d, i) => (
                <motion.div key={d.id} variants={depositItem}>
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '12px 0', borderBottom: i < userActive.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 5 }}>
                        <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: statusColor[d.status] || 'var(--stoa-ink-3)', marginTop: 7, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink)', lineHeight: 1.35 }}>{d.preguntaEstrategica}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: weightColor[d.weight] || 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 2 }}>{d.weight}</span>
                          </div>
                          {d.businessImpact.hypothesis && (
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '4px 0 0', lineHeight: 1.45, fontStyle: 'italic' }}>
                              {d.businessImpact.hypothesis.slice(0, 100)}{d.businessImpact.hypothesis.length > 100 ? '…' : ''}
                            </p>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '2px 12px', marginTop: 4 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)' }}>{d.id}</span>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{d.owner || 'Sin responsable'}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>Plazo {d.deadline}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: statusColor[d.status], letterSpacing: '0.05em' }}>{statusLabel[d.status]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Resueltas + CTA Reunión */}
          <motion.div
            variants={deposit}
            initial="hidden"
            animate="visible"
            style={{ padding: isMobile ? '20px 20px' : '20px 40px 20px 28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>Recientemente resueltas</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{userResolved.length}</span>
            </div>
            {userResolved.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 20px', lineHeight: 1.55 }}>
                Las decisiones cerradas quedan registradas como memoria institucional.
              </p>
            ) : (
              userResolved.slice(0, 4).map((d, i) => (
                <motion.div key={d.id} variants={depositItem} style={{ padding: '10px 0', borderBottom: i < Math.min(userResolved.length, 4) - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)', marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.3 }}>{d.preguntaEstrategica}</p>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', flexShrink: 0 }}>{d.id}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-resolve)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Resuelta</span>
                          {d.prediccion && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>· compromiso activo</span>}
                          {!d.prediccion && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>· sin compromiso</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--stoa-rule)' }}>
              <Link to="/council" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Sala de Reunión</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-gold)', margin: 0 }}>Abrir sesión de trabajo →</p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{userActive.length} pendientes</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Memory Band ── */}
        <motion.div variants={settle} style={{ padding: isMobile ? '0 20px' : '0 40px', height: 36, display: 'flex', alignItems: 'center', gap: 20, overflow: 'hidden', backgroundColor: 'var(--stoa-surface-1)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>Registro</span>
          <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', overflow: 'hidden' }}>
            {decisions.map(d => (
              <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: d.status === 'resuelta' ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)', whiteSpace: 'nowrap' as const }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, marginRight: 5, letterSpacing: '0.03em' }}>{d.id}</span>
                  {d.titulo}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

      </>}
    </motion.div>
  )
}
