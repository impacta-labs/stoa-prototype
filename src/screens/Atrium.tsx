import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { useDecisionsStore, daysActive } from '../store/decisions'
import { useOrgStore } from '../store/org'

const statusColor: Record<string, string> = {
  evaluacion:  'var(--stoa-ink-3)',
  deliberando: 'var(--stoa-gold)',
}

const statusLabel: Record<string, string> = {
  evaluacion:  'En evaluación',
  deliberando: 'En deliberación',
}

const tipoLabel: Record<string, string> = {
  'tecnología / IA':       'Tecnología / IA',
  'proceso interno':       'Proceso',
  'eficiencia operativa':  'Eficiencia',
  'expansión':             'Expansión',
  'modelo de negocio':     'Modelo',
  'experiencia de cliente':'Experiencia',
  'partnership':           'Partnership',
  'cultura organizativa':  'Cultura',
}

export default function Atrium() {
  const isMobile = useIsMobile()
  const { decisions, openCreateModal } = useDecisionsStore()
  const { name: orgName, sector, isConfigured } = useOrgStore()

  const userActive   = decisions.filter((d) => d.status === 'evaluacion' || d.status === 'deliberando')
  const userResolved = decisions.filter((d) => d.status === 'resuelta')

  const sinAterrizar = userActive.filter(
    (d) => !d.businessImpact.leadingIndicators.length || !d.businessImpact.hypothesis || !d.owner
  )

  const approaching = [...userActive].sort(
    (a, b) => new Date(a.opened).getTime() - new Date(b.opened).getTime()
  ).slice(0, 3)

  const participants = [...new Set(decisions.map((d) => d.owner).filter(Boolean))]

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
      {/* Organization Header */}
      <div style={{ padding: isMobile ? '24px 20px 20px' : '32px 40px 24px', borderBottom: '1px solid var(--stoa-rule)' }}>
        <motion.div variants={settle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                  Atrio
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>
                  {period}
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isMobile ? 22 : 28,
                fontWeight: 400,
                color: 'var(--stoa-ink)',
                margin: '0 0 5px',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}>
                {displayName}
              </h1>
              {sector && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 300, color: 'var(--stoa-ink-3)', margin: '0 0 3px' }}>
                  {sector}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 8 }}>
              {!isMobile && (
                <div style={{ textAlign: 'right' as const }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 3px', letterSpacing: '0.05em' }}>
                    {decisions.length} decisión{decisions.length !== 1 ? 'es' : ''} en registro
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0, letterSpacing: '0.05em' }}>
                    {sessionRef}
                  </p>
                </div>
              )}
              <button
                onClick={openCreateModal}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--stoa-bg)',
                  backgroundColor: 'var(--stoa-gold)',
                  border: 'none',
                  padding: '8px 18px',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                + Nueva iniciativa
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Requieren atención */}
      {sinAterrizar.length > 0 && (
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '14px 20px' : '14px 40px',
            borderBottom: '1px solid var(--stoa-rule)',
            backgroundColor: 'rgba(181, 98, 26, 0.04)',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap' as const,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-amber)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
            Requieren atención
          </span>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            {sinAterrizar.map((d) => (
              <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-amber)' }}>
                  {d.titulo}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', marginLeft: 6 }}>
                  {!d.owner ? '· sin responsable' : !d.businessImpact.leadingIndicators.length ? '· sin indicadores' : '· hipótesis incompleta'}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Estado Actual + En Deliberación */}
      <div className="stoa-col-left-280" style={{ borderBottom: '1px solid var(--stoa-rule)' }}>

        {/* Estado Actual */}
        <motion.div
          variants={settle}
          style={{
            padding: isMobile ? '20px 20px' : '22px 24px 22px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader label="Estado Actual" meta={period} />
          <div style={{ marginTop: 14 }}>
            {[
              {
                label: 'Decisiones activas',
                value: userActive.length,
                note: userActive.length === 0 ? 'Sin decisiones abiertas' : `${userActive.length} en seguimiento`,
              },
              {
                label: 'Resueltas',
                value: userResolved.length,
                note: userResolved.length > 0 ? 'Ver en Archivo' : null,
              },
              {
                label: 'Participantes',
                value: participants.length,
                note: participants.length > 0
                  ? participants.slice(0, 2).join(', ') + (participants.length > 2 ? ` +${participants.length - 2}` : '')
                  : null,
              },
              {
                label: 'Total en registro',
                value: decisions.length,
                note: null,
              },
            ].map(({ label, value, note }, i, arr) => (
              <div
                key={label}
                style={{ padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)' }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stoa-ink)' }}>
                    {value}
                  </span>
                </div>
                {note && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '2px 0 0', textAlign: 'right' as const, letterSpacing: '0.03em' }}>
                    {note}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, borderTop: '1px solid var(--stoa-rule)', paddingTop: 12 }}>
            <Link to="/council" style={{ textDecoration: 'none' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                Sesión de Consejo
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-gold)', margin: '0 0 2px' }}>
                Abrir sala →
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: 0 }}>
                {userActive.length} decisión{userActive.length !== 1 ? 'es' : ''} para revisar
              </p>
            </Link>
          </div>
        </motion.div>

        {/* En Deliberación */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '20px 20px' : '22px 40px 22px 24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <SectionHeader label="En Deliberación" meta={`${userActive.length} activa${userActive.length !== 1 ? 's' : ''}`} />
          </div>

          {userActive.length === 0 ? (
            <motion.div variants={depositItem}>
              <div style={{ padding: '24px 0', textAlign: 'center' as const }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-3)', margin: '0 0 6px' }}>
                  Sin decisiones activas
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', margin: '0 0 14px', letterSpacing: '0.04em' }}>
                  Las iniciativas creadas aparecerán aquí
                </p>
                <button
                  onClick={openCreateModal}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    color: 'var(--stoa-gold)',
                    background: 'none',
                    border: '1px solid var(--stoa-gold)',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                  }}
                >
                  + Nueva iniciativa
                </button>
              </div>
            </motion.div>
          ) : (
            userActive.map((d, i) => (
              <motion.div key={d.id} variants={depositItem}>
                <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '12px 0', borderBottom: i < userActive.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 5 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: statusColor[d.status] || 'var(--stoa-ink-3)', marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink)', lineHeight: 1.4 }}>
                            {d.preguntaEstrategica}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: statusColor[d.status] || 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, flexShrink: 0, paddingTop: 2 }}>
                            {statusLabel[d.status] || d.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 14, display: 'flex', flexWrap: 'wrap' as const, gap: '2px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.03em' }}>{d.id}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>{d.owner || 'Sin responsable'}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>Plazo {d.deadline}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{tipoLabel[d.tipoInnovacion] || d.tipoInnovacion}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{daysActive(d.opened)}d activa</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* En Maduración + Recientemente Resueltas */}
      <div className="stoa-col-2" style={{ borderBottom: '1px solid var(--stoa-rule)', flex: 1 }}>

        {/* En Maduración */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{
            padding: isMobile ? '20px 20px' : '22px 24px 22px 40px',
            borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
            borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
          }}
        >
          <SectionHeader
            label="En Maduración"
            meta={approaching.length > 0 ? `${approaching.length} con prioridad` : 'Sin señales activas'}
          />
          <div style={{ marginTop: 14 }}>
            {approaching.length === 0 ? (
              <motion.div variants={depositItem}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '8px 0', lineHeight: 1.55 }}>
                  Las decisiones activas con mayor antigüedad aparecerán aquí como señales de urgencia.
                </p>
              </motion.div>
            ) : (
              approaching.map((d, i) => (
                <motion.div
                  key={d.id}
                  variants={depositItem}
                  style={{ padding: '13px 0', borderBottom: i < approaching.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}
                >
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-amber)', marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{d.id}</span>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink)', margin: 0, lineHeight: 1.3 }}>{d.titulo}</p>
                        </div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.4 }}>
                          Plazo {d.deadline} · {daysActive(d.opened)}d activa
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recientemente Resueltas */}
        <motion.div
          variants={deposit}
          initial="hidden"
          animate="visible"
          style={{ padding: isMobile ? '20px 20px' : '22px 40px 22px 24px' }}
        >
          <SectionHeader
            label="Recientemente Resueltas"
            meta={`${userResolved.length} decisión${userResolved.length !== 1 ? 'es' : ''}`}
          />
          <div style={{ marginTop: 14 }}>
            {userResolved.length === 0 ? (
              <motion.div variants={depositItem}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: '8px 0', lineHeight: 1.55 }}>
                  Las decisiones cerradas quedan registradas aquí como memoria institucional.
                </p>
              </motion.div>
            ) : (
              userResolved.map((d, i) => (
                <motion.div
                  key={d.id}
                  variants={depositItem}
                  style={{ padding: '11px 0', borderBottom: i < userResolved.length - 1 ? '1px solid var(--stoa-rule)' : undefined }}
                >
                  <Link to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--stoa-resolve)', marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.35 }}>
                            {d.preguntaEstrategica}
                          </p>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-gold)', letterSpacing: '0.03em', flexShrink: 0 }}>
                            {d.id}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', margin: 0 }}>
                          {d.selectedVerdict}
                        </p>
                        <div style={{ display: 'flex', gap: 10, marginTop: 3, alignItems: 'baseline' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-resolve)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                            Resuelta
                          </span>
                          {d.owner && (
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>{d.owner}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Memory Band */}
      <motion.div
        variants={settle}
        style={{
          padding: isMobile ? '0 20px' : '0 40px',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          overflow: 'hidden',
          backgroundColor: 'var(--stoa-surface-1)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
          Memoria
        </span>
        <div style={{ width: 1, height: 10, backgroundColor: 'var(--stoa-rule-strong)', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', overflow: 'hidden' }}>
          {decisions.length === 0 ? (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)', fontStyle: 'italic' }}>
              Las decisiones registradas quedan en memoria permanente
            </span>
          ) : (
            decisions.map((d) => (
              <Link key={d.id} to={`/chamber/${d.id}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  color: d.status === 'resuelta' ? 'var(--stoa-gold)' : 'var(--stoa-ink-3)',
                  whiteSpace: 'nowrap' as const,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, marginRight: 5, letterSpacing: '0.03em' }}>{d.id}</span>
                  {d.titulo}
                </span>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
