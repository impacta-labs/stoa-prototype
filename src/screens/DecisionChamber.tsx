import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore, daysActive } from '../store/decisions'
import { analizarDecision } from '../lib/ai'
import type { AIObservation } from '../types'

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

function PilotHint({ text }: { text: string }) {
  const pilotMode = useDecisionsStore((s) => s.pilotMode)
  if (!pilotMode) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', backgroundColor: 'rgba(196, 149, 42, 0.05)', borderLeft: '2px solid var(--stoa-gold)', marginBottom: 10 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, flexShrink: 0 }}>Modo Piloto</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{text}</span>
    </div>
  )
}

export default function DecisionChamber() {
  const { id } = useParams<{ id: string }>()
  const isMobile = useIsMobile()
  const { decisions, settleDecision, markConditionSatisfied, addDeliberationEntry, updateDecision } = useDecisionsStore()
  const decision = decisions.find((d) => d.id === id)

  const [verdictState, setVerdictState] = useState<VerdictState>('open')
  const [selectedVerdict, setSelectedVerdict] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysis, setAnalysis] = useState<AIObservation[]>([])
  const [deliberationText, setDeliberationText] = useState('')
  const [deliberationParticipant, setDeliberationParticipant] = useState('')
  const [editingHypothesis, setEditingHypothesis] = useState(false)
  const [hypothesisText, setHypothesisText] = useState('')
  const [prediccionText, setPrediccionText] = useState('')

  const isSettled = decision ? (decision.status === 'resuelta' || verdictState === 'settled') : false
  const days = decision ? daysActive(decision.opened) : 0
  const conditionsMet = decision ? decision.resolutionConditions.filter((c) => c.satisfied).length : 0

  if (!decision) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: '60px 40px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          Decisión no encontrada
        </span>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--stoa-ink-2)', margin: 0, textAlign: 'center' as const }}>
          La decisión {id} no existe en el sistema.
        </p>
      </div>
    )
  }

  function handleAnalyze() {
    const obs = analizarDecision(decision!)
    setAnalysis(obs)
    setShowAnalysis(true)
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 18 : 22, fontWeight: 400, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.25, maxWidth: 720, letterSpacing: '-0.01em' }}>
            {decision.preguntaEstrategica}
          </h1>
        </motion.div>
      </div>

      {/* Lifecycle */}
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
            padding: isMobile ? '24px 20px' : '28px 32px 40px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            overflowY: 'auto',
          }}
        >
          {/* Deliberation — first, because this is where the session happens */}
          <motion.div variants={depositItem} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <SectionHeader label="Deliberación" meta={`${decision.deliberationEntries.length} entrada${decision.deliberationEntries.length !== 1 ? 's' : ''}`} />
              {isSettled && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
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

          {/* Impacto en Negocio */}
          <motion.div variants={depositItem} style={{ marginBottom: 32, paddingTop: 24, borderTop: '1px solid var(--stoa-rule)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <SectionHeader label="Marco de Impacto" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: decision.businessImpact.evidenceStatus === 'Sin datos' ? 'var(--stoa-ink-3)' : 'var(--stoa-gold)', letterSpacing: '0.06em' }}>
                Evidencia: {decision.businessImpact.evidenceStatus}
              </span>
            </div>

            <PilotHint text="Vincula la iniciativa a la cuenta de explotación. Hipótesis, indicadores y riesgo de no actuar." />

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

          {/* AI Analysis */}
          <motion.div variants={depositItem} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: showAnalysis ? 14 : 0 }}>
              <SectionHeader label="Análisis del Sistema" />
              <button
                onClick={handleAnalyze}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--stoa-ink-3)',
                  background: 'none',
                  border: '1px solid var(--stoa-rule)',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                Analizar decisión
              </button>
            </div>
            {showAnalysis && (
              <div style={{ marginTop: 14 }}>
                <PilotHint text="El sistema identifica qué falta para que esta decisión sea revisable y cerrable." />
                {analysis.map((obs, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < analysis.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: observationColor[obs.type], letterSpacing: '0.07em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 2, minWidth: 100 }}>
                      {obs.type}
                    </span>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55 }}>
                      {obs.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Right: sidebar */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '24px 20px' : '28px 40px 40px 24px',
            overflowY: 'auto',
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

          {/* Resolution Conditions */}
          <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <SectionHeader label="Condiciones de resolución" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: conditionsMet === decision.resolutionConditions.length && decision.resolutionConditions.length > 0 ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)' }}>
                {conditionsMet}/{decision.resolutionConditions.length}
              </span>
            </div>
            {!isSettled && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 10px', letterSpacing: '0.04em' }}>
                Pulsa cada condición para marcarla como cumplida
              </p>
            )}
            <div>
              {decision.resolutionConditions.map((cond) => (
                <div
                  key={cond.id}
                  onClick={() => !isSettled && markConditionSatisfied(decision.id, cond.id, !cond.satisfied)}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--stoa-rule)', cursor: isSettled ? 'default' : 'pointer' }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: cond.satisfied ? 'var(--stoa-resolve)' : 'transparent', border: `1.5px solid ${cond.satisfied ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)'}`, flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cond.satisfied && <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--stoa-bg)' }} />}
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: cond.satisfied ? 'var(--stoa-ink-3)' : 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.4, textDecoration: cond.satisfied ? 'line-through' : 'none' }}>
                    {cond.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resolution */}
          <motion.div variants={depositItem}>
            {isSettled ? (
              <div>
                <SectionHeader label="Resolución registrada" />
                <div style={{ marginTop: 10, padding: '12px 14px', borderLeft: '2px solid var(--stoa-resolve)' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.55 }}>
                    {decision.selectedVerdict || selectedVerdict}
                  </p>
                </div>
                {(decision.prediccion || prediccionText) && (
                  <div style={{ marginTop: 8, padding: '10px 14px', borderLeft: '2px solid var(--stoa-ink-3)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                      Predicción vinculada
                    </span>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55 }}>
                      {decision.prediccion || prediccionText}
                    </p>
                  </div>
                )}
                <div style={{ marginTop: 10, padding: '10px 14px', backgroundColor: 'var(--stoa-surface-1)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                    Decisión archivada en Memoria Estratégica
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                    Revisión de evidencia: {decision.businessImpact.reviewHorizon}
                  </span>
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--stoa-rule)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 10 }}>
                    ¿Qué sigue?
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '8px 12px', border: '1px solid var(--stoa-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>Ver el Atrio</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>→</span>
                      </div>
                    </Link>
                    <Link to="/reading-room" style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '8px 12px', border: '1px solid var(--stoa-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>Revisar el Archivo</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>→</span>
                      </div>
                    </Link>
                    <Link to="/chamber" style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '8px 12px', border: '1px solid var(--stoa-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>Abrir otra decisión</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>→</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <SectionHeader label="Cerrar decisión" />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '6px 0 0', letterSpacing: '0.04em', lineHeight: 1.6 }}>
                    1 · Selecciona o escribe la resolución<br />
                    2 · Añade una predicción (opcional)<br />
                    3 · Registra para archivar
                  </p>
                </div>
                <PilotHint text="La resolución y la predicción quedan en el Archivo Estratégico como precedente." />
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
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
