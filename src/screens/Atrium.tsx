import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore } from '../store/decisions'
import { useOrgStore } from '../store/org'
import { generarDiagnosticoPortfolioIA } from '../lib/ai'
import { IFF_ORG, IFF_DECISIONS } from '../data/iffDemo'

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
const tipoLabel: Record<string, string> = {
  'tecnología / IA':       'Tec / IA',
  'proceso interno':       'Proceso',
  'eficiencia operativa':  'Eficiencia',
  'expansión':             'Expansión',
  'modelo de negocio':     'Modelo',
  'experiencia de cliente':'Experiencia',
  'partnership':           'Partnership',
  'cultura organizativa':  'Cultura',
}

function plLeverCategory(plLever: string): { label: string; color: string } {
  const l = (plLever || '').toLowerCase()
  if (l.includes('ingreso') || l.includes('revenue') || l.includes('crecimiento') || l.includes('venta'))
    return { label: 'Ingresos', color: '#4A7A5A' }
  if (l.includes('coste') || l.includes('ahorro') || l.includes('reducción') || l.includes('eficiencia'))
    return { label: 'Reducción de costes', color: '#C4952A' }
  if (l.includes('retención') || l.includes('cliente') || l.includes('satisfacción') || l.includes('arR'))
    return { label: 'Retención / cliente', color: '#C4952A' }
  if (l.includes('capacidad') || l.includes('productividad') || l.includes('margen'))
    return { label: 'Eficiencia operativa', color: '#8A6A1E' }
  return { label: 'Impacto estratégico', color: '#4A4744' }
}

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A30', padding: '8px 12px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F2EDE6', margin: 0 }}>
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  )
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

  const userActive   = decisions.filter((d) => d.status === 'evaluacion' || d.status === 'deliberando')
  const userResolved = decisions.filter((d) => d.status === 'resuelta')

  // KPI calculations
  const conHipotesis = decisions.filter((d) => d.businessImpact.hypothesis?.trim()).length
  const pctHipotesis = decisions.length > 0 ? Math.round(conHipotesis / decisions.length * 100) : 0
  const prediccionesPendientes = userResolved.filter((d) => d.prediccion?.trim()).length
  const tiemposDeliberacion = userResolved
    .filter((d) => d.settledAt)
    .map((d) => Math.max(0, Math.floor((new Date(d.settledAt!).getTime() - new Date(d.opened).getTime()) / 86_400_000)))
  const tiempoMedio = tiemposDeliberacion.length > 0
    ? Math.round(tiemposDeliberacion.reduce((a, b) => a + b, 0) / tiemposDeliberacion.length)
    : null
  const sinIndicadores = userActive.filter((d) => !d.businessImpact.leadingIndicators?.length).length
  const cicloCompleto = userResolved.filter((d) => d.prediccion?.trim() && d.businessImpact.hypothesis?.trim()).length

  // Portfolio chart data
  const evalCount = decisions.filter((d) => d.status === 'evaluacion').length
  const deliCount = decisions.filter((d) => d.status === 'deliberando').length
  const resuCount = userResolved.length
  const portfolioData = [
    evalCount  > 0 && { name: 'En evaluación', value: evalCount,  color: statusColor.evaluacion },
    deliCount  > 0 && { name: 'Deliberando',   value: deliCount,  color: statusColor.deliberando },
    resuCount  > 0 && { name: 'Resueltas',      value: resuCount,  color: statusColor.resuelta },
  ].filter(Boolean) as Array<{ name: string; value: number; color: string }>

  // Innovation type breakdown
  const tiposCount: Record<string, number> = {}
  decisions.forEach((d) => { tiposCount[d.tipoInnovacion] = (tiposCount[d.tipoInnovacion] || 0) + 1 })
  const tiposData = Object.entries(tiposCount).sort((a, b) => b[1] - a[1])

  // Weight distribution
  const pesoCount: Record<string, number> = { Crítica: 0, Mayor: 0, Significativa: 0, Menor: 0 }
  decisions.forEach((d) => { if (d.weight in pesoCount) pesoCount[d.weight]++ })

  // P&L levers by category
  const plCategories: Record<string, { decisions: typeof decisions; color: string }> = {}
  decisions.forEach((d) => {
    const { label, color } = plLeverCategory(d.businessImpact.plLever)
    if (!plCategories[label]) plCategories[label] = { decisions: [], color }
    plCategories[label].decisions.push(d)
  })

  const sinAterrizar = userActive.filter(
    (d) => !d.businessImpact.leadingIndicators.length || !d.businessImpact.hypothesis?.trim() || !d.owner
  )

  const today = new Date()
  const year  = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day   = String(today.getDate()).padStart(2, '0')
  const period     = `${day}/${month}/${year}`
  const sessionRef = `S-${String(year).slice(2)}${month}${day}`
  const displayName = isConfigured ? orgName : 'Tu organización'

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

      {/* ── Empty State Landing ── */}
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
              Cada decisión de innovación necesita una hipótesis medible y una predicción comprometida.
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
              {[{ v: '80%', l: 'hipótesis medible' }, { v: '2', l: 'predicciones activas' }, { v: '2', l: 'ciclos completos' }].map(({ v, l }) => (
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

        {/* ── KPI Strip ── */}
        <motion.div variants={settle} style={{ padding: isMobile ? '14px 20px 16px' : '16px 40px', borderBottom: '1px solid var(--stoa-rule)', backgroundColor: 'var(--stoa-surface-1)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: isMobile ? 12 : 14 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Métricas de Impacto</span>
            {!isMobile && <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>ciclo: hipótesis → decisión → predicción → aprendizaje económico</span>
            </>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: isMobile ? '12px 16px' : 0 }}>
            {[
              { value: `${pctHipotesis}%`, label: 'Hipótesis medible', sub: `${conHipotesis}/${decisions.length}`, color: pctHipotesis >= 80 ? 'var(--stoa-resolve)' : pctHipotesis >= 50 ? 'var(--stoa-gold)' : 'var(--stoa-amber)' },
              { value: prediccionesPendientes, label: 'Predicciones activas', sub: 'pendientes de revisión', color: prediccionesPendientes > 0 ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)' },
              { value: tiempoMedio !== null ? `${tiempoMedio}d` : '—', label: 'Tiempo medio', sub: 'por decisión', color: 'var(--stoa-ink)' },
              { value: sinIndicadores, label: 'Sin indicadores', sub: 'activas sin medir', color: sinIndicadores > 0 ? 'var(--stoa-amber)' : 'var(--stoa-resolve)' },
              { value: cicloCompleto, label: 'Ciclo completo', sub: 'hipótesis+predicción', color: cicloCompleto > 0 ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)' },
            ].map(({ value, label, sub, color }, i, arr) => (
              <div key={label} style={{ paddingLeft: !isMobile && i > 0 ? 20 : 0, paddingRight: !isMobile && i < arr.length - 1 ? 20 : 0, borderLeft: !isMobile && i > 0 ? '1px solid var(--stoa-rule)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 22 : 26, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 10 : 11, color: 'var(--stoa-ink-3)', marginTop: 4, lineHeight: 1.2 }}>{label}</div>
                {!isMobile && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginTop: 2, letterSpacing: '0.04em' }}>{sub}</div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Alertas ── */}
        {sinAterrizar.length > 0 && (
          <motion.div variants={settle} style={{ padding: isMobile ? '10px 20px' : '10px 40px', borderBottom: '1px solid var(--stoa-rule)', backgroundColor: 'rgba(181, 98, 26, 0.04)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>Requieren atención</span>
            {sinAterrizar.map((d) => (
              <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-amber)' }}>{d.titulo}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginLeft: 6 }}>
                  {!d.owner ? '· sin responsable' : !d.businessImpact.leadingIndicators.length ? '· sin indicadores' : '· hipótesis incompleta'}
                </span>
              </Link>
            ))}
          </motion.div>
        )}

        {/* ── Charts + P&L ── */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ borderBottom: '1px solid var(--stoa-rule)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr 1fr' }}
        >
          {/* Portfolio donut */}
          <motion.div variants={depositItem} style={{ padding: isMobile ? '20px 20px' : '20px 28px 20px 40px', borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)', borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const, margin: '0 0 2px' }}>Portfolio</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0 }}>{decisions.length} decisión{decisions.length !== 1 ? 'es' : ''} totales</p>
            </div>
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {portfolioData.length > 0 ? (
                <ResponsiveContainer width={isMobile ? 120 : 140} height={120}>
                  <PieChart>
                    <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} strokeWidth={0} dataKey="value">
                      {portfolioData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
              <div style={{ marginLeft: isMobile ? 20 : 12, display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                {portfolioData.map((entry) => (
                  <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{entry.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)', marginLeft: 4 }}>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Innovation type breakdown */}
          <motion.div variants={depositItem} style={{ padding: isMobile ? '20px 20px' : '20px 24px', borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)', borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const, margin: '0 0 12px' }}>Tipo de innovación</p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
              {tiposData.map(([tipo, count]) => {
                const pct = Math.round(count / decisions.length * 100)
                return (
                  <div key={tipo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{tipoLabel[tipo] || tipo}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-2)' }}>{count}</span>
                    </div>
                    <div style={{ height: 4, backgroundColor: 'var(--stoa-rule)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--stoa-gold)', borderRadius: 2 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* P&L contribution */}
          <motion.div variants={depositItem} style={{ padding: isMobile ? '20px 20px' : '20px 40px 20px 24px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const, margin: '0 0 12px' }}>Contribución a P&L</p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {Object.entries(plCategories).map(([catLabel, { decisions: catDecisions, color }]) => (
                <div key={catLabel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{catLabel}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, letterSpacing: '0.05em' }}>{catDecisions.length} inciativa{catDecisions.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                    {catDecisions.map((d) => (
                      <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, border: `1px solid ${color}40`, padding: '2px 6px', display: 'inline-block', letterSpacing: '0.04em' }}>
                          {d.id}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Diagnóstico IA ── */}
        <motion.div variants={settle} style={{ borderBottom: '1px solid var(--stoa-rule)', padding: isMobile ? '16px 20px' : '16px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>Diagnóstico IA del portfolio</span>
              {!diagnosisText && !diagnosisLoading && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '3px 0 0' }}>
                  Análisis estratégico de las apuestas actuales, riesgos y siguiente acción recomendada
                </p>
              )}
            </div>
            <button
              onClick={handleDiagnosis}
              disabled={diagnosisLoading}
              style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, color: diagnosisLoading ? 'var(--stoa-ink-3)' : 'var(--stoa-bg)', backgroundColor: diagnosisLoading ? 'var(--stoa-rule)' : 'var(--stoa-gold)', border: 'none', padding: '7px 16px', cursor: diagnosisLoading ? 'default' : 'pointer', flexShrink: 0, letterSpacing: '0.02em' }}
            >
              {diagnosisLoading ? 'Analizando…' : diagnosisText ? 'Regenerar' : 'Analizar portfolio'}
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

        {/* ── Active Decisions + Resolved ── */}
        <div className="stoa-col-2" style={{ borderBottom: '1px solid var(--stoa-rule)', flex: 1 }}>

          {/* En Deliberación */}
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

          {/* Resueltas + Consejo CTA */}
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
                          {d.prediccion && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>· predicción activa</span>}
                          {!d.prediccion && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>· sin predicción</span>}
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
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Sesión de Consejo</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-gold)', margin: 0 }}>Abrir sala de reunión →</p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{userActive.length} pendientes</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Memory Band ── */}
        <motion.div variants={settle} style={{ padding: isMobile ? '0 20px' : '0 40px', height: 36, display: 'flex', alignItems: 'center', gap: 20, overflow: 'hidden', backgroundColor: 'var(--stoa-surface-1)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>Memoria</span>
          <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', overflow: 'hidden' }}>
            {decisions.map((d) => (
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
