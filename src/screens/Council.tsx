import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle } from '../lib/motion'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore } from '../store/decisions'
import { useOrgStore } from '../store/org'
import { generarResumenConsejoIA } from '../lib/ai'
import type { UserDecision } from '../types'

const ROMAN = ['I', 'II', 'III']

const STATIONS = [
  {
    id: 'revision',
    label: 'En Revisión',
    description: 'Iniciativas activas. Hipótesis, indicadores y estado de deliberación.',
  },
  {
    id: 'resueltas',
    label: 'Resueltas',
    description: 'Decisiones cerradas con veredicto registrado y predicción de impacto.',
  },
  {
    id: 'cierre',
    label: 'Cierre',
    description: 'Acciones pendientes, condiciones sin cumplir y registro de sesión.',
  },
]

function DecisionRevisionCard({ decision }: { decision: UserDecision }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/chamber/${decision.id}`)}
      style={{
        padding: '18px 0',
        borderBottom: '1px solid var(--stoa-rule)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap' as const }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.08em' }}>
          {decision.id}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
          {decision.tipoInnovacion}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
          {decision.weight}
        </span>
        {decision.owner && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
            {decision.owner}
          </span>
        )}
        {decision.deadline && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.04em' }}>
            {decision.deadline}
          </span>
        )}
      </div>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 15,
        color: 'var(--stoa-ink)',
        margin: '0 0 10px',
        lineHeight: 1.55,
        fontStyle: 'italic',
      }}>
        {decision.preguntaEstrategica}
      </p>
      {decision.businessImpact.hypothesis && (
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--stoa-ink-3)',
          margin: '0 0 8px',
          lineHeight: 1.55,
        }}>
          {decision.businessImpact.hypothesis.slice(0, 140)}{decision.businessImpact.hypothesis.length > 140 ? '…' : ''}
        </p>
      )}
      {decision.businessImpact.leadingIndicators.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {decision.businessImpact.leadingIndicators.slice(0, 2).map((ind, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--stoa-ink-3)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--stoa-rule)',
              padding: '2px 8px',
              letterSpacing: '0.02em',
            }}>
              {ind.slice(0, 60)}{ind.length > 60 ? '…' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function DecisionResolvedCard({ decision }: { decision: UserDecision }) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid var(--stoa-rule)' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6, flexWrap: 'wrap' as const }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em' }}>
          {decision.id}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
          {decision.tipoInnovacion}
        </span>
        {decision.owner && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
            {decision.owner}
          </span>
        )}
      </div>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink)', margin: '0 0 10px', lineHeight: 1.5 }}>
        {decision.preguntaEstrategica}
      </p>
      {decision.selectedVerdict && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0, paddingTop: 3 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Acordado
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.6, flex: 1 }}>
            {decision.selectedVerdict}
          </p>
        </div>
      )}
      {decision.prediccion && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, flexShrink: 0, width: 65, paddingTop: 2 }}>
            Predicción
          </span>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55, flex: 1 }}>
            {decision.prediccion}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
        {decision.businessImpact.reviewHorizon && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
            Revisión: {decision.businessImpact.reviewHorizon}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Council() {
  const [activeStation, setActiveStation] = useState('revision')
  const [showSummary, setShowSummary] = useState(false)
  const [summaryText, setSummaryText] = useState('')
  const [loadingSum, setLoadingSum] = useState(false)
  const [copied, setCopied] = useState(false)
  const isMobile = useIsMobile()
  const { decisions } = useDecisionsStore()
  const { name: orgName } = useOrgStore()

  const activas = decisions.filter((d) => d.status === 'evaluacion' || d.status === 'deliberando')
  const resueltas = decisions.filter((d) => d.status === 'resuelta')

  const today = new Date()
  const sessionDate = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const sessionRef = `S-${String(today.getFullYear()).slice(2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

  const owners = [...new Set(decisions.map((d) => d.owner).filter(Boolean))]

  const pendingConditions = activas.flatMap((d) =>
    d.resolutionConditions.filter((c) => !c.satisfied).map((c) => ({ decision: d, condition: c }))
  )
  const sinResponsable = decisions.filter((d) => d.status !== 'resuelta' && !d.owner)

  const activeIndex = STATIONS.findIndex((s) => s.id === activeStation)
  const currentStation = STATIONS[activeIndex]
  const isClosing = currentStation.id === 'cierre'

  async function handleOpenSummary() {
    setShowSummary(true)
    setLoadingSum(true)
    setSummaryText('')
    const text = await generarResumenConsejoIA(decisions, sessionRef, sessionDate, orgName)
    setSummaryText(text)
    setLoadingSum(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      {/* Session Header */}
      <div
        style={{
          padding: isMobile ? '14px 20px' : '18px 40px',
          borderBottom: '1px solid var(--stoa-rule-strong)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <motion.div variants={settle}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
              Consejo
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.06em' }}>
              {sessionRef}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                En Sesión
              </span>
            </div>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: isMobile ? 15 : 19,
              fontWeight: 400,
              color: 'var(--stoa-ink)',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.005em',
            }}
          >
            Revisión Estratégica · {activas.length} iniciativa{activas.length !== 1 ? 's' : ''} activa{activas.length !== 1 ? 's' : ''}
            {resueltas.length > 0 ? ` · ${resueltas.length} resuelta${resueltas.length !== 1 ? 's' : ''}` : ''}
          </h1>
        </motion.div>
        {!isMobile && (
          <motion.div variants={settle} style={{ textAlign: 'right' as const }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 2px', letterSpacing: '0.04em' }}>
              {sessionDate}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.03em' }}>
              {decisions.length} decisión{decisions.length !== 1 ? 'es' : ''} en el sistema
            </p>
          </motion.div>
        )}
      </div>

      {/* Main body */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          flexDirection: isMobile ? 'column' as const : 'row' as const,
        }}
      >
        {/* Sidebar / tabs */}
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--stoa-rule)',
              backgroundColor: 'var(--stoa-surface-1)',
              overflowX: 'auto' as const,
              flexShrink: 0,
              scrollbarWidth: 'none' as const,
            }}
          >
            {STATIONS.map((station, i) => {
              const active = station.id === activeStation
              const past = i < activeIndex
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStation(station.id)}
                  style={{
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '2px solid var(--stoa-gold)' : '2px solid transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: active ? 'var(--stoa-gold)' : past ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)' }}>
                      {ROMAN[i]}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: active ? 500 : 400, color: active ? 'var(--stoa-ink)' : 'var(--stoa-ink-3)', whiteSpace: 'nowrap' as const }}>
                      {station.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div
            style={{
              width: 210,
              borderRight: '1px solid var(--stoa-rule)',
              backgroundColor: 'var(--stoa-surface-1)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--stoa-rule)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', margin: '0 0 3px', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                {sessionRef}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)', margin: '0 0 2px' }}>
                {sessionDate}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 10px' }}>
                {activas.length} activa{activas.length !== 1 ? 's' : ''} · {resueltas.length} resuelta{resueltas.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{ flex: 1 }}>
              {STATIONS.map((station, i) => {
                const active = station.id === activeStation
                const past = i < activeIndex
                const count = station.id === 'revision' ? activas.length : station.id === 'resueltas' ? resueltas.length : null
                return (
                  <button
                    key={station.id}
                    onClick={() => setActiveStation(station.id)}
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 18px',
                      textAlign: 'left' as const,
                      background: 'none',
                      border: 'none',
                      borderLeft: active ? '2px solid var(--stoa-gold)' : '2px solid transparent',
                      borderBottom: '1px solid var(--stoa-rule)',
                      cursor: 'pointer',
                      backgroundColor: active ? 'var(--stoa-gold-subtle)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: active ? 'var(--stoa-gold)' : past ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)', width: 18, flexShrink: 0 }}>
                        {ROMAN[i]}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: active ? 500 : 400, color: active ? 'var(--stoa-ink)' : past ? 'var(--stoa-ink-2)' : 'var(--stoa-ink-3)', lineHeight: 1.2, flex: 1 }}>
                        {station.label}
                      </span>
                      {count !== null && count > 0 && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: active ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)' }}>
                          {count}
                        </span>
                      )}
                      {past && count === null && (
                        <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)', flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 0 28px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {station.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div
            style={{
              padding: isMobile ? '14px 20px 12px' : '18px 40px 14px',
              borderBottom: '1px solid var(--stoa-rule)',
              flexShrink: 0,
              backgroundColor: isClosing ? 'var(--stoa-surface-1)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: isClosing ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)', letterSpacing: '0.06em' }}>
                {ROMAN[activeIndex]}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 16 : 19,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {currentStation.label}
              </h2>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.45 }}>
              {currentStation.description}
            </p>
          </div>

          <div style={{ flex: 1, padding: isMobile ? '0 20px' : '0 40px', overflowY: 'auto' as const, backgroundColor: isClosing ? 'rgba(196, 149, 42, 0.02)' : 'transparent' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                {/* En Revisión */}
                {activeStation === 'revision' && (
                  <>
                    {activas.length === 0 ? (
                      <div style={{ padding: '32px 0' }}>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          No hay iniciativas activas en el sistema. Crea una nueva iniciativa desde el Atrio para comenzar la sesión.
                        </p>
                      </div>
                    ) : (
                      activas.map((d) => <DecisionRevisionCard key={d.id} decision={d} />)
                    )}
                  </>
                )}

                {/* Resueltas */}
                {activeStation === 'resueltas' && (
                  <>
                    {resueltas.length === 0 ? (
                      <div style={{ padding: '32px 0' }}>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          Ninguna decisión resuelta en esta sesión. Las decisiones resueltas desde las Cámaras aparecerán aquí.
                        </p>
                      </div>
                    ) : (
                      resueltas.map((d) => <DecisionResolvedCard key={d.id} decision={d} />)
                    )}
                  </>
                )}

                {/* Cierre */}
                {activeStation === 'cierre' && (
                  <div style={{ paddingTop: 8, paddingBottom: 32 }}>
                    {/* Acciones pendientes */}
                    {pendingConditions.length > 0 && (
                      <div style={{ marginBottom: 28 }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '18px 0 10px' }}>
                          Condiciones de resolución pendientes · {pendingConditions.length}
                        </p>
                        {pendingConditions.map(({ decision, condition }, i) => (
                          <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--stoa-rule)', alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, paddingTop: 3 }}>
                              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-amber)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink)', margin: '0 0 4px', lineHeight: 1.5 }}>
                                {condition.label}
                              </p>
                              <div style={{ display: 'flex', gap: 10 }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.05em' }}>
                                  {decision.id}
                                </span>
                                {condition.owner && condition.owner !== 'Por asignar' && (
                                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                                    {condition.owner}
                                  </span>
                                )}
                                {condition.due && condition.due !== 'Por definir' && (
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.03em' }}>
                                    {condition.due}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sin responsable */}
                    {sinResponsable.length > 0 && (
                      <div style={{ marginBottom: 28 }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '18px 0 10px' }}>
                          Sin responsable asignado · {sinResponsable.length}
                        </p>
                        {sinResponsable.map((d) => (
                          <div key={d.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--stoa-rule)', alignItems: 'baseline' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.06em' }}>{d.id}</span>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)' }}>{d.titulo}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Estado si todo OK */}
                    {pendingConditions.length === 0 && sinResponsable.length === 0 && decisions.length > 0 && (
                      <div style={{ padding: '18px 0' }}>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          Todas las iniciativas tienen responsable asignado y las condiciones de resolución están documentadas.
                        </p>
                      </div>
                    )}

                    {decisions.length === 0 && (
                      <div style={{ padding: '18px 0' }}>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          No hay decisiones en el sistema para cerrar.
                        </p>
                      </div>
                    )}

                    {/* Registro de sesión */}
                    {decisions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }}
                        style={{ paddingTop: 20, borderTop: '1px solid var(--stoa-rule)', marginTop: 8 }}
                      >
                        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                            Registro de sesión
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                            {sessionRef} · {sessionDate}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '8px 0 0 12px', lineHeight: 1.6 }}>
                          {activas.length} iniciativa{activas.length !== 1 ? 's' : ''} en evaluación · {resueltas.length} resuelta{resueltas.length !== 1 ? 's' : ''} · {decisions.length} en el sistema.
                          Este registro entrará en la Memoria Estratégica al generar el resumen.
                        </p>
                      </motion.div>
                    )}
                    <div style={{ height: 24 }} />
                  </div>
                )}

                {activeStation !== 'cierre' && <div style={{ height: 24 }} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid var(--stoa-rule)',
          padding: isMobile ? '0 16px' : '0 40px',
          height: isMobile ? 38 : 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--stoa-surface-1)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: isMobile ? 10 : 16, alignItems: 'center', overflow: 'hidden' }}>
          {owners.length > 0 ? (
            owners.map((owner) => (
              <div key={owner} style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 10 : 11, color: 'var(--stoa-ink-2)' }}>
                  {isMobile ? owner.split(' ')[0] : owner}
                </span>
              </div>
            ))
          ) : (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
              Sin participantes registrados
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={handleOpenSummary}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--stoa-ink-3)',
              background: 'none',
              border: '1px solid var(--stoa-rule)',
              padding: '3px 10px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
            }}
          >
            Generar resumen
          </button>
          {!isMobile && (
            <>
              <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                {sessionRef}
              </span>
              <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)' }} />
            </>
          )}
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
            En Sesión
          </span>
        </div>
      </div>

      {/* Summary overlay */}
      {showSummary && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(12,12,14,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSummary(false) }}
        >
          <div style={{ backgroundColor: 'var(--stoa-surface-1)', border: '1px solid var(--stoa-rule-strong)', maxWidth: 620, width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px 12px', borderBottom: '1px solid var(--stoa-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexShrink: 0 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>Resumen del Consejo</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 400, color: 'var(--stoa-ink)', margin: '4px 0 0' }}>
                  {sessionRef} · {sessionDate}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  onClick={handleCopy}
                  disabled={loadingSum || !summaryText}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: copied ? 'var(--stoa-resolve)' : loadingSum ? 'var(--stoa-ink-3)' : 'var(--stoa-gold)',
                    background: 'none',
                    border: '1px solid ' + (copied ? 'var(--stoa-resolve)' : loadingSum ? 'var(--stoa-rule)' : 'var(--stoa-gold)'),
                    padding: '4px 10px',
                    cursor: loadingSum || !summaryText ? 'default' : 'pointer',
                    letterSpacing: '0.04em',
                    opacity: loadingSum ? 0.5 : 1,
                  }}
                >
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <button onClick={() => setShowSummary(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            </div>
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {loadingSum ? (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.04em', lineHeight: 1.7 }}>
                  Generando resumen con IA…
                </p>
              ) : (
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7, letterSpacing: '0.01em' }}>
                  {summaryText}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
