import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecisionsStore } from '../store/decisions'
import { generarDecision, generarDecisionIA } from '../lib/ai'
import type { TipoInnovacion } from '../types'

const TIPOS: Array<{ value: TipoInnovacion; label: string }> = [
  { value: 'tecnología / IA', label: 'Tecnología / IA' },
  { value: 'proceso interno', label: 'Proceso interno' },
  { value: 'eficiencia operativa', label: 'Eficiencia operativa' },
  { value: 'expansión', label: 'Expansión' },
  { value: 'modelo de negocio', label: 'Modelo de negocio' },
  { value: 'experiencia de cliente', label: 'Experiencia de practitioners' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'cultura organizativa', label: 'Cultura organizativa' },
]

const PESOS = ['Menor', 'Significativa', 'Mayor', 'Crítica'] as const
const PLAZOS = ['Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027']

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--stoa-ink)',
  backgroundColor: 'var(--stoa-bg)',
  border: '1px solid var(--stoa-rule-strong)',
  padding: '9px 12px',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  color: 'var(--stoa-ink-3)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 5,
}

export default function NuevaIniciativa() {
  const navigate = useNavigate()
  const { decisions, addDecision, closeCreateModal } = useDecisionsStore()

  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<TipoInnovacion>('tecnología / IA')
  const [peso, setPeso] = useState<'Menor' | 'Significativa' | 'Mayor' | 'Crítica'>('Significativa')
  const [owner, setOwner] = useState('')
  const [deadline, setDeadline] = useState('Q3 2026')
  const [preguntaPreview, setPreguntaPreview] = useState('')
  const [generando, setGenerando] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Live preview of strategic question
  useEffect(() => {
    if (titulo.trim().length > 8) {
      const preview = generarDecision({
        titulo: titulo.trim(),
        tipo,
        weight: peso,
        owner,
        deadline,
        decisions,
      }).preguntaEstrategica
      setPreguntaPreview(preview)
    } else {
      setPreguntaPreview('')
    }
  }, [titulo, tipo])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCreateModal()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeCreateModal])

  function handleGenerar() {
    if (!titulo.trim()) return
    setGenerando(true)
    setTimeout(() => {
      const preview = generarDecision({ titulo: titulo.trim(), tipo, weight: peso, owner, deadline, decisions }).preguntaEstrategica
      setPreguntaPreview(preview)
      setGenerando(false)
    }, 500)
  }

  async function handleSubmit() {
    if (!titulo.trim() || submitted) return
    setSubmitted(true)
    const decision = await generarDecisionIA({
      titulo: titulo.trim(),
      tipo,
      weight: peso,
      owner,
      deadline,
      decisions,
    })
    addDecision(decision)
    closeCreateModal()
    navigate(`/chamber/${decision.id}`)
  }

  const canSubmit = titulo.trim().length > 3

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(12, 12, 14, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal() }}
    >
      <div
        style={{
          backgroundColor: 'var(--stoa-surface-1)',
          border: '1px solid var(--stoa-rule-strong)',
          maxWidth: 600,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 28px 14px',
            borderBottom: '1px solid var(--stoa-rule)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Nueva Iniciativa
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--stoa-ink)', margin: '5px 0 0', lineHeight: 1.2 }}>
              Encuadrar una decisión estratégica
            </h2>
          </div>
          <button
            onClick={closeCreateModal}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginTop: 2 }}
          >
            Cerrar
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '22px 28px 28px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '0 0 22px', lineHeight: 1.6, borderLeft: '1px solid var(--stoa-rule)', paddingLeft: 12 }}>
            STOA convierte iniciativas de innovación en decisiones estructuradas con hipótesis, indicadores y horizonte de revisión. Describe la iniciativa y el sistema generará la pregunta estratégica y el marco de impacto.
          </p>

          {/* Nombre */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Nombre de la iniciativa</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Aplicar IA al proceso de selección de founders"
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Tipo */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Tipo de innovación</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoInnovacion)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value} style={{ backgroundColor: '#111115' }}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* AI Preview of strategic question */}
          {preguntaPreview && (
            <div style={{ marginBottom: 18, padding: '12px 14px', borderLeft: '2px solid var(--stoa-gold)', backgroundColor: 'rgba(196, 149, 42, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Análisis del sistema · Pregunta estratégica sugerida
                </span>
                <button
                  onClick={handleGenerar}
                  disabled={generando}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  {generando ? 'Analizando…' : 'Regenerar'}
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
                {preguntaPreview}
              </p>
            </div>
          )}

          {/* Row: Peso + Plazo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Peso estratégico</label>
              <select
                value={peso}
                onChange={(e) => setPeso(e.target.value as typeof peso)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {PESOS.map((p) => (
                  <option key={p} value={p} style={{ backgroundColor: '#111115' }}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Plazo</label>
              <select
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {PLAZOS.map((p) => (
                  <option key={p} value={p} style={{ backgroundColor: '#111115' }}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Responsable */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Responsable</label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Nombre y apellido"
              style={inputStyle}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--stoa-rule)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.03em' }}>
              STOA generará hipótesis, indicadores y condiciones de resolución automáticamente.
            </p>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button
                onClick={closeCreateModal}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', background: 'none', border: '1px solid var(--stoa-rule)', padding: '8px 16px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitted}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: canSubmit ? 'var(--stoa-bg)' : 'var(--stoa-ink-3)',
                  backgroundColor: canSubmit ? 'var(--stoa-gold)' : 'var(--stoa-rule)',
                  border: 'none',
                  padding: '8px 20px',
                  cursor: canSubmit ? 'pointer' : 'default',
                  letterSpacing: '0.02em',
                  opacity: submitted ? 0.7 : 1,
                }}
              >
                {submitted ? 'Analizando…' : 'Crear iniciativa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
