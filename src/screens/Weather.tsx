import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chamberEnter, settle, deposit, depositItem } from '../lib/motion'
import SectionHeader from '../components/primitives/SectionHeader'
import { useIsMobile } from '../hooks/useViewport'
import { weatherData } from '../data/fixtures'
import { useDecisionsStore } from '../store/decisions'
import { detectarPatrones } from '../lib/ai'

export default function Weather() {
  const [unlocked, setUnlocked] = useState(weatherData.unlocked)
  const isMobile = useIsMobile()
  const w = weatherData
  const { decisions } = useDecisionsStore()
  const userPatterns = detectarPatrones(decisions)

  return (
    <motion.div
      variants={chamberEnter}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div
        style={{
          padding: isMobile ? '16px 20px' : '20px 40px',
          borderBottom: '1px solid var(--stoa-rule)',
          backgroundColor: 'var(--stoa-surface-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <motion.div variants={settle} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Clima Organizacional
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
            Lectura del clima organizativo
          </span>
          {unlocked && !isMobile && (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>
                Generado {w.generatedAt}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stoa-ink-3)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--stoa-ink-3)' }}>
                Basado en {w.basedOn}
              </span>
            </>
          )}
        </motion.div>
        <motion.div variants={settle}>
          <button
            onClick={() => setUnlocked(!unlocked)}
            style={{
              background: 'none',
              border: '1px solid var(--stoa-rule)',
              padding: '4px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--stoa-ink-3)',
              cursor: 'pointer',
              letterSpacing: '0.07em',
              textTransform: 'uppercase' as const,
              transition: 'border-color 0.15s ease',
            }}
          >
            {unlocked ? 'Cerrar' : 'Abrir'}
          </button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          /* Locked State — institutional notice, not centered card */
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                padding: isMobile ? '32px 20px' : '48px 40px',
                borderBottom: '1px solid var(--stoa-rule)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--stoa-ink-3)',
                  margin: '0 0 16px',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Lectura no disponible
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: 400,
                  color: 'var(--stoa-ink-2)',
                  margin: '0 0 28px',
                  lineHeight: 1.45,
                  maxWidth: 560,
                }}
              >
                El clima organizativo no es aún legible.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  color: 'var(--stoa-ink-3)',
                  margin: 0,
                  lineHeight: 1.65,
                  maxWidth: 520,
                }}
              >
                El clima organizativo se deriva del registro de deliberaciones: decisiones en curso, posiciones registradas, tensiones documentadas, patrones repetidos. Hasta que se acumule suficiente data operativa, la lectura sería ruido en lugar de señal.
              </p>
            </div>

            <div style={{ padding: isMobile ? '24px 20px' : '28px 40px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--stoa-ink-2)' }}>
                  {w.thresholdMet}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-3)' }}>
                  de {w.thresholdRequired} indicadores de umbral cumplidos
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: w.thresholdMet >= w.thresholdRequired ? 'var(--stoa-resolve)' : 'var(--stoa-ink-3)',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase' as const,
                  margin: 0,
                }}
              >
                {w.thresholdMet >= w.thresholdRequired ? 'Umbral alcanzado — lectura disponible' : 'Acumulando deliberación'}
              </p>
            </div>
          </motion.div>
        ) : (
          /* Unlocked State */
          <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {/* Context strip */}
            <div style={{ padding: isMobile ? '14px 20px' : '16px 40px', borderBottom: '1px solid var(--stoa-rule)', backgroundColor: 'var(--stoa-surface-1)' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--stoa-ink-3)', margin: 0, lineHeight: 1.65, maxWidth: 720 }}>
                Todas las lecturas siguientes se derivan del registro de deliberaciones de Alpha Espai. Los frentes de tormenta tienen trazabilidad directa a decisiones en curso; las zonas de calma reflejan terreno operativo que ha sido resuelto y ya no está bajo presión. La lectura retrospectiva al final describe qué habría mostrado esta superficie hace dos años.
              </p>
            </div>

            {/* Pressure Systems + Winds */}
            <div
              className="stoa-col-2"
              style={{ borderBottom: '1px solid var(--stoa-rule)' }}
            >
              {/* Pressure Systems */}
              <motion.div
                variants={deposit}
                initial="hidden"
                animate="visible"
                style={{
                  padding: isMobile ? '20px 20px' : '24px 28px 24px 40px',
                  borderRight: isMobile ? 'none' : '1px solid var(--stoa-rule)',
                  borderBottom: isMobile ? '1px solid var(--stoa-rule)' : 'none',
                }}
              >
                <SectionHeader label="Sistemas de Presión" />
                <div style={{ marginTop: 14 }}>
                  {w.pressureSystems.map((ps, i) => (
                    <motion.div
                      key={i}
                      variants={depositItem}
                      style={{
                        padding: '14px 0',
                        borderBottom: i < w.pressureSystems.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                          {ps.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            color: ps.intensity === 'High' ? 'var(--stoa-amber)' : 'var(--stoa-resolve)',
                            letterSpacing: '0.09em',
                            textTransform: 'uppercase' as const,
                          }}
                        >
                          {ps.intensity}
                        </span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 6px', lineHeight: 1.65 }}>
                        {ps.description}
                      </p>
                      {'tracedTo' in ps && (ps as { tracedTo?: string[] }).tracedTo && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>Trazado:</span>
                          {(ps as { tracedTo: string[] }).tracedTo.map(ref => (
                            <span key={ref} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>{ref}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Prevailing Winds + Calm */}
              <motion.div
                variants={deposit}
                initial="hidden"
                animate="visible"
                style={{ padding: isMobile ? '20px 20px' : '24px 40px 24px 28px' }}
              >
                <SectionHeader label="Vientos Predominantes" />
                <motion.div variants={depositItem} style={{ marginTop: 14, marginBottom: 24 }}>
                  <div
                    style={{
                      padding: '14px 16px',
                      borderLeft: '2px solid var(--stoa-gold)',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, color: 'var(--stoa-ink)', margin: '0 0 5px' }}>
                      Dirección: {w.prevailingWinds.direction}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.65 }}>
                      {w.prevailingWinds.description}
                    </p>
                  </div>
                </motion.div>

                <SectionHeader label="Zonas de Calma" />
                <div style={{ marginTop: 14 }}>
                  {w.calm.map((c, i) => (
                    <motion.div
                      key={i}
                      variants={depositItem}
                      style={{
                        padding: '12px 0',
                        borderBottom: i < w.calm.length - 1 ? '1px solid var(--stoa-rule)' : undefined,
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)', margin: '0 0 4px' }}>
                        {c.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: 0, lineHeight: 1.65 }}>
                        {c.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Storm Fronts */}
            <motion.div
              variants={deposit}
              initial="hidden"
              animate="visible"
              style={{ padding: isMobile ? '20px 20px' : '24px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
            >
              <SectionHeader label="Frentes de Tormenta" meta="Condiciones activas" />
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                {w.stormFronts.map((sf, i) => (
                  <motion.div
                    key={i}
                    variants={depositItem}
                    style={{
                      padding: '14px 14px 14px 16px',
                      borderLeft: `2px solid ${sf.severity === 'significant' ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)'}`,
                      backgroundColor: sf.severity === 'significant' ? 'rgba(181, 98, 26, 0.03)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)' }}>
                        {sf.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: sf.severity === 'significant' ? 'var(--stoa-amber)' : 'var(--stoa-ink-3)',
                          letterSpacing: '0.09em',
                          textTransform: 'uppercase' as const,
                        }}
                      >
                        {sf.severity}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 6px', lineHeight: 1.65 }}>
                      {sf.description}
                    </p>
                    {'tracedTo' in sf && (sf as { tracedTo?: string[] }).tracedTo && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>Trazado:</span>
                        {(sf as { tracedTo: string[] }).tracedTo.map(ref => (
                          <span key={ref} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>{ref}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Patrones de Innovación */}
            {((w.innovationPatterns && w.innovationPatterns.length > 0) || userPatterns.length > 0) && (
              <motion.div
                variants={deposit}
                initial="hidden"
                animate="visible"
                style={{ padding: isMobile ? '20px 20px' : '24px 40px', borderBottom: '1px solid var(--stoa-rule)' }}
              >
                <SectionHeader label="Patrones de Innovación" meta="Derivados del registro de decisiones" />
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* User-generated patterns from pilot decisions */}
                  {userPatterns.map((pattern, i) => (
                    <motion.div key={`u-${i}`} variants={depositItem}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-gold)', margin: '0 0 4px' }}>
                        {pattern.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 5px', lineHeight: 1.65 }}>
                        {pattern.description}
                      </p>
                      {pattern.tracedTo.length > 0 && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>Trazado:</span>
                          {pattern.tracedTo.map((ref) => (
                            <span key={ref} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-gold)', letterSpacing: '0.04em' }}>{ref}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {/* Fixture patterns */}
                  {w.innovationPatterns && w.innovationPatterns.map((pattern, i) => (
                    <motion.div key={i} variants={depositItem}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--stoa-ink)', margin: '0 0 4px' }}>
                        {pattern.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--stoa-ink-2)', margin: '0 0 5px', lineHeight: 1.65 }}>
                        {pattern.description}
                      </p>
                      {pattern.tracedTo && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.05em' }}>Trazado:</span>
                          {pattern.tracedTo.map((ref: string) => (
                            <span key={ref} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--stoa-ink-3)', letterSpacing: '0.04em' }}>{ref}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Lectura Retrospectiva */}
            <motion.div
              variants={settle}
              style={{
                padding: isMobile ? '20px 20px' : '24px 40px',
                backgroundColor: 'var(--stoa-surface-1)',
                flex: 1,
              }}
            >
              <SectionHeader label="Lectura Retrospectiva" meta={`Período: ${w.backtestReading.period}`} />
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: 'var(--stoa-ink-2)',
                  margin: '14px 0 0',
                  lineHeight: 1.8,
                  maxWidth: 680,
                }}
              >
                {w.backtestReading.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
