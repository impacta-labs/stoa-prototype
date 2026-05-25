import { useParams, Link } from 'react-router-dom'
import { useDecisionsStore } from '../store/decisions'
import { useOrgStore } from '../store/org'

const fmt = (n: number) =>
  n >= 1_000_000 ? `€${(n / 1_000_000).toFixed(1)}M` : `€${(n / 1_000).toFixed(0)}k`

const statusLabel: Record<string, string> = {
  evaluacion: 'En evaluación',
  deliberando: 'En deliberación',
  resuelta: 'Resuelta',
}

const tipoLabel: Record<string, string> = {
  'tecnología / IA': 'Tecnología / IA',
  'proceso interno': 'Proceso interno',
  'eficiencia operativa': 'Eficiencia operativa',
  'expansión': 'Expansión',
  'modelo de negocio': 'Modelo de negocio',
  'experiencia de cliente': 'Experiencia de cliente',
  'partnership': 'Partnership',
  'cultura organizativa': 'Cultura organizativa',
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase', padding: '7px 0', paddingRight: 24, verticalAlign: 'top', whiteSpace: 'nowrap' as const, borderBottom: '1px solid #e8e4dd', width: 160 }}>
        {label}
      </td>
      <td style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif', fontSize: 12, color: '#222', padding: '7px 0', verticalAlign: 'top', lineHeight: 1.55, borderBottom: '1px solid #e8e4dd' }}>
        {value}
      </td>
    </tr>
  )
}

export default function ExecutiveExport() {
  const { id } = useParams<{ id: string }>()
  const { decisions } = useDecisionsStore()
  const { name: orgName } = useOrgStore()
  const d = decisions.find(x => x.id === id)

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`

  if (!d) {
    return (
      <div style={{ padding: 40, fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
        <p>Decisión no encontrada.</p>
        <Link to="/chamber">← Volver</Link>
      </div>
    )
  }

  const bc = d.businessCase
  const kpis = d.kpis ?? []
  const totalKpiDelta = kpis.reduce((s, k) => s + (k.deltaEuros ?? 0), 0)
  const ar = d.actualResults

  return (
    <>
      {/* Print-specific global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@400&display=swap');

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          .export-page { padding: 12mm 16mm !important; }
          @page { margin: 0; size: A4 portrait; }
        }

        @media screen {
          body { background: #f5f2ed; }
        }
      `}</style>

      {/* Screen toolbar */}
      <div className="no-print" style={{ backgroundColor: '#0D0D10', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
        <Link to={`/chamber/${d.id}`} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#857F78', textDecoration: 'none', letterSpacing: '0.06em' }}>
          ← Volver a la decisión
        </Link>
        <button
          onClick={() => window.print()}
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#0D0D10', backgroundColor: '#C4952A', border: 'none', padding: '7px 18px', cursor: 'pointer', letterSpacing: '0.05em' }}
        >
          Imprimir / Guardar PDF →
        </button>
      </div>

      {/* Document */}
      <div className="export-page" style={{ maxWidth: 780, margin: '0 auto', padding: '32px 40px 48px', backgroundColor: 'white', minHeight: '100vh', fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #111', paddingBottom: 14, marginBottom: 24 }}>
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              {orgName || 'Organización'} · Caso de Inversión Ejecutivo
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: '#111', margin: '0 0 6px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {d.titulo}
            </h1>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#C4952A', margin: 0, letterSpacing: '0.05em' }}>
              {d.id} · {tipoLabel[d.tipoInnovacion] || d.tipoInnovacion} · {statusLabel[d.status] || d.status}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 24 }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#888', margin: '0 0 2px', letterSpacing: '0.06em' }}>Generado</p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#333', margin: '0 0 6px' }}>{dateStr}</p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#aaa', margin: 0 }}>{d.owner || 'Sin responsable'}</p>
          </div>
        </div>

        {/* Strategic question */}
        <div style={{ marginBottom: 28, padding: '14px 0', borderBottom: '1px solid #e8e4dd' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Pregunta estratégica</p>
          <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 17, color: '#111', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>
            {d.preguntaEstrategica}
          </p>
        </div>

        {/* Business Case — 4-cell grid */}
        {bc && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Caso de inversión</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1, backgroundColor: '#ddd', marginBottom: 10 }}>
              {[
                { label: 'Coste del problema', value: bc.costeProblemActual, suffix: '/año', accent: '#B5621A' },
                { label: 'Inversión requerida', value: bc.inversionRequerida, suffix: ' total', accent: '#444' },
                { label: 'Retorno esperado', value: bc.retornoEsperado, suffix: '/año', accent: '#3A6A4A' },
                { label: 'Payback', value: bc.paybackMeses, suffix: ' meses', isPayback: true, accent: '#8A6A1E' },
              ].map(({ label, value, suffix, isPayback, accent }) => (
                <div key={label} style={{ backgroundColor: 'white', padding: '12px 14px' }}>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 7, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>{label}</p>
                  {value != null ? (
                    <>
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 20, color: accent, margin: '0 0 2px', fontWeight: 400, lineHeight: 1 }}>
                        {isPayback ? value : fmt(value as number)}
                      </p>
                      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#aaa', margin: 0 }}>{suffix}</p>
                    </>
                  ) : (
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 16, color: '#ccc', margin: 0 }}>—</p>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#888', margin: 0, letterSpacing: '0.06em' }}>CONFIANZA</p>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: bc.confianza === 'Alto' ? '#3A6A4A' : bc.confianza === 'Medio' ? '#8A6A1E' : '#B5621A',
                border: `1px solid ${bc.confianza === 'Alto' ? '#3A6A4A' : bc.confianza === 'Medio' ? '#C4952A' : '#B5621A'}`,
                padding: '2px 8px',
              }}>
                {bc.confianza}
              </span>
            </div>
          </div>
        )}

        {/* KPIs */}
        {kpis.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Indicadores con puente financiero</p>
              {totalKpiDelta > 0 && (
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#3A6A4A', margin: 0 }}>
                  {fmt(totalKpiDelta)} potencial acumulado
                </p>
              )}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e4dd' }}>
                  {['Indicador', 'Actual', 'Objetivo', 'Δ Impacto €', 'Medición', 'Responsable'].map(h => (
                    <th key={h} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'left', padding: '5px 8px 5px 0', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi, i) => (
                  <tr key={kpi.id} style={{ borderBottom: i < kpis.length - 1 ? '1px solid #f0ece6' : undefined }}>
                    <td style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 11, color: '#222', padding: '7px 8px 7px 0', lineHeight: 1.3 }}>{kpi.nombre}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#555', padding: '7px 8px 7px 0' }}>
                      {kpi.baselineValor ?? '—'} {kpi.baselineValor != null ? kpi.unidad : ''}
                    </td>
                    <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#555', padding: '7px 8px 7px 0' }}>
                      {kpi.objetivoValor ?? '—'} {kpi.objetivoValor != null ? kpi.unidad : ''}
                    </td>
                    <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: kpi.deltaEuros ? '#3A6A4A' : '#aaa', padding: '7px 8px 7px 0', fontWeight: 400 }}>
                      {kpi.deltaEuros ? `+${fmt(kpi.deltaEuros)}` : '—'}
                    </td>
                    <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#888', padding: '7px 8px 7px 0' }}>{kpi.fechaMedicion || '—'}</td>
                    <td style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 10, color: '#888', padding: '7px 0' }}>{kpi.responsable || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Metadata table */}
        <div style={{ marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {d.businessImpact.plLever && (
                <Row label="Palanca P&L" value={d.businessImpact.plLever} />
              )}
              {d.businessImpact.riskOfInaction && (
                <Row label="Riesgo de no actuar" value={d.businessImpact.riskOfInaction} />
              )}
              {d.businessImpact.hypothesis && (
                <Row label="Hipótesis de impacto" value={d.businessImpact.hypothesis} />
              )}
              <Row label="Responsable" value={d.owner || 'Sin asignar'} />
              <Row label="Plazo" value={d.deadline || 'Sin definir'} />
              <Row label="Peso estratégico" value={d.weight} />
              <Row label="Horizonte de revisión" value={d.businessImpact.reviewHorizon || '—'} />
            </tbody>
          </table>
        </div>

        {/* Decision & prediction (if resolved) */}
        {d.status === 'resuelta' && d.selectedVerdict && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Decisión adoptada</p>
            <div style={{ padding: '12px 16px', borderLeft: '3px solid #3A6A4A', backgroundColor: '#f8faf9', marginBottom: 10 }}>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 15, color: '#111', margin: 0, lineHeight: 1.4 }}>
                {d.selectedVerdict}
              </p>
            </div>
            {d.prediccion && (
              <div style={{ padding: '10px 14px', borderLeft: '2px solid #C4952A', backgroundColor: '#fdf9f2' }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#C4952A', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 5px' }}>Predicción comprometida</p>
                <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, color: '#444', margin: 0, lineHeight: 1.5 }}>{d.prediccion}</p>
              </div>
            )}
          </div>
        )}

        {/* Actual results (if registered) */}
        {ar && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Resultados reales</p>
              {ar.varianzaPct != null && (
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
                  color: ar.varianzaPct >= -10 ? '#3A6A4A' : ar.varianzaPct >= -30 ? '#B5621A' : '#8A2A2A',
                }}>
                  Varianza: {ar.varianzaPct >= 0 ? '+' : ''}{ar.varianzaPct}%
                </span>
              )}
            </div>
            {ar.retornoReal != null && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, backgroundColor: '#ddd', marginBottom: 10 }}>
                {[
                  { label: 'Retorno esperado', value: bc?.retornoEsperado, color: '#555' },
                  { label: 'Retorno real', value: ar.retornoReal, color: '#3A6A4A' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ backgroundColor: 'white', padding: '10px 14px' }}>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 7, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 18, color, margin: 0 }}>
                      {value != null ? fmt(value) : '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: ar.narrativa ? 8 : 0 }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#888', letterSpacing: '0.07em' }}>HIPÓTESIS</span>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: ar.hypothesisStatus === 'confirmada' ? '#3A6A4A' : ar.hypothesisStatus === 'refutada' ? '#B5621A' : '#888',
                border: `1px solid ${ar.hypothesisStatus === 'confirmada' ? '#3A6A4A' : ar.hypothesisStatus === 'refutada' ? '#B5621A' : '#ccc'}`,
                padding: '1px 7px',
              }}>
                {ar.hypothesisStatus}
              </span>
            </div>
            {ar.narrativa && (
              <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, color: '#444', margin: 0, lineHeight: 1.6, borderLeft: '2px solid #3A6A4A', paddingLeft: 12 }}>
                {ar.narrativa}
              </p>
            )}
          </div>
        )}

        {/* Conditions summary */}
        {d.resolutionConditions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Condiciones de resolución — {d.resolutionConditions.filter(c => c.satisfied).length}/{d.resolutionConditions.length} cumplidas
            </p>
            {d.resolutionConditions.map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid #f0ece6' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: c.satisfied ? '#3A6A4A' : '#ccc', flexShrink: 0 }}>
                  {c.satisfied ? '✓' : '○'}
                </span>
                <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 11, color: c.satisfied ? '#666' : '#333', textDecoration: c.satisfied ? 'line-through' : 'none' }}>
                  {c.label}
                </span>
                {c.owner && <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: '#aaa', marginLeft: 'auto', flexShrink: 0 }}>{c.owner}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#aaa', margin: 0, letterSpacing: '0.06em' }}>
            STOA · Sistema de Decisiones Estratégicas · Confidencial
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#aaa', margin: 0, letterSpacing: '0.05em' }}>
            {d.id} · {dateStr}
          </p>
        </div>
      </div>
    </>
  )
}
