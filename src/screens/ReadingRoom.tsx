import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, depositItem, deposit } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { memoryThread } from '../data/fixtures'
import { useDecisionsStore } from '../store/decisions'

const hypothesisColor: Record<string, string> = {
  'confirmada':              'var(--stoa-resolve)',
  'parcialmente confirmada': 'var(--stoa-gold)',
  'refutada':                'var(--stoa-amber)',
  'inconclusa':              'var(--stoa-ink-3)',
}

export default function ReadingRoom() {
  const isMobile = useIsMobile()
  const t = memoryThread
  const { decisions } = useDecisionsStore()
  const userResolved = decisions
    .filter((d) => d.status === 'resuelta')
    .sort((a, b) => new Date(b.settledAt ?? 0).getTime() - new Date(a.settledAt ?? 0).getTime())

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Room Header */}
      <div
        style={{
          padding: isMobile ? '16px 20px' : '20px 40px',
          borderBottom: '1px solid var(--stoa-rule)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Archivo Estratégico
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
            Archivo Alpha Espai
          </span>
        </motion.div>
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-resolve)', letterSpacing: '0.06em' }}>
            {t.id}
          </span>
          {!isMobile && (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                Resuelta {t.settled}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* User resolved decisions */}
      {userResolved.length > 0 && (
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '20px 20px' : '24px 40px',
            borderBottom: '1px solid var(--stoa-rule)',
            backgroundColor: 'rgba(196, 149, 42, 0.02)',
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 16 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-gold)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Decisiones piloto · {userResolved.length} en archivo
            </span>
          </div>
          {userResolved.map((d, i) => (
            <motion.div
              key={d.id}
              variants={depositItem}
              style={{
                padding: '16px 0',
                borderBottom: i < userResolved.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' as const }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em' }}>{d.id}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>{d.tipoInnovacion}</span>
                    {d.settledAt && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                        Resuelta {new Date(d.settledAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: isMobile ? 15 : 17,
                        fontWeight: 400,
                        color: 'var(--stoa-ink)',
                        margin: '0 0 10px',
                        lineHeight: 1.3,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {d.preguntaEstrategica}
                    </h3>
                  </Link>
                </div>
              </div>
              {d.selectedVerdict && (
                <div style={{ padding: '10px 14px', borderLeft: '2px solid var(--stoa-resolve)', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                    Resolución
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.55 }}>
                    {d.selectedVerdict}
                  </p>
                </div>
              )}
              {d.prediccion && (
                <div style={{ padding: '10px 14px', borderLeft: '2px solid var(--stoa-ink-3)', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                    Predicción
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.55 }}>
                    {d.prediccion}
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginTop: 6 }}>
                {d.owner && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{d.owner}</span>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                  Revisión: {d.businessImpact.reviewHorizon}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  Evidencia: {d.businessImpact.evidenceStatus}
                </span>
              </div>
              {d.businessImpact.leadingIndicators.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 4 }}>
                    Indicadores tempranos
                  </span>
                  {d.businessImpact.leadingIndicators.slice(0, 2).map((ind, j) => (
                    <p key={j} style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: '0 0 2px', lineHeight: 1.4 }}>
                      · {ind}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Document */}
      <div
        className="stoa-col-right-240"
        style={{ flex: 1 }}
      >
        {/* Main text */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '28px 20px 40px' : '44px 48px 56px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
          }}
        >
          {/* Title block */}
          <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--stoa-resolve)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Hilo de Memoria
              </span>
              {!isMobile && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                  Resuelta {t.settled}
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? 22 : 28,
                fontWeight: 400,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                maxWidth: 520,
              }}
            >
              {t.title}
            </h1>
          </motion.div>

          {/* Byline */}
          <motion.div variants={depositItem}>
            <div
              style={{
                display: 'flex',
                gap: 16,
                padding: '12px 0',
                borderTop: '1px solid var(--stoa-rule-strong)',
                borderBottom: '1px solid var(--stoa-rule)',
                marginBottom: 24,
                flexWrap: 'wrap' as const,
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)' }}>
                {t.author}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                {t.role}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', marginLeft: 'auto' }}>
                {t.settled}
              </span>
            </div>
          </motion.div>

          {/* Retrospective / Hypothesis Status */}
          {(t as { hypothesisStatus?: string; retrospective?: string }).hypothesisStatus && (
            <motion.div variants={depositItem} style={{ marginBottom: 24 }}>
              <div
                style={{
                  padding: '12px 14px',
                  borderLeft: `2px solid ${hypothesisColor[(t as { hypothesisStatus: string }).hypothesisStatus] || 'var(--stoa-ink-3)'}`,
                  backgroundColor: 'rgba(196, 149, 42, 0.03)',
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: hypothesisColor[(t as { hypothesisStatus: string }).hypothesisStatus] || 'var(--stoa-ink-3)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                    Hipótesis {(t as { hypothesisStatus: string }).hypothesisStatus}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>
                    · Resultado retrospectivo · {t.relatedDecision}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.6 }}>
                  {(t as { retrospective?: string }).retrospective}
                </p>
              </div>
            </motion.div>
          )}

          {/* Active citation notice */}
          {t.citedIn && t.citedIn.length > 0 && (
            <motion.div variants={depositItem} style={{ marginBottom: 24 }}>
              <div
                style={{
                  padding: '9px 14px',
                  borderLeft: '2px solid var(--stoa-gold)',
                  backgroundColor: 'var(--stoa-gold-subtle)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 10,
                  flexWrap: 'wrap' as const,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.09em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
                  Citado en deliberación activa
                </span>
                {t.citedIn.map(ref => (
                  <span key={ref} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
                    {ref}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Body */}
          <div style={{ maxWidth: 580 }}>
            {t.body.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={depositItem}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 14 : 15,
                  fontWeight: 400,
                  color: 'var(--stoa-ink)',
                  lineHeight: 1.8,
                  margin: '0 0 22px',
                  fontStyle: i === 1 ? 'italic' : 'normal',
                  opacity: i === 1 ? 0.9 : 1,
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Dissent block */}
          <motion.div
            variants={depositItem}
            style={{
              marginTop: 8,
              padding: '18px 18px 18px 16px',
              borderLeft: '2px solid var(--stoa-amber)',
              backgroundColor: 'rgba(181, 98, 26, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap' as const, gap: 4 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.09em', textTransform: 'uppercase' as const }}>
                  Disenso Registrado
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                {t.dissent.timestamp}
              </span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                {t.dissent.participant}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', marginLeft: 8 }}>
                {t.dissent.role}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 14,
                color: 'var(--stoa-ink)',
                margin: 0,
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              {t.dissent.text}
            </p>
          </motion.div>

          {/* Archive footer */}
          <motion.div variants={depositItem} style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--stoa-rule)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.06em', lineHeight: 1.7 }}>
              Este hilo entró en la Memoria Estratégica el {t.settled}.<br />
              Accesible a todas las deliberaciones futuras.<br />
              Citado actualmente por {t.citedIn.length} decisión{t.citedIn.length !== 1 ? 'es' : ''} activa{t.citedIn.length !== 1 ? 's' : ''}.
            </p>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        {!isMobile && (
          <motion.div
            variants={deposit}
            initial="hidden"
            animate="visible"
            style={{
              padding: '44px 36px 40px 28px',
              backgroundColor: 'var(--stoa-surface-1)',
            }}
          >
            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Metadatos del Hilo" />
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Referencia', value: t.id },
                  { label: 'Resuelta',   value: t.settled },
                  { label: 'Autor',      value: t.author },
                  { label: 'Decisión',   value: t.relatedDecision },
                  { label: 'Consultas',  value: `${t.views} desde la resolución` },
                  { label: 'Consultado', value: '23 May 2026 · 09:42' },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    style={{
                      padding: '9px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: 2,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stoa-ink-2)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Etiquetas" />
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--stoa-ink-3)',
                      padding: '3px 7px',
                      border: '1px solid var(--stoa-rule)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={depositItem} style={{ marginBottom: 28 }}>
              <SectionHeader label="Citado en" />
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {t.citedIn.map((ref) => (
                  <span
                    key={ref}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--stoa-gold)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ref}
                  </span>
                ))}
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', marginTop: 2 }}>
                  La deliberación activa cita este hilo como precedente.
                </span>
              </div>
            </motion.div>

            <motion.div variants={depositItem}>
              <SectionHeader label="Hilos Relacionados" />
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {t.relatedThreads.map((ref) => (
                  <span
                    key={ref}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--stoa-ink-3)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={depositItem} style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--stoa-rule)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 8px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                Informando actualmente
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-2)', margin: '0 0 6px', lineHeight: 1.55 }}>
                D-042 está usando este hilo como precedente para la decisión del satélite de Lisboa — específicamente, el problema de la pregunta fundadora que este hilo identifica.
              </p>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>
                D-042 · Deliberación activa
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
