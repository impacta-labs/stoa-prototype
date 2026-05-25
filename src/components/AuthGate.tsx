import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth'

export default function AuthGate() {
  const { signIn, signUp, loading, error } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError('')
    if (!email.trim() || !password.trim()) {
      setLocalError('Correo y contraseña son obligatorios.')
      return
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    const err = mode === 'login'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password)
    if (err) setLocalError(err)
  }

  const displayError = localError || error

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--stoa-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 42,
            fontWeight: 400,
            color: 'var(--stoa-ink)',
            letterSpacing: '-0.02em',
            display: 'block',
            lineHeight: 1,
          }}>
            STOA
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--stoa-ink-3)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            display: 'block',
            marginTop: 8,
          }}>
            Sistema Operativo de Decisiones
          </span>
        </div>

        {/* Rule */}
        <div style={{ height: 1, backgroundColor: 'var(--stoa-rule-strong)', marginBottom: 32 }} />

        {/* Mode toggle */}
        <div style={{ display: 'flex', marginBottom: 28, borderBottom: '1px solid var(--stoa-rule)' }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setLocalError('') }}
              style={{
                flex: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: mode === m ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${mode === m ? 'var(--stoa-gold)' : 'transparent'}`,
                padding: '0 0 12px',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {m === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--stoa-ink-3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              display: 'block',
              marginBottom: 6,
            }}>
              Correo electrónico
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@empresa.com"
              autoComplete="email"
              style={{
                width: '100%',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                color: 'var(--stoa-ink)',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-rule-strong)',
                padding: '11px 14px',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--stoa-ink-3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              display: 'block',
              marginBottom: 6,
            }}>
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              style={{
                width: '100%',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                color: 'var(--stoa-ink)',
                backgroundColor: 'var(--stoa-surface-1)',
                border: '1px solid var(--stoa-rule-strong)',
                padding: '11px 14px',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>

          {displayError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                color: 'var(--stoa-amber)',
                margin: '0 0 16px',
                lineHeight: 1.5,
              }}
            >
              {displayError}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: loading ? 'var(--stoa-ink-3)' : 'var(--stoa-gold)',
              backgroundColor: 'transparent',
              border: `1px solid ${loading ? 'var(--stoa-rule)' : 'var(--stoa-gold)'}`,
              padding: '13px 0',
              cursor: loading ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Un momento…' : mode === 'login' ? 'Entrar →' : 'Crear cuenta →'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--stoa-ink-3)',
          textAlign: 'center' as const,
          marginTop: 32,
          letterSpacing: '0.06em',
          lineHeight: 1.7,
        }}>
          {mode === 'login'
            ? 'Primera vez aquí · Cambia a Registrarse'
            : 'Los datos de tu organización quedan aislados del resto'}
        </p>
      </motion.div>
    </div>
  )
}
