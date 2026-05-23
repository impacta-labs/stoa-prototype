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
  verdictOptions: string[]
  selectedVerdict: string | null
  settledAt: string | null
  deliberationEntries: DeliberationEntry[]
  resolutionConditions: ResolutionCondition[]
  hypothesisStatus?: HypothesisStatus
  retrospectiva?: string
}
