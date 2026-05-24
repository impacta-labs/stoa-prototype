import { useState } from 'react'
import { useOrgStore } from '../store/org'

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

const SECTORES = [
  'Aceleración / inversión',
  'Consultoría estratégica',
  'Empresa de tecnología',
  'Organización cultural',
  'Institución educativa',
  'Empresa industrial',
  'Empresa de servicios',
  'Otro',
]

export default function OrgSetup({ isFirstTime }: { isFirstTime?: boolean }) {
  const { configure, closeSetup, isConfigured } = useOrgStore()
  const [name, setName] = useState('')
  const [sector, setSector] = useState(SECTORES[0])
  const [context, setContext] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = name.trim().length > 1

  function handleSubmit() {
    if (!canSubmit || submitted) return
    setSubmitted(true)
    configure(name.trim(), sector, context.trim())
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        backgroundColor: isFirstTime ? 'var(--stoa-bg)' : 'rgba(12, 12, 14, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (!isFirstTime && e.target === e.currentTarget) closeSetup()
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--stoa-surface-1)',
          border: '1px solid var(--stoa-rule-strong)',
          maxWidth: 520,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '28px 32px 20px',
            borderBottom: '1px solid var(--stoa-rule)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
            {isFirstTime ? 'Configuración inicial' : 'Configuración de organización'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, color: 'var(--stoa-ink)', margin: '8px 0 0', lineHeight: 1.2 }}>
            {isFirstTime ? 'Bienvenido a STOA' : 'Actualizar organización'}
          </h2>
          {isFirstTime && (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '10px 0 0', lineHeight: 1.65, borderLeft: '1px solid var(--stoa-rule)', paddingLeft: 12 }}>
              STOA convierte las decisiones estratégicas de tu organización en hipótesis medibles con indicadores y horizonte de revisión. Antes de comenzar, dinos para quién estamos trabajando.
            </p>
          )}
        </div>

        {/* Form */}
        <div style={{ padding: '24px 32px 32px' }}>
          {/* Nombre */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Nombre de la organización *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Alpha Espai, Empresa XYZ"
              style={inputStyle}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) handleSubmit() }}
            />
          </div>

          {/* Sector */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {SECTORES.map((s) => (
                <option key={s} value={s} style={{ backgroundColor: '#111115' }}>{s}</option>
              ))}
            </select>
          </div>

          {/* Contexto */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Contexto breve <span style={{ color: 'var(--stoa-ink-3)', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Una frase sobre qué hace la organización y qué tipo de decisiones toma. Esto ayuda a la IA a generar contenido más específico."
              style={{
                ...inputStyle,
                height: 72,
                resize: 'vertical' as const,
                lineHeight: 1.55,
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid var(--stoa-rule)' }}>
            {!isFirstTime && isConfigured && (
              <button
                onClick={closeSetup}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', background: 'none', border: '1px solid var(--stoa-rule)', padding: '8px 16px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            )}
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
                padding: '8px 24px',
                cursor: canSubmit ? 'pointer' : 'default',
                letterSpacing: '0.02em',
              }}
            >
              {isFirstTime ? 'Comenzar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
