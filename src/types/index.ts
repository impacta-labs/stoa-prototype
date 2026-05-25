export type TipoInnovacion =
  | 'modelo de negocio'
  | 'proceso interno'
  | 'experiencia de cliente'
  | 'partnership'
  | 'expansión'
  | 'eficiencia operativa'
  | 'tecnología / IA'
  | 'cultura organizativa'

export type DecisionStatus = 'evaluacion' | 'deliberando' | 'resuelta' | 'memoria'
export type DecisionWeight = 'Menor' | 'Significativa' | 'Mayor' | 'Crítica'
export type EvidenceStatus = 'Sin datos' | 'Acumulando' | 'Suficiente' | 'Confirmada'
export type HypothesisStatus = 'confirmada' | 'parcialmente confirmada' | 'refutada' | 'inconclusa'

export interface BusinessImpact {
  hypothesis: string
  plLever: string
  leadingIndicators: string[]
  laggingIndicators: string[]
  responsible: string
  reviewHorizon: string
  operationalEffect: string
  riskOfInaction: string
  evidenceStatus: EvidenceStatus
}

export interface DeliberationEntry {
  id: string
  participant: string
  role: string
  text: string
  timestamp: string
}

export interface ResolutionCondition {
  id: string
  label: string
  owner: string
  due: string
  satisfied: boolean
}

export interface AIObservation {
  type: 'Observación' | 'Riesgo' | 'Indicador ausente' | 'Señal' | 'Recomendación' | 'Pregunta pendiente'
  text: string
}

export type ConfianzaNivel = 'Bajo' | 'Medio' | 'Alto'

export interface BusinessCase {
  costeProblemActual: number | null   // €/año — coste de no actuar
  inversionRequerida: number | null   // € total capex + opex
  retornoEsperado: number | null      // €/año — ahorro o ingreso incremental
  paybackMeses: number | null         // auto-calculated
  confianza: ConfianzaNivel
}

export interface InvestmentKPI {
  id: string
  nombre: string
  unidad: string                       // ej: "semanas", "días", "%", "M€"
  baselineValor: number | null
  baselineEuroUnidad: number | null   // € por unidad del KPI
  objetivoValor: number | null
  deltaEuros: number | null           // impacto financiero total si se alcanza objetivo
  fechaMedicion: string
  responsable: string
}

export interface KPIResult {
  kpiId: string
  valorAlcanzado: number | null
  deltaRealEuros: number | null
}

export interface ActualResults {
  registeredAt: string
  retornoReal: number | null          // €/año — lo que realmente ocurrió
  varianzaPct: number | null          // (retornoReal - retornoEsperado) / retornoEsperado × 100
  kpiResults: KPIResult[]
  narrativa: string
  hypothesisStatus: HypothesisStatus
}

export interface UserDecision {
  id: string
  titulo: string
  preguntaEstrategica: string
  tipoInnovacion: TipoInnovacion
  weight: DecisionWeight
  owner: string
  deadline: string
  opened: string
  status: DecisionStatus
  businessImpact: BusinessImpact
  businessCase?: BusinessCase
  kpis?: InvestmentKPI[]
  actualResults?: ActualResults
  verdictOptions: string[]
  selectedVerdict: string | null
  prediccion?: string
  settledAt: string | null
  deliberationEntries: DeliberationEntry[]
  resolutionConditions: ResolutionCondition[]
  hypothesisStatus?: HypothesisStatus
  retrospectiva?: string
}
