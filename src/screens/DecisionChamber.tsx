import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore, daysActive, reviewHorizonPassed, reviewHorizonDaysLeft } from '../store/decisions'
import { challengeDecisionIA } from '../lib/ai'
import type { AIObservation, BusinessCase, HypothesisStatus, ActualResults } from '../types'

type VerdictState = 'open' | 'committing' | 'settled'

const observationColor: Record<AIObservation['type'], string> = {
  'Observación': 'var(--stoa-ink-3)',
  'Riesgo': 'var(--stoa-amber)',
  'Indicador ausente': 'var(--stoa-gold)',
  'Señal': 'var(--stoa-ink-2)',
  'Recomendación': 'var(--stoa-resolve)',
  'Pregunta pendiente': 'var(--stoa-ink-2)',
}

const statusLabel: Record<string, string> = {
  evaluacion: 'En Evaluación',
  deliberando: 'En Deliberación',
  resuelta: 'Resuelta',
  memoria: 'Archivo',
}

const statusColor: Record<string, string> = {
  evaluacion: 'var(--stoa-ink-3)',
  deliberando: 'var(--stoa-gold)',
  resuelta: 'var(--stoa-resolve)',
  memoria: 'var(--stoa-ink-3)',
}


export default function DecisionChamber() {
  const { id } = useParams<{ id: string }>()
  const isMobile = useIsMobile()
  const { decisions, settleDecision, markConditionSatisfied, addDeliberationEntry, updateDecision, registerActualResults } = useDecisionsStore()
  const decision = decisions.find((d) => d.id === id)

  const [verdictState, setVerdictState] = useState<VerdictState>('open')
  const [selectedVerdict, setSelectedVerdict] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysis, setAnalysis] = useState<AIObservation[]>([])
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [deliberationText, setDeliberationText] = useState('')
  const [deliberationParticipant, setDeliberationParticipant] = useState('')
  const [editingHypothesis, setEditingHypothesis] = useState(false)
  const [hypothesisText, setHypothesisText] = useState('')
  const [prediccionText, setPrediccionText] = useState('')
  const [editingBusinessCase, setEditingBusinessCase] = useState(false)
  const [bcCoste, setBcCoste] = useState('')
  const [bcInversion, setBcInversion] = useState('')
  const [bcRetorno, setBcRetorno] = useState('')
  const [bcConfianza, setBcConfianza] = useState<'Bajo' | 'Medio' | 'Alto'>('Medio')
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null)
  const [kpiNombre, setKpiNombre] = useState('')
  const [kpiUnidad, setKpiUnidad] = useState('')
  const [kpiBaseline, setKpiBaseline] = useState('')
  const [kpiEuroUnidad, setKpiEuroUnidad] = useState('')
  const [kpiObjetivo, setKpiObjetivo] = useState('')
  const [kpiDelta, setKpiDelta] = useState('')
  const [kpiFecha, setKpiFecha] = useState('')
  const [kpiResponsable, setKpiResponsable] = useState('')
  const [showResultsForm, setShowResultsForm] = useState(false)
  const [resRetornoReal, setResRetornoReal] = useState('')
  const [resNarrativa, setResNarrativa] = useState('')
  const [resHypStatus, setResHypStatus] = useState<HypothesisStatus>('confirmada')
  const [resKpiValues, setResKpiValues] = useState<Record<string, string>>({})

  const isSettled = decision ? (decision.status === 'resuelta' || verdictState === 'settled') : false
  const days = decision ? daysActive(decision.opened) : 0
  const conditionsMet = decision ? decision.resolutionConditions.filter((c) => c.satisfied).length : 0

  if (!decision) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: '60px 40px' }}>
        <Link to="/chamber" style={{ textDecoration: 'none', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>← Decisiones</span>
        </Link>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          Decisión no encontrada
        </span>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--stoa-ink-2)', margin: 0, textAlign: 'center' as const }}>
          La decisión {id} no existe en el sistema.
        </p>
      </div>
    )
  }

  async function handleAnalyze() {
    if (analysisLoading) return
    setAnalysisLoading(true)
    setShowAnalysis(true)
    setAnalysis([])
    const obs = await challengeDecisionIA(decision!)
    setAnalysis(obs)
    setAnalysisLoading(false)
  }

  function handleCommitVerdict() {
    if (!selectedVerdict.trim()) return
    setVerdictState('committing')
    setTimeout(() => {
      settleDecision(decision!.id, selectedVerdict.trim(), prediccionText.trim() || undefined)
      setVerdictState('settled')
    }, 700)
  }

  function handleAddNote() {
    if (!deliberationText.trim()) return
    const now = new Date()
    addDeliberationEntry(decision!.id, {
      participant: deliberationParticipant || 'Participante',
      role: '',
      text: deliberationText.trim(),
      timestamp: `${now.getDate()} ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][now.getMonth()]} ${now.getFullYear()} · ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    })
    setDeliberationText('')
    setDeliberationParticipant('')
  }

  function handleSaveHypothesis() {
    updateDecision(decision!.id, {
      businessImpact: { ...decision!.businessImpact, hypothesis: hypothesisText },
    })
    setEditingHypothesis(false)
  }

  function handleSaveBusinessCase() {
    const coste = parseFloat(bcCoste.replace(/[.,\s]/g, '')) || null
    const inv = parseFloat(bcInversion.replace(/[.,\s]/g, '')) || null
    const ret = parseFloat(bcRetorno.replace(/[.,\s]/g, '')) || null
    const payback = (inv && ret && ret > 0) ? Math.round((inv / (ret / 12)) * 10) / 10 : null
    const bc: BusinessCase = {
      costeProblemActual: coste,
      inversionRequerida: inv,
      retornoEsperado: ret,
      paybackMeses: payback,
      confianza: bcConfianza,
    }
    updateDecision(decision!.id, { businessCase: bc })
    setEditingBusinessCase(false)
  }

  function openBusinessCaseEditor() {
    const bc = decision!.businessCase
    setBcCoste(bc?.costeProblemActual != null ? String(bc.costeProblemActual) : '')
    setBcInversion(bc?.inversionRequerida != null ? String(bc.inversionRequerida) : '')
    setBcRetorno(bc?.retornoEsperado != null ? String(bc.retornoEsperado) : '')
    setBcConfianza(bc?.confianza ?? 'Medio')
    setEditingBusinessCase(true)
  }

  function openKpiEditor(kpi?: import('../types').InvestmentKPI) {
    setKpiNombre(kpi?.nombre ?? '')
    setKpiUnidad(kpi?.unidad ?? '')
    setKpiBaseline(kpi?.baselineValor != null ? String(kpi.baselineValor) : '')
    setKpiEuroUnidad(kpi?.baselineEuroUnidad != null ? String(kpi.baselineEuroUnidad) : '')
    setKpiObjetivo(kpi?.objetivoValor != null ? String(kpi.objetivoValor) : '')
    setKpiDelta(kpi?.deltaEuros != null ? String(kpi.deltaEuros) : '')
    setKpiFecha(kpi?.fechaMedicion ?? '')
    setKpiResponsable(kpi?.responsable ?? '')
    setEditingKpiId(kpi?.id ?? 'new')
  }

  function handleSaveKpi() {
    if (!kpiNombre.trim()) return
    const existing = decision!.kpis ?? []
    const baseline = parseFloat(kpiBaseline) || null
    const euroUnit = parseFloat(kpiEuroUnidad) || null
    const objetivo = parseFloat(kpiObjetivo) || null
    const delta = parseFloat(kpiDelta) || (baseline != null && euroUnit != null && objetivo != null
      ? Math.abs(objetivo - baseline) * euroUnit
      : null)
    const kpi: import('../types').InvestmentKPI = {
      id: editingKpiId === 'new' ? `KPI-${Date.now()}` : editingKpiId!,
      nombre: kpiNombre.trim(),
      unidad: kpiUnidad.trim(),
      baselineValor: baseline,
      baselineEuroUnidad: euroUnit,
      objetivoValor: objetivo,
      deltaEuros: delta,
      fechaMedicion: kpiFecha.trim(),
      responsable: kpiResponsable.trim(),
    }
    const updated = editingKpiId === 'new'
      ? [...existing, kpi]
      : existing.map(k => k.id === editingKpiId ? kpi : k)
    updateDecision(decision!.id, { kpis: updated })
    setEditingKpiId(null)
  }

  function handleDeleteKpi(kpiId: string) {
    const updated = (decision!.kpis ?? []).filter(k => k.id !== kpiId)
    updateDecision(decision!.id, { kpis: updated })
    if (editingKpiId === kpiId) setEditingKpiId(null)
  }

  function openResultsForm() {
    const ar = decision!.actualResults
    setResRetornoReal(ar?.retornoReal != null ? String(ar.retornoReal) : '')
    setResNarrativa(ar?.narrativa ?? decision!.retrospectiva ?? '')
    setResHypStatus(ar?.hypothesisStatus ?? 'confirmada')
    const kpiMap: Record<string, string> = {}
    ;(ar?.kpiResults ?? []).forEach(r => { kpiMap[r.kpiId] = r.valorAlcanzado != null ? String(r.valorAlcanzado) : '' })
    setResKpiValues(kpiMap)
    setShowResultsForm(true)
  }

  function handleSaveResults() {
    const retornoReal = parseFloat(resRetornoReal) || null
    const retornoEsperado = decision!.businessCase?.retornoEsperado ?? null
    const varianzaPct = (retornoReal != null && retornoEsperado != null && retornoEsperado > 0)
      ? Math.round(((retornoReal - retornoEsperado) / retornoEsperado) * 1000) / 10
      : null
    const kpiResults = (decision!.kpis ?? []).map(kpi => {
      const val = parseFloat(resKpiValues[kpi.id] ?? '') || null
      const deltaReal = (val != null && kpi.baselineEuroUnidad != null && kpi.baselineValor != null)
        ? Math.abs(val - kpi.baselineValor) * kpi.baselineEuroUnidad
        : null
      return { kpiId: kpi.id, valorAlcanzado: val, deltaRealEuros: deltaReal }
    })
    const results: ActualResults = {
      registeredAt: new Date().toISOString(),
      retornoReal,
      varianzaPct,
      kpiResults,
      narrativa: resNarrativa.trim(),
      hypothesisStatus: resHypStatus,
    }
    registerActualResults(decision!.id, results)
    setShowResultsForm(false)
  }

  // Shared panel content — rendered inline after deliberation on mobile,
  // and in the sidebar on desktop.
  const allConditionsMet = decision.resolutionConditions.length > 0 && conditionsMet === decision.resolutionConditions.length

  const conditionsPanel = (
    <>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: allConditionsMet ? 'var(--stoa-resolve)' : 'var(--stoa-amber)' }}>
          Condiciones
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: allConditionsMet ? 'var(--stoa-resolve)' : 'var(--stoa-amber)', padding: '3px 10px', border: `1.5px solid ${allConditionsMet ? 'var(--stoa-resolve)' : 'var(--stoa-amber)'}` }}>
          {conditionsMet}/{decision.resolutionConditions.length}
        </span>
      </div>
      {!isSettled && !allConditionsMet && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 10px', letterSpacing: '0.04em' }}>
          Pulsa cada condición para marcarla como cumplida
        </p>
      )}
      {!isSettled && allConditionsMet && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-resolve)', margin: '0 0 10px' }}>
          Todas las condiciones cumplidas — listo para cerrar.
        </p>
      )}
      <div>
        {decision.resolutionConditions.map((cond) => (
          <div
            key={cond.id}
            onClick={() => !isSettled && markConditionSatisfied(decision.id, cond.id, !cond.satisfied)}
            style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--stoa-rule)', cursor: isSettled ? 'default' : 'pointer' }}
          >
            <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: cond.satisfied ? 'var(--stoa-resolve)' : 'transparent', border: `1.5px solid ${cond.satisfied ? 'var(--stoa-resolve)' : 'var(--stoa-rule-strong)'}`, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cond.satisfied && <span style={{ color: 'var(--stoa-bg)', fontSize: 11, lineHeight: 1 }}>✓</span>}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: cond.satisfied ? 'var(--stoa-ink-3)' : 'var(--stoa-ink)', margin: 0, lineHeight: 1.4, textDecoration: cond.satisfied ? 'line-through' : 'none' }}>
              {cond.label}
            </p>
          </div>
        ))}
      </div>
    </>
  )

  const resolutionPanel = isSettled ? (
    <>
      {/* Archived state header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--stoa-resolve)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-resolve)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
          Decisión archivada
        </span>
      </div>

      {/* Verdict — dominant */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>
          Resolución
        </span>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.3 }}>
          {decision.selectedVerdict || selectedVerdict}
        </p>
      </div>

      {/* Prediction — gold callout */}
      {(decision.prediccion || prediccionText) && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderLeft: '3px solid var(--stoa-gold)', backgroundColor: 'rgba(196, 149, 42, 0.05)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>
            Predicción
          </span>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55 }}>
            {decision.prediccion || prediccionText}
          </p>
        </div>
      )}

      {/* Archive note — subdued */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em', margin: '0 0 20px' }}>
        Memoria Estratégica · Revisión: {decision.businessImpact.reviewHorizon}
      </p>

      {/* ¿Qué sigue? — distinct action panel */}
      <div style={{ backgroundColor: 'var(--stoa-surface-2)', padding: '16px', borderTop: '2px solid var(--stoa-rule-strong)' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, color: 'var(--stoa-ink-2)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 12 }}>
          ¿Qué sigue?
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' as const }}>
          {[
            { to: '/', label: 'Volver al Dashboard' },
            { to: '/reading-room', label: 'Revisar el Archivo' },
            { to: '/chamber', label: 'Abrir otra decisión' },
          ].map(({ to, label }, i, arr) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-gold)' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  ) : (
    <>
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'var(--stoa-gold)', display: 'block', marginBottom: 6 }}>
          Cerrar decisión
        </span>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0', letterSpacing: '0.04em', lineHeight: 1.7 }}>
          1 · Selecciona o escribe la resolución<br />
          2 · Añade una predicción (opcional)<br />
          3 · Registra para archivar
        </p>
      </div>
      <div>
        {decision.verdictOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelectedVerdict(opt)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left' as const,
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              color: selectedVerdict === opt ? 'var(--stoa-ink)' : 'var(--stoa-ink-3)',
              backgroundColor: selectedVerdict === opt ? 'rgba(196, 149, 42, 0.08)' : 'transparent',
              border: '1px solid ' + (selectedVerdict === opt ? 'var(--stoa-gold)' : 'var(--stoa-rule)'),
              padding: '7px 10px',
              cursor: 'pointer',
              marginBottom: 4,
              lineHeight: 1.4,
            }}
          >
            {selectedVerdict === opt ? '● ' : '○ '}{opt}
          </button>
        ))}
        <textarea
          value={selectedVerdict}
          onChange={(e) => setSelectedVerdict(e.target.value)}
          placeholder="O escribe la resolución completa aquí…"
          rows={2}
          style={{ width: '100%', fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '8px 12px', outline: 'none', resize: 'vertical' as const, lineHeight: 1.55, boxSizing: 'border-box' as const, marginTop: 6 }}
        />
        <div style={{ marginTop: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>
            Predicción · ¿qué esperas que ocurra?
          </span>
          <textarea
            value={prediccionText}
            onChange={(e) => setPrediccionText(e.target.value)}
            placeholder="Ej: En 90 días el tiempo de evaluación se reducirá en un 40%"
            rows={2}
            style={{ width: '100%', fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule)', padding: '8px 12px', outline: 'none', resize: 'vertical' as const, lineHeight: 1.55, boxSizing: 'border-box' as const }}
          />
        </div>
        <button
          onClick={handleCommitVerdict}
          disabled={!selectedVerdict.trim() || verdictState === 'committing'}
          style={{
            width: '100%',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 500,
            color: selectedVerdict.trim() ? 'var(--stoa-bg)' : 'var(--stoa-ink-3)',
            backgroundColor: selectedVerdict.trim() ? 'var(--stoa-gold)' : 'var(--stoa-rule)',
            border: 'none',
            padding: '11px 16px',
            cursor: selectedVerdict.trim() ? 'pointer' : 'default',
            marginTop: 10,
            letterSpacing: '0.02em',
          }}
        >
          {verdictState === 'committing' ? 'Registrando…' : 'Registrar y archivar decisión'}
        </button>
      </div>
    </>
  )

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ padding: isMobile ? '14px 20px' : '22px 40px 18px', borderBottom: '1px solid var(--stoa-rule-strong)' }}>
        <motion.div variants={settle}>
          {isMobile ? (
            <>
              {/* Mobile: back link + status badge on one row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Link to="/chamber" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>← Decisiones</span>
                </Link>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: isSettled ? 'var(--stoa-resolve)' : statusColor[decision.status],
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase' as const,
                  padding: '3px 8px',
                  border: `1px solid ${isSettled ? 'var(--stoa-resolve)' : statusColor[decision.status]}`,
                }}>
                  {isSettled ? 'Resuelta' : statusLabel[decision.status]}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', display: 'block', marginBottom: 8, letterSpacing: '0.04em' }}>
                {decision.id} · {days}d activa · {decision.deadline}
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 400, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.3 }}>
                {decision.preguntaEstrategica}
              </h1>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap' as const, gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' as const }}>
                  <Link to="/chamber" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>←</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>Decisiones</span>
                  </Link>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-rule-strong)' }}>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                    Sala de Decisión
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
                    {decision.id}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: isSettled ? 'var(--stoa-resolve)' : statusColor[decision.status], letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                    {isSettled ? 'Resuelta' : statusLabel[decision.status]}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                    {decision.tipoInnovacion}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                    {days}d activa · Plazo {decision.deadline}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>
                  {decision.titulo}
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.25, maxWidth: 720, letterSpacing: '-0.01em' }}>
                {decision.preguntaEstrategica}
              </h1>
            </>
          )}
        </motion.div>
      </div>

      {/* Lifecycle bar — desktop only */}
      {!isMobile && (
        <motion.div variants={settle} style={{ padding: '0 40px', height: 36, display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid var(--stoa-rule)', backgroundColor: 'var(--stoa-surface-1)', flexShrink: 0 }}>
          {['En evaluación', 'Deliberando', 'Resolución pendiente', 'Archivo'].map((stage, i) => {
            const statusIndex = isSettled ? 3 : { evaluacion: 0, deliberando: 1, resuelta: 2, memoria: 3 }[decision.status] ?? 0
            const active = i === statusIndex
            const done = i < statusIndex
            return (
              <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: active ? 'var(--stoa-gold)' : done ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)', fontWeight: active ? 500 : 400 }}>
                  {stage}
                </span>
                {i < 3 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-rule-strong)', margin: '0 12px' }}>→</span>}
              </div>
            )
          })}
        </motion.div>
      )}

      {/* Main body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left: main content */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '0' : '28px 32px 40px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            overflowY: 'auto' as const,
          }}
        >
          {/* Deliberation */}
          <motion.div variants={depositItem} style={{ padding: isMobile ? '24px 20px 20px' : '0 0 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--stoa-rule)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--stoa-ink-2)' }}>
                  Deliberación
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                  {decision.deliberationEntries.length} entrada{decision.deliberationEntries.length !== 1 ? 's' : ''}
                </span>
              </div>
              {isSettled && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, padding: '2px 8px', border: '1px solid var(--stoa-resolve)' }}>
                  Cerrada
                </span>
              )}
            </div>

            {/* Hypothesis as deliberation context */}
            {decision.businessImpact.hypothesis && (
              <div style={{ marginBottom: 16, padding: '10px 14px', borderLeft: '2px solid var(--stoa-gold)', backgroundColor: 'rgba(196, 149, 42, 0.03)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                  Hipótesis que deliberamos
                </span>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                  {decision.businessImpact.hypothesis}
                </p>
              </div>
            )}

            {/* Entries */}
            <div>
              {decision.deliberationEntries.length === 0 && !isSettled && (
                <div style={{ padding: '16px 0', marginBottom: 8 }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.6 }}>
                    Registra las posiciones, argumentos y aportaciones del equipo. Cada entrada queda en el acta permanente de la decisión.
                  </p>
                </div>
              )}
              {decision.deliberationEntries.map((entry, i) => (
                <div key={entry.id} style={{ padding: '14px 0', borderBottom: i < decision.deliberationEntries.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>{entry.participant}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{entry.timestamp}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.65 }}>{entry.text}</p>
                </div>
              ))}

              {/* Entry form */}
              {!isSettled && (
                <div style={{ marginTop: decision.deliberationEntries.length > 0 ? 20 : 0, paddingTop: decision.deliberationEntries.length > 0 ? 16 : 0, borderTop: decision.deliberationEntries.length > 0 ? '1px solid var(--stoa-rule)' : 'none' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      value={deliberationParticipant}
                      onChange={(e) => setDeliberationParticipant(e.target.value)}
                      placeholder="Participante"
                      style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule)', padding: '8px 12px', outline: 'none', boxSizing: 'border-box' as const }}
                    />
                  </div>
                  <textarea
                    value={deliberationText}
                    onChange={(e) => setDeliberationText(e.target.value)}
                    placeholder="Posición, argumento o aportación del participante…"
                    rows={3}
                    style={{ width: '100%', fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule)', padding: '9px 12px', outline: 'none', resize: 'vertical' as const, lineHeight: 1.55, boxSizing: 'border-box' as const }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!deliberationText.trim()}
                    style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: deliberationText.trim() ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)', background: 'none', border: '1px solid ' + (deliberationText.trim() ? 'var(--stoa-rule-strong)' : 'var(--stoa-rule)'), padding: '6px 14px', cursor: deliberationText.trim() ? 'pointer' : 'default', letterSpacing: '0.04em' }}
                  >
                    + Registrar entrada
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Mobile: conditions + close appear here, right after deliberation */}
          {isMobile && (
            <>
              <motion.div variants={depositItem} style={{ padding: '20px 20px', backgroundColor: 'rgba(181, 98, 26, 0.08)', borderTop: '2px solid rgba(181, 98, 26, 0.5)', borderBottom: '1px solid rgba(181, 98, 26, 0.2)' }}>
                {conditionsPanel}
              </motion.div>
              <motion.div variants={depositItem} style={{ padding: '24px 20px', borderTop: isSettled ? '2px solid rgba(74, 122, 90, 0.5)' : '2px solid rgba(196, 149, 42, 0.5)', borderBottom: '1px solid var(--stoa-rule-strong)' }}>
                {resolutionPanel}
              </motion.div>
            </>
          )}

          {/* Caso de Inversión — structured financial case */}
          <motion.div variants={depositItem} style={{ marginBottom: 0, padding: isMobile ? '24px 20px' : '24px 0', borderTop: '1px solid var(--stoa-rule-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--stoa-rule)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--stoa-ink-2)' }}>
                Caso de Inversión
              </span>
              {!isSettled && (
                <button
                  onClick={editingBusinessCase ? () => setEditingBusinessCase(false) : openBusinessCaseEditor}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  {editingBusinessCase ? 'Cancelar' : (decision.businessCase ? 'Editar' : '+ Completar')}
                </button>
              )}
            </div>

            {editingBusinessCase ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  {[
                    { label: 'Coste del problema actual (€/año)', value: bcCoste, set: setBcCoste, hint: 'Lo que cuesta NO actuar' },
                    { label: 'Inversión requerida (€ total)', value: bcInversion, set: setBcInversion, hint: 'Capex + opex primer año' },
                    { label: 'Retorno esperado (€/año)', value: bcRetorno, set: setBcRetorno, hint: 'Ahorro o ingreso incremental' },
                  ].map(({ label, value, set, hint }) => (
                    <div key={label}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>{label}</span>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        placeholder={hint}
                        style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-gold)', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' as const }}
                      />
                    </div>
                  ))}
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>Nivel de confianza</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['Bajo', 'Medio', 'Alto'] as const).map((nivel) => (
                        <button
                          key={nivel}
                          onClick={() => setBcConfianza(nivel)}
                          style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 10, color: bcConfianza === nivel ? 'var(--stoa-bg)' : 'var(--stoa-ink-3)', backgroundColor: bcConfianza === nivel ? 'var(--stoa-gold)' : 'transparent', border: `1px solid ${bcConfianza === nivel ? 'var(--stoa-gold)' : 'var(--stoa-rule-strong)'}`, padding: '6px 0', cursor: 'pointer', letterSpacing: '0.04em' }}
                        >
                          {nivel}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {bcInversion && bcRetorno && parseFloat(bcRetorno) > 0 && (
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(196, 149, 42, 0.05)', border: '1px solid var(--stoa-rule)', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)' }}>
                      Payback estimado: {Math.round((parseFloat(bcInversion) / (parseFloat(bcRetorno) / 12)) * 10) / 10} meses
                    </span>
                  </div>
                )}
                <button onClick={handleSaveBusinessCase} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', background: 'none', border: '1px solid var(--stoa-gold)', padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.04em' }}>
                  Guardar caso de inversión
                </button>
              </div>
            ) : decision.businessCase ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 1, backgroundColor: 'var(--stoa-rule)', marginBottom: 12 }}>
                  {[
                    { label: 'Coste del problema', value: decision.businessCase.costeProblemActual, suffix: '€/año', color: 'var(--stoa-amber)' },
                    { label: 'Inversión requerida', value: decision.businessCase.inversionRequerida, suffix: '€ total', color: 'var(--stoa-ink-2)' },
                    { label: 'Retorno esperado', value: decision.businessCase.retornoEsperado, suffix: '€/año', color: 'var(--stoa-resolve)' },
                    { label: 'Payback', value: decision.businessCase.paybackMeses, suffix: 'meses', color: 'var(--stoa-gold)' },
                  ].map(({ label, value, suffix, color }) => (
                    <div key={label} style={{ backgroundColor: 'var(--stoa-surface-1)', padding: '12px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>{label}</span>
                      {value != null ? (
                        <>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 15 : 18, color, fontWeight: 500, display: 'block', lineHeight: 1.1 }}>
                            {value >= 1000000
                              ? `${(value / 1000000).toFixed(1)}M`
                              : value >= 1000
                              ? `${(value / 1000).toFixed(0)}k`
                              : value}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginTop: 2, display: 'block' }}>{suffix}</span>
                        </>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>—</span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>CONFIANZA</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em',
                    color: decision.businessCase.confianza === 'Alto' ? 'var(--stoa-resolve)' : decision.businessCase.confianza === 'Medio' ? 'var(--stoa-gold)' : 'var(--stoa-amber)',
                    border: `1px solid ${decision.businessCase.confianza === 'Alto' ? 'var(--stoa-resolve)' : decision.businessCase.confianza === 'Medio' ? 'var(--stoa-gold)' : 'var(--stoa-amber)'}`,
                    padding: '2px 8px',
                  }}>
                    {decision.businessCase.confianza.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', border: '1px dashed var(--stoa-rule-strong)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 3px' }}>Caso de inversión no completado</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0 }}>Añade los números financieros para llevar esto a tu comité de dirección.</p>
                </div>
                {!isSettled && (
                  <button onClick={openBusinessCaseEditor} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', background: 'none', border: '1px solid var(--stoa-gold)', padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.04em', flexShrink: 0, marginLeft: 16 }}>
                    + Completar
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* KPIs con puente financiero */}
          <motion.div variants={depositItem} style={{ marginBottom: 0, padding: isMobile ? '24px 20px' : '24px 0', borderTop: '1px solid var(--stoa-rule-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--stoa-rule)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--stoa-ink-2)' }}>
                  Indicadores
                </span>
                {(() => {
                  const total = (decision.kpis ?? []).reduce((s, k) => s + (k.deltaEuros ?? 0), 0)
                  if (total > 0) return (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-resolve)', fontWeight: 500 }}>
                      {total >= 1000000 ? `€${(total / 1000000).toFixed(1)}M` : `€${(total / 1000).toFixed(0)}k`} potencial
                    </span>
                  )
                  return null
                })()}
              </div>
              {!isSettled && (
                <button
                  onClick={() => editingKpiId ? setEditingKpiId(null) : openKpiEditor()}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  {editingKpiId ? 'Cancelar' : '+ Añadir KPI'}
                </button>
              )}
            </div>

            {/* KPI editor */}
            {editingKpiId && (
              <div style={{ marginBottom: 16, padding: '14px', border: '1px solid var(--stoa-gold)', backgroundColor: 'rgba(196,149,42,0.04)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>Nombre del KPI</span>
                    <input value={kpiNombre} onChange={e => setKpiNombre(e.target.value)} placeholder="Ej: Tiempo de formulación" style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '6px 10px', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>Unidad</span>
                    <input value={kpiUnidad} onChange={e => setKpiUnidad(e.target.value)} placeholder="semanas, %, días…" style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '6px 10px', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                  {[
                    { label: 'Valor actual', value: kpiBaseline, set: setKpiBaseline, placeholder: '8' },
                    { label: '€ por unidad', value: kpiEuroUnidad, set: setKpiEuroUnidad, placeholder: '45000' },
                    { label: 'Valor objetivo', value: kpiObjetivo, set: setKpiObjetivo, placeholder: '3' },
                    { label: 'Delta en € (total)', value: kpiDelta, set: setKpiDelta, placeholder: 'Auto si vacío' },
                  ].map(({ label, value, set, placeholder }) => (
                    <div key={label}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>{label}</span>
                      <input type="number" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' as const }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>Fecha de medición</span>
                    <input value={kpiFecha} onChange={e => setKpiFecha(e.target.value)} placeholder="Q4 2026" style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>Responsable</span>
                    <input value={kpiResponsable} onChange={e => setKpiResponsable(e.target.value)} placeholder="Quién mide" style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '6px 8px', outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                </div>
                {kpiBaseline && kpiEuroUnidad && kpiObjetivo && !kpiDelta && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', margin: '0 0 10px' }}>
                    Delta auto: €{Math.abs(parseFloat(kpiObjetivo) - parseFloat(kpiBaseline)) * parseFloat(kpiEuroUnidad) | 0}
                  </p>
                )}
                <button onClick={handleSaveKpi} disabled={!kpiNombre.trim()} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: kpiNombre.trim() ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)', background: 'none', border: `1px solid ${kpiNombre.trim() ? 'var(--stoa-gold)' : 'var(--stoa-rule)'}`, padding: '5px 12px', cursor: kpiNombre.trim() ? 'pointer' : 'default', letterSpacing: '0.04em' }}>
                  Guardar indicador
                </button>
              </div>
            )}

            {/* KPI list */}
            {(decision.kpis ?? []).length > 0 ? (
              <div>
                {(decision.kpis ?? []).map((kpi, i) => (
                  <div key={kpi.id} style={{ padding: '13px 0', borderBottom: i < (decision.kpis!.length - 1) ? '1px solid var(--stoa-rule)' : undefined }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.3 }}>
                            {kpi.nombre}
                          </p>
                          {kpi.deltaEuros != null && kpi.deltaEuros > 0 && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-resolve)', fontWeight: 500, flexShrink: 0 }}>
                              {kpi.deltaEuros >= 1000000
                                ? `+€${(kpi.deltaEuros / 1000000).toFixed(1)}M`
                                : `+€${(kpi.deltaEuros / 1000).toFixed(0)}k`}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '3px 14px', alignItems: 'center' }}>
                          {kpi.baselineValor != null && kpi.objetivoValor != null && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>
                              {kpi.baselineValor} → {kpi.objetivoValor} {kpi.unidad}
                            </span>
                          )}
                          {kpi.baselineEuroUnidad != null && kpi.baselineEuroUnidad > 0 && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                              €{kpi.baselineEuroUnidad >= 1000 ? `${(kpi.baselineEuroUnidad/1000).toFixed(0)}k` : kpi.baselineEuroUnidad}/un.
                            </span>
                          )}
                          {kpi.fechaMedicion && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{kpi.fechaMedicion}</span>}
                          {kpi.responsable && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{kpi.responsable}</span>}
                        </div>
                      </div>
                      {!isSettled && (
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                          <button onClick={() => openKpiEditor(kpi)} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', padding: '2px 0' }}>Editar</button>
                          <button onClick={() => handleDeleteKpi(kpi.id)} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', padding: '2px 0' }}>Borrar</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !editingKpiId && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.55 }}>
                  Sin indicadores financieros. Añade KPIs para explicar de dónde viene el retorno esperado.
                </p>
              )
            )}
          </motion.div>

          {/* Cierre del ciclo — verification of actual results */}
          {isSettled && (
            <motion.div variants={depositItem} style={{ padding: isMobile ? '24px 20px' : '24px 0', borderTop: '1px solid var(--stoa-rule-strong)' }}>
              {decision.actualResults ? (
                // ── Results registered ──────────────────────────────────────
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--stoa-rule)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--stoa-resolve)' }}>
                        Resultados reales
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>
                        {(() => {
                          const d = new Date(decision.actualResults.registeredAt)
                          return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
                        })()}
                      </span>
                    </div>
                    <button onClick={openResultsForm} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                      Actualizar
                    </button>
                  </div>

                  {/* Financial variance */}
                  {decision.actualResults.retornoReal != null && decision.businessCase?.retornoEsperado != null && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, backgroundColor: 'var(--stoa-rule)', marginBottom: 14 }}>
                      {[
                        { label: 'Retorno esperado', value: decision.businessCase.retornoEsperado, color: 'var(--stoa-ink-2)' },
                        { label: 'Retorno real', value: decision.actualResults.retornoReal, color: 'var(--stoa-resolve)' },
                        {
                          label: 'Varianza',
                          value: null,
                          pct: decision.actualResults.varianzaPct,
                          color: (decision.actualResults.varianzaPct ?? 0) >= -10
                            ? 'var(--stoa-resolve)'
                            : (decision.actualResults.varianzaPct ?? 0) >= -30
                            ? 'var(--stoa-amber)'
                            : 'var(--stoa-critical)',
                        },
                      ].map(({ label, value, pct, color }) => (
                        <div key={label} style={{ backgroundColor: 'var(--stoa-surface-1)', padding: '10px 12px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>{label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color, fontWeight: 500 }}>
                            {pct != null
                              ? `${pct >= 0 ? '+' : ''}${pct}%`
                              : value != null
                                ? value >= 1000000
                                  ? `€${(value/1000000).toFixed(1)}M`
                                  : `€${(value/1000).toFixed(0)}k`
                                : '—'
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* KPI results vs targets */}
                  {decision.kpis && decision.actualResults.kpiResults.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      {decision.kpis.map(kpi => {
                        const result = decision.actualResults!.kpiResults.find(r => r.kpiId === kpi.id)
                        if (!result || result.valorAlcanzado == null) return null
                        const reached = result.valorAlcanzado
                        const target = kpi.objetivoValor
                        const baseline = kpi.baselineValor
                        const improving = target != null && baseline != null ? (target < baseline ? reached <= target : reached >= target) : null
                        return (
                          <div key={kpi.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--stoa-rule)' }}>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', flex: 1 }}>{kpi.nombre}</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                                {kpi.baselineValor} → {kpi.objetivoValor} {kpi.unidad}
                              </span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: improving === true ? 'var(--stoa-resolve)' : improving === false ? 'var(--stoa-amber)' : 'var(--stoa-ink-2)', fontWeight: 500 }}>
                                {reached} {kpi.unidad}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Hypothesis status + narrative */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: decision.actualResults.narrativa ? 10 : 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>HIPÓTESIS</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
                      color: decision.actualResults.hypothesisStatus === 'confirmada' ? 'var(--stoa-resolve)'
                        : decision.actualResults.hypothesisStatus === 'refutada' ? 'var(--stoa-amber)'
                        : 'var(--stoa-ink-2)',
                      border: `1px solid ${decision.actualResults.hypothesisStatus === 'confirmada' ? 'var(--stoa-resolve)' : decision.actualResults.hypothesisStatus === 'refutada' ? 'var(--stoa-amber)' : 'var(--stoa-rule-strong)'}`,
                      padding: '2px 8px',
                    }}>
                      {decision.actualResults.hypothesisStatus}
                    </span>
                  </div>
                  {decision.actualResults.narrativa && (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6, borderLeft: '2px solid var(--stoa-resolve)', paddingLeft: 12 }}>
                      {decision.actualResults.narrativa}
                    </p>
                  )}
                </div>
              ) : (
                // ── Pending verification ────────────────────────────────────
                <div>
                  <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--stoa-rule)' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: reviewHorizonPassed(decision.businessImpact.reviewHorizon) ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)' }}>
                      Verificar resultados
                    </span>
                    {(() => {
                      const daysLeft = reviewHorizonDaysLeft(decision.businessImpact.reviewHorizon)
                      if (daysLeft == null) return null
                      if (daysLeft < 0) return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', marginLeft: 10, letterSpacing: '0.05em' }}>Horizonte superado hace {Math.abs(daysLeft)}d</span>
                      if (daysLeft <= 30) return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', marginLeft: 10, letterSpacing: '0.05em' }}>En {daysLeft} días</span>
                      return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginLeft: 10, letterSpacing: '0.05em' }}>{decision.businessImpact.reviewHorizon}</span>
                    })()}
                  </div>
                  {!showResultsForm ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: `1px dashed ${reviewHorizonPassed(decision.businessImpact.reviewHorizon) ? 'var(--stoa-amber)' : 'var(--stoa-rule-strong)'}` }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 3px' }}>¿Qué ocurrió realmente?</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0 }}>
                          Retorno esperado: {decision.businessCase?.retornoEsperado != null
                            ? (decision.businessCase.retornoEsperado >= 1000000
                              ? `€${(decision.businessCase.retornoEsperado/1000000).toFixed(1)}M/año`
                              : `€${(decision.businessCase.retornoEsperado/1000).toFixed(0)}k/año`)
                            : 'no cuantificado'}
                        </p>
                      </div>
                      <button onClick={openResultsForm} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: reviewHorizonPassed(decision.businessImpact.reviewHorizon) ? 'var(--stoa-amber)' : 'var(--stoa-gold)', background: 'none', border: `1px solid ${reviewHorizonPassed(decision.businessImpact.reviewHorizon) ? 'var(--stoa-amber)' : 'var(--stoa-gold)'}`, padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.04em', flexShrink: 0, marginLeft: 16 }}>
                        Registrar resultados →
                      </button>
                    </div>
                  ) : (
                    // Results form
                    <div style={{ border: '1px solid var(--stoa-gold)', padding: '16px', backgroundColor: 'rgba(196,149,42,0.03)' }}>
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                          Retorno real obtenido (€/año)
                        </span>
                        <input
                          type="number"
                          value={resRetornoReal}
                          onChange={e => setResRetornoReal(e.target.value)}
                          placeholder={decision.businessCase?.retornoEsperado != null ? `Esperado: ${decision.businessCase.retornoEsperado}` : 'Introduce el retorno real en €/año'}
                          style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '7px 10px', outline: 'none', boxSizing: 'border-box' as const }}
                        />
                        {resRetornoReal && decision.businessCase?.retornoEsperado != null && (
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: (parseFloat(resRetornoReal) / decision.businessCase.retornoEsperado - 1) >= -0.1 ? 'var(--stoa-resolve)' : 'var(--stoa-amber)', margin: '4px 0 0' }}>
                            Varianza: {((parseFloat(resRetornoReal) / decision.businessCase.retornoEsperado - 1) * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>

                      {/* KPI actual values */}
                      {(decision.kpis ?? []).length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>
                            Valores reales alcanzados
                          </span>
                          {(decision.kpis ?? []).map(kpi => (
                            <div key={kpi.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', flex: 1, minWidth: 0 }}>{kpi.nombre}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', flexShrink: 0 }}>Obj: {kpi.objetivoValor} {kpi.unidad}</span>
                              <input
                                type="number"
                                value={resKpiValues[kpi.id] ?? ''}
                                onChange={e => setResKpiValues(prev => ({ ...prev, [kpi.id]: e.target.value }))}
                                placeholder="Real"
                                style={{ width: 80, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '5px 8px', outline: 'none', flexShrink: 0, textAlign: 'right' as const }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hypothesis status */}
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>
                          ¿La hipótesis se cumplió?
                        </span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                          {(['confirmada', 'parcialmente confirmada', 'refutada', 'inconclusa'] as HypothesisStatus[]).map(s => (
                            <button
                              key={s}
                              onClick={() => setResHypStatus(s)}
                              style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', color: resHypStatus === s ? 'var(--stoa-bg)' : 'var(--stoa-ink-3)', backgroundColor: resHypStatus === s ? (s === 'confirmada' ? 'var(--stoa-resolve)' : s === 'refutada' ? 'var(--stoa-amber)' : 'var(--stoa-gold)') : 'transparent', border: `1px solid ${resHypStatus === s ? (s === 'confirmada' ? 'var(--stoa-resolve)' : s === 'refutada' ? 'var(--stoa-amber)' : 'var(--stoa-gold)') : 'var(--stoa-rule-strong)'}`, padding: '4px 10px', cursor: 'pointer' }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Narrative */}
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                          Qué ocurrió · aprendizaje para el portfolio
                        </span>
                        <textarea
                          value={resNarrativa}
                          onChange={e => setResNarrativa(e.target.value)}
                          rows={3}
                          placeholder="Describe brevemente los resultados reales y qué aprendió la organización…"
                          style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-rule-strong)', padding: '8px 10px', outline: 'none', resize: 'vertical' as const, lineHeight: 1.5, boxSizing: 'border-box' as const }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={handleSaveResults} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', background: 'none', border: '1px solid var(--stoa-gold)', padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.04em' }}>
                          Registrar resultados
                        </button>
                        <button onClick={() => setShowResultsForm(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Marco de Impacto — reference zone */}
          <motion.div variants={depositItem} style={{ marginBottom: 32, padding: isMobile ? '28px 20px 0' : '24px 0 0', borderTop: '1px solid var(--stoa-rule-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--stoa-rule)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--stoa-ink-3)' }}>
                Impacto Financiero
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: decision.businessImpact.evidenceStatus === 'Sin datos' ? 'var(--stoa-ink-3)' : 'var(--stoa-gold)', letterSpacing: '0.06em' }}>
                Evidencia: {decision.businessImpact.evidenceStatus}
              </span>
            </div>


            {/* Hipótesis editable */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                  Hipótesis de impacto
                </span>
                {!isSettled && (
                  <button
                    onClick={() => { setHypothesisText(decision.businessImpact.hypothesis); setEditingHypothesis(!editingHypothesis) }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    {editingHypothesis ? 'Cancelar' : 'Editar'}
                  </button>
                )}
              </div>
              {editingHypothesis ? (
                <div>
                  <textarea
                    value={hypothesisText}
                    onChange={(e) => setHypothesisText(e.target.value)}
                    rows={3}
                    style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', backgroundColor: 'var(--stoa-bg)', border: '1px solid var(--stoa-gold)', padding: '9px 12px', outline: 'none', resize: 'vertical' as const, lineHeight: 1.5, boxSizing: 'border-box' as const }}
                  />
                  <button onClick={handleSaveHypothesis} style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', background: 'none', border: '1px solid var(--stoa-gold)', padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.04em' }}>
                    Guardar
                  </button>
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6, borderLeft: '2px solid var(--stoa-gold)', paddingLeft: 12 }}>
                  {decision.businessImpact.hypothesis}
                </p>
              )}
            </div>

            {/* Palanca */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                Palanca de cuenta de explotación
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)' }}>
                {decision.businessImpact.plLever}
              </span>
            </div>

            {/* Indicators grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>
                  Indicadores tempranos
                </span>
                {decision.businessImpact.leadingIndicators.map((ind, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)', marginTop: 6, flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.45 }}>{ind}</p>
                  </div>
                ))}
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>
                  Indicadores finales
                </span>
                {decision.businessImpact.laggingIndicators.map((ind, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--stoa-ink-3)', marginTop: 6, flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.45 }}>{ind}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riesgo de no actuar */}
            <div style={{ padding: '10px 14px', borderLeft: '2px solid var(--stoa-amber)', backgroundColor: 'rgba(181, 98, 26, 0.03)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                Riesgo de no actuar
              </span>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55 }}>
                {decision.businessImpact.riskOfInaction}
              </p>
            </div>
          </motion.div>

          {/* IA Presionadora */}
          <motion.div variants={depositItem} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: showAnalysis ? 14 : 0, paddingBottom: showAnalysis ? 10 : 0, borderBottom: showAnalysis ? '1px solid var(--stoa-rule)' : undefined }}>
              <div>
                <SectionHeader label="IA Presionadora" />
                {!showAnalysis && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '4px 0 0', lineHeight: 1.4 }}>
                    Cuestiona supuestos financieros antes del comité de dirección
                  </p>
                )}
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analysisLoading}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: analysisLoading ? 'var(--stoa-ink-3)' : 'var(--stoa-gold)',
                  background: 'none',
                  border: `1px solid ${analysisLoading ? 'var(--stoa-rule)' : 'var(--stoa-gold)'}`,
                  padding: '5px 12px',
                  cursor: analysisLoading ? 'default' : 'pointer',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {analysisLoading ? 'Analizando…' : showAnalysis ? 'Reanalizar' : 'Presionar supuestos →'}
              </button>
            </div>

            {showAnalysis && (
              <div>
                {/* Cost of inaction — always show if we have numbers */}
                {(() => {
                  const bc = decision.businessCase
                  const costPerMonth = bc?.costeProblemActual
                    ? Math.round(bc.costeProblemActual / 12)
                    : bc?.retornoEsperado
                    ? Math.round(bc.retornoEsperado / 12)
                    : null
                  if (!costPerMonth) return null
                  const label = bc?.costeProblemActual ? 'Coste de inacción' : 'Retorno diferido por mes'
                  return (
                    <div style={{ padding: '12px 14px', marginBottom: 14, backgroundColor: 'rgba(181,98,26,0.06)', borderLeft: '3px solid var(--stoa-amber)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)' }}>{label}</span>
                      <div style={{ textAlign: 'right' as const }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--stoa-amber)', fontWeight: 500, display: 'block' }}>
                          {costPerMonth >= 1000000
                            ? `€${(costPerMonth/1000000).toFixed(2)}M`
                            : costPerMonth >= 1000
                            ? `€${(costPerMonth/1000).toFixed(0)}k`
                            : `€${costPerMonth}`}
                          <span style={{ fontSize: 10, fontWeight: 400 }}>/mes</span>
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                          €{Math.round(costPerMonth / 4.3).toLocaleString('es')}/semana
                        </span>
                      </div>
                    </div>
                  )
                })()}

                {/* Observations */}
                {analysisLoading ? (
                  <div style={{ padding: '20px 0' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.05em' }}>
                      Leyendo supuestos financieros…
                    </p>
                  </div>
                ) : (
                  <div>
                    {analysis.map((obs, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < analysis.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: observationColor[obs.type], letterSpacing: '0.07em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 2, minWidth: 110 }}>
                          {obs.type}
                        </span>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                          {obs.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Mobile: metadata at the very bottom */}
          {isMobile && (
            <motion.div variants={depositItem} style={{ padding: '20px 20px 40px', backgroundColor: 'var(--stoa-surface-2)', borderTop: '1px solid var(--stoa-rule-strong)' }}>
              <SectionHeader label="Metadatos" />
              <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {[
                  { label: 'Referencia', value: decision.id },
                  { label: 'Responsable', value: decision.owner || 'Sin asignar' },
                  { label: 'Tipo', value: decision.tipoInnovacion },
                  { label: 'Peso', value: decision.weight },
                  { label: 'Plazo', value: decision.deadline || 'Sin definir' },
                  { label: 'Horizonte', value: decision.businessImpact.reviewHorizon },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '8px 0', borderBottom: '1px solid var(--stoa-rule)' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', display: 'block', marginBottom: 2 }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right: sidebar — desktop only */}
        {!isMobile && (
          <motion.div
            variants={deposit}
            initial="hidden"
            animate="visible"
            style={{
              padding: '28px 40px 40px 24px',
              overflowY: 'auto' as const,
            }}
          >
            {/* Metadata */}
            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Metadatos" />
              <div style={{ marginTop: 10 }}>
                {[
                  { label: 'Referencia', value: decision.id },
                  { label: 'Responsable', value: decision.owner || 'Sin asignar' },
                  { label: 'Tipo', value: decision.tipoInnovacion },
                  { label: 'Peso', value: decision.weight },
                  { label: 'Plazo', value: decision.deadline || 'Sin definir' },
                  { label: 'Horizonte revisión', value: decision.businessImpact.reviewHorizon },
                ].map(({ label, value }, i, arr) => (
                  <div key={label} style={{ padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', display: 'block', marginBottom: 2 }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Conditions */}
            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              {conditionsPanel}
            </motion.div>

            {/* Resolution */}
            <motion.div variants={depositItem}>
              {resolutionPanel}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
