import { useState } from 'react'
import { useOrgStore } from '../store/org'
import { useDecisionsStore } from '../store/decisions'
import { IFF_ORG, IFF_DECISIONS } from '../data/iffDemo'

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

const STEPS = [
  {
    num: '01',
    title: 'Describes la iniciativa',
    desc: 'Solo el nombre y la categoría. La IA genera la pregunta estratégica, la hipótesis de impacto en euros y los indicadores de éxito.',
  },
  {
    num: '02',
    title: 'El equipo decide',
    desc: 'Deliberad, comprometeos con un veredicto y registrad la predicción: "si hacemos esto, en X meses el impacto será Y€".',
  },
  {
    num: '03',
    title: 'STOA mide el resultado',
    desc: 'El impacto real se registra y aparece en la cuenta de explotación. La organización aprende de cada decisión.',
  },
]

export default function OrgSetup({ isFirstTime }: { isFirstTime?: boolean }) {
  const { configure, closeSetup, isConfigured } = useOrgStore()
  const { loadDemoDecisions } = useDecisionsStore()

  const [step, setStep] = useState<'welcome' | 'form'>(isFirstTime ? 'welcome' : 'form')
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

  function handleLoadDemo() {
    configure(IFF_ORG.name, IFF_ORG.sector, IFF_ORG.context)
    loadDemoDecisions(IFF_DECISIONS)
  }

  // ── Welcome screen ──────────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          backgroundColor: 'var(--stoa-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: 680, width: '100%' }}>

          {/* Wordmark */}
          <div style={{ marginBottom: 40, textAlign: 'center' as const }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 400, color: 'var(--stoa-ink)', letterSpacing: '0.22em', textTransform: 'uppercase' as const }}>
              Stoa
            </span>
          </div>

          {/* Value proposition */}
          <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, margin: '0 0 16px' }}>
              Sistema de trazabilidad de decisiones
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 400, color: 'var(--stoa-ink)', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Conecta cada decisión de innovación<br />con la cuenta de resultados.
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.65, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Tu organización ya toma decisiones. El problema es que nadie sabe si funcionaron ni cuánto valieron. STOA cierra ese ciclo.
            </p>
          </div>

          {/* How it works */}
          <div style={{ border: '1px solid var(--stoa-rule)', marginBottom: 40 }}>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--stoa-rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Cómo funciona</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {STEPS.map(({ num, title, desc }, i) => (
                <div
                  key={num}
                  style={{
                    padding: '24px',
                    borderLeft: i > 0 ? '1px solid var(--stoa-rule)' : 'none',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--stoa-gold)', lineHeight: 1, marginBottom: 12 }}>{num}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', fontWeight: 500, marginBottom: 8, lineHeight: 1.3 }}>{title}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, maxWidth: 440, margin: '0 auto' }}>
            <button
              onClick={handleLoadDemo}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--stoa-bg)',
                backgroundColor: 'var(--stoa-gold)',
                border: 'none',
                padding: '13px 24px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                width: '100%',
              }}
            >
              Ver demo: IFF post-transformación →
            </button>
            <button
              onClick={() => setStep('form')}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--stoa-ink-2)',
                backgroundColor: 'transparent',
                border: '1px solid var(--stoa-rule-strong)',
                padding: '12px 24px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                width: '100%',
              }}
            >
              Configurar mi organización
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', textAlign: 'center' as const, margin: 0, letterSpacing: '0.06em' }}>
              El demo carga 5 decisiones reales de IFF con impacto financiero cuantificado.
            </p>
          </div>

        </div>
      </div>
    )
  }

  // ── Form screen ─────────────────────────────────────────────────────────────
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
      onClick={e => { if (!isFirstTime && e.target === e.currentTarget) closeSetup() }}
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
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px 18px', borderBottom: '1px solid var(--stoa-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
              {isFirstTime ? 'Tu organización' : 'Configuración'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--stoa-ink)', margin: '6px 0 0', lineHeight: 1.2 }}>
              {isFirstTime ? '¿Para quién trabajamos?' : 'Actualizar organización'}
            </h2>
            {isFirstTime && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '8px 0 0', lineHeight: 1.6 }}>
                Esto personaliza las hipótesis y el análisis de IA.
              </p>
            )}
          </div>
          {isFirstTime && (
            <button
              onClick={() => setStep('welcome')}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.06em', textTransform: 'uppercase' as const, flexShrink: 0, marginTop: 2 }}
            >
              ← Atrás
            </button>
          )}
        </div>

        {/* Form */}
        <div style={{ padding: '22px 32px 28px' }}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Nombre de la organización *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Alpha Espai, IFF, Empresa XYZ"
              style={inputStyle}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && canSubmit) handleSubmit() }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Sector</label>
            <select
              value={sector}
              onChange={e => setSector(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {SECTORES.map(s => (
                <option key={s} value={s} style={{ backgroundColor: '#111115' }}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              Contexto breve{' '}
              <span style={{ color: 'var(--stoa-ink-3)', textTransform: 'none' as const, letterSpacing: 0 }}>(opcional)</span>
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Una frase sobre qué hace la organización. Ayuda a la IA a generar hipótesis más precisas."
              style={{ ...inputStyle, height: 68, resize: 'vertical' as const, lineHeight: 1.55 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid var(--stoa-rule)' }}>
            {!isFirstTime && isConfigured && (
              <button
                onClick={closeSetup}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', background: 'none', border: '1px solid var(--stoa-rule)', padding: '8px 16px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            )}
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              {isFirstTime && (
                <button
                  onClick={handleLoadDemo}
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', background: 'none', border: '1px solid var(--stoa-rule)', padding: '8px 16px', cursor: 'pointer', letterSpacing: '0.01em' }}
                >
                  Ver demo IFF
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
                {submitted ? 'Configurando…' : 'Empezar →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
