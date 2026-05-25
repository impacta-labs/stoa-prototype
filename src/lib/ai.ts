import type {
  TipoInnovacion,
  BusinessImpact,
  BusinessCase,
  UserDecision,
  ResolutionCondition,
  AIObservation,
} from '../types'
import { nextDecisionId } from '../store/decisions'

const ORG = 'la organización'

// ── Pregunta estratégica ─────────────────────────────────────────────────────

const PREGUNTA_TEMPLATES: Record<TipoInnovacion, (titulo: string) => string> = {
  'tecnología / IA': (titulo) => {
    const l = titulo.toLowerCase()
    if (l.includes('selección') || l.includes('seleccion') || l.includes('evaluación')) {
      return `¿Debe ${ORG} incorporar IA en la evaluación inicial de founders para reducir carga operativa sin deteriorar la calidad de selección?`
    }
    if (l.includes('proceso') || l.includes('flujo') || l.includes('operativo')) {
      return `¿Debe ${ORG} incorporar tecnología de IA en sus procesos operativos clave para ganar capacidad sin incrementar el coste?`
    }
    if (l.includes('datos') || l.includes('análisis')) {
      return `¿Debe ${ORG} incorporar análisis de datos avanzado para mejorar la calidad de sus decisiones estratégicas?`
    }
    return `¿Qué capacidad organizativa específica habilita "${titulo}" que no podemos conseguir de otra manera?`
  },
  'expansión': (titulo) => {
    const l = titulo.toLowerCase()
    const cities = ['madrid', 'lisboa', 'london', 'berlín', 'berlin', 'paris', 'amsterdam', 'valencia', 'bilbao', 'sevilla']
    const city = cities.find((c) => l.includes(c))
    if (city) {
      const capitalized = city.charAt(0).toUpperCase() + city.slice(1)
      return `¿Debe ${ORG} abrir una presencia operativa en ${capitalized}, y qué perdemos si esperamos un año?`
    }
    return `¿Qué hace que el momento sea el correcto para esta expansión, y qué perdemos si esperamos doce meses?`
  },
  'modelo de negocio': () =>
    `¿Qué condiciones deben cumplirse para que el nuevo modelo de negocio sea la decisión correcta, y qué señal nos indicaría que nos hemos equivocado?`,
  'proceso interno': (titulo) => {
    const l = titulo.toLowerCase()
    if (l.includes('selección') || l.includes('seleccion')) {
      return `¿Debe ${ORG} rediseñar su proceso de selección para mejorar el encaje y reducir el coste operativo por candidato?`
    }
    return `¿Cómo puede ${ORG} rediseñar este proceso para mejorar la eficiencia sin comprometer la calidad del resultado?`
  },
  'experiencia de cliente': () =>
    `¿Debe ${ORG} rediseñar la experiencia de practitioners y founders para mejorar el encaje relacional y la retención a largo plazo?`,
  'partnership': (titulo) => {
    const l = titulo.toLowerCase()
    if (l.includes('fundación') || l.includes('fundacio') || l.includes('instituc')) {
      return `¿Debe ${ORG} formalizar esta colaboración institucional, y en qué términos preserva nuestra autonomía?`
    }
    return `¿Qué tipo de relación debe ser este partnership para ser estratégicamente duradera, y quién debe ser parte de ella?`
  },
  'eficiencia operativa': () =>
    `¿Debe ${ORG} rediseñar sus operaciones para liberar capacidad interna y reducir el coste por unidad de actividad?`,
  'cultura organizativa': () =>
    `¿Qué cambia realmente en cómo trabajamos si esta iniciativa tiene éxito, y estamos preparados para esa transformación?`,
}

// ── Palanca P&L ──────────────────────────────────────────────────────────────

const PL_LEVERS: Record<TipoInnovacion, string> = {
  'tecnología / IA': 'Productividad · capacidad operativa · reducción de coste',
  'expansión': 'Crecimiento de ingresos · expansión del ecosistema',
  'modelo de negocio': 'Diversificación de ingresos · mejora de margen',
  'proceso interno': 'Eficiencia operativa · reducción de coste por unidad',
  'experiencia de cliente': 'Retención · satisfacción · recomendación',
  'partnership': 'Acceso a capacidades · reducción del coste de desarrollo',
  'eficiencia operativa': 'Reducción de coste operativo · mejora de margen',
  'cultura organizativa': 'Retención de talento · cohesión · productividad',
}

// ── Indicadores ──────────────────────────────────────────────────────────────

const LEADING_INDICATORS: Record<TipoInnovacion, string[]> = {
  'tecnología / IA': [
    'Tiempo de proceso por unidad antes y después de la implementación',
    'Tasa de adopción interna del nuevo flujo de trabajo',
    'Errores detectados por el sistema vs. proceso manual',
  ],
  'expansión': [
    'Solicitudes cualificadas provenientes del nuevo territorio',
    'Partners locales identificados y en conversación activa',
    'Tasa de conversión de interés a compromiso formal',
  ],
  'modelo de negocio': [
    'Porcentaje de ingresos provenientes de la nueva fuente',
    'Conversaciones activas con potenciales clientes del nuevo modelo',
    'Tiempo medio de conversión desde contacto a contrato',
  ],
  'proceso interno': [
    'Tiempo de ciclo del proceso rediseñado vs. línea base',
    'Satisfacción del equipo afectado con el nuevo proceso',
    'Número de incidencias o retrabajos por ciclo',
  ],
  'experiencia de cliente': [
    'Satisfacción de practitioners en primeras interacciones (escala interna)',
    'Tasa de finalización del proceso sin fricciones',
    'Señales de desorientación o abandono en las primeras semanas',
  ],
  'partnership': [
    'Reuniones formales completadas con el partner',
    'Entregables compartidos o co-creados en los primeros 90 días',
    'Satisfacción del equipo interno con la colaboración',
  ],
  'eficiencia operativa': [
    'Horas operativas ahorradas por semana tras el cambio',
    'Reducción del tiempo de respuesta a tareas clave',
    'Adopción del nuevo proceso por el equipo afectado',
  ],
  'cultura organizativa': [
    'Participación del equipo en sesiones de revisión cultural',
    'Número de iniciativas alineadas con los valores revisados',
    'Señales cualitativas de cambio en conversaciones internas',
  ],
}

const LAGGING_INDICATORS: Record<TipoInnovacion, string[]> = {
  'tecnología / IA': [
    'Reducción del coste operativo por unidad de capacidad',
    'Calidad de los resultados (retención, tasa de error final)',
    'Capacidad adicional liberada para tareas de mayor valor',
  ],
  'expansión': [
    'Ingresos generados por la nueva presencia en año 1 y año 2',
    'Margen operativo de la nueva sede en año 2',
    'Retención de cohortes del nuevo territorio',
  ],
  'modelo de negocio': [
    'Ingresos netos del nuevo modelo vs. modelo anterior',
    'Margen neto por línea de actividad',
    'Dependencia de fuentes de ingresos (índice de concentración)',
  ],
  'proceso interno': [
    'Reducción de tiempo total del proceso vs. línea base',
    'Coste operativo asociado al proceso antes y después',
    'Calidad del output medida por stakeholders clave',
  ],
  'experiencia de cliente': [
    'Tasa de retención a 12 meses vs. cohorte anterior',
    'Ingresos generados por recomendaciones de practitioners existentes',
    'Coste de adquisición vs. coste de retención',
  ],
  'partnership': [
    'Valor generado por el partnership a 18 meses (ingresos, capacidad o visibilidad)',
    'Renovación o ampliación del acuerdo en la primera revisión',
    'Impacto en el margen operativo propio',
  ],
  'eficiencia operativa': [
    'Reducción porcentual del coste operativo en el área afectada',
    'Mejora de margen en relación con la actividad del área',
    'Capacidad del equipo redirigida a actividades de mayor valor',
  ],
  'cultura organizativa': [
    'Retención del equipo a 18 meses tras el proceso',
    'Calidad de decisiones tomadas bajo el nuevo marco cultural',
    'Percepción externa de coherencia institucional',
  ],
}

// ── Hipótesis de impacto ─────────────────────────────────────────────────────

function generarHipotesis(titulo: string, tipo: TipoInnovacion): string {
  const l = titulo.toLowerCase()
  if (tipo === 'tecnología / IA') {
    if (l.includes('selección') || l.includes('seleccion') || l.includes('founders')) {
      return `Incorporar IA en la evaluación inicial de founders reducirá el tiempo de revisión por solicitud en un 30–40% y permitirá procesar un mayor volumen sin incrementar el equipo dedicado, sin deteriorar la calidad percibida de selección.`
    }
    return `La adopción de herramientas de IA en "${titulo}" liberará capacidad operativa significativa, permitiendo al equipo concentrarse en tareas de mayor valor sin incrementar el coste total.`
  }
  if (tipo === 'expansión') {
    return `Esta iniciativa de expansión generará una nueva fuente de ingresos y ampliará el ecosistema de ${ORG}, con un retorno positivo estimado en el año 2 de operación.`
  }
  if (tipo === 'eficiencia operativa') {
    return `Rediseñar este proceso liberará capacidad operativa equivalente a entre un 15 y un 25% del tiempo actual dedicado, con reducción directa del coste por unidad de actividad.`
  }
  if (tipo === 'partnership') {
    return `Este partnership ampliará la capacidad de ${ORG} sin incrementar los costes fijos, generando valor a través de recursos compartidos y acceso a redes complementarias.`
  }
  return `Esta iniciativa producirá un impacto positivo y medible en la cuenta de explotación de ${ORG} dentro del horizonte de revisión establecido, si las condiciones de activación se cumplen.`
}

// ── Riesgo de no actuar ─────────────────────────────────────────────────────

function generarRiesgoNoActuar(_titulo: string, tipo: TipoInnovacion): string {
  if (tipo === 'tecnología / IA') {
    return `Sin esta iniciativa, la carga operativa del proceso actual continuará creciendo con el volumen, limitando la capacidad de crecimiento de la organización sin incremento proporcional de equipo.`
  }
  if (tipo === 'expansión') {
    return `La ventana de oportunidad en el nuevo territorio puede cerrarse. Organizaciones competidoras pueden consolidar posición, aumentando el coste de entrada futuro.`
  }
  if (tipo === 'eficiencia operativa') {
    return `El proceso actual continúa consumiendo tiempo del equipo que podría dedicarse a actividades de mayor valor. El coste de oportunidad se acumula cada trimestre de inacción.`
  }
  if (tipo === 'proceso interno') {
    return `Sin rediseñar este proceso, el equipo continuará absorbiendo ineficiencias que limitan su capacidad de atención a tareas de mayor impacto.`
  }
  return `No actuar implica mantener el statu quo con sus costes y limitaciones actuales, mientras el entorno organizativo continúa cambiando.`
}

// ── Efecto operativo ─────────────────────────────────────────────────────────

function generarEfectoOperativo(_titulo: string, tipo: TipoInnovacion): string {
  if (tipo === 'tecnología / IA') {
    return `Capacidad operativa ampliada sin incremento de equipo. El tiempo liberado permite atender mayor volumen o redirigir atención a tareas de mayor complejidad y valor.`
  }
  if (tipo === 'expansión') {
    return `Nueva línea de actividad en el territorio objetivo. Incremento del alcance del ecosistema y diversificación de la base de ingresos.`
  }
  if (tipo === 'eficiencia operativa') {
    return `Reducción del tiempo de ciclo del proceso afectado. Capacidad adicional del equipo disponible para actividades de mayor valor estratégico.`
  }
  return `Mejora de la eficiencia y la capacidad en el área afectada, con impacto positivo en el margen operativo dentro del horizonte de revisión.`
}

// ── Horizonte de revisión ────────────────────────────────────────────────────

function derivarHorizonte(deadline: string): string {
  if (!deadline) return 'Q2 siguiente año'
  if (deadline.startsWith('Q')) {
    const [q, y] = deadline.split(' ')
    const qNum = parseInt(q.replace('Q', ''))
    const year = parseInt(y)
    const nextQNum = qNum >= 4 ? 1 : qNum + 2
    const nextYear = qNum >= 3 ? year + 1 : year
    return `Q${nextQNum} ${nextYear}`
  }
  return 'Q4 siguiente año'
}

// ── Opciones de resolución ──────────────────────────────────────────────────

const VERDICT_OPTIONS: Record<TipoInnovacion, string[]> = {
  'tecnología / IA': ['Implementar piloto acotado', 'Adoptar en toda la operación', 'Evaluar alternativas antes de decidir', 'Aplazar — sin urgencia operativa'],
  'expansión': ['Proceder en el plazo previsto', 'Aplazar un año', 'Modelo de partnerships sin sede propia', 'Replantear la pregunta'],
  'modelo de negocio': ['Transición al nuevo modelo', 'Modelo híbrido durante 12 meses', 'Piloto con segmento acotado', 'Mantener el modelo actual'],
  'proceso interno': ['Rediseñar el proceso completo', 'Mejora incremental', 'Piloto en área acotada', 'Aplazar — prioridades distintas'],
  'experiencia de cliente': ['Rediseñar la experiencia completa', 'Mejoras puntuales en fricción detectada', 'Piloto con cohorte reducida', 'Mantener el enfoque actual'],
  'partnership': ['Formalizar partnership estratégico', 'Acuerdo de colaboración puntual', 'Exploración informal durante 6 meses', 'No proceder'],
  'eficiencia operativa': ['Rediseñar y lanzar en Q actual', 'Piloto en equipo acotado', 'Mejoras incrementales sin rediseño', 'Aplazar al siguiente ciclo'],
  'cultura organizativa': ['Iniciar proceso formal de revisión', 'Intervenciones puntuales sin proceso formal', 'Diagnóstico externo antes de actuar', 'Aplazar'],
}

// ── Condiciones de resolución ────────────────────────────────────────────────

function generarCondiciones(tipo: TipoInnovacion): ResolutionCondition[] {
  const templates: Record<TipoInnovacion, Array<{ label: string }>> = {
    'tecnología / IA': [
      { label: 'Proceso actual documentado y métricas de línea base establecidas' },
      { label: 'Criterios de calidad del resultado definidos y acordados por el equipo' },
      { label: 'Piloto acotado diseñado con indicadores de evaluación claros' },
    ],
    'expansión': [
      { label: 'Pregunta fundadora del nuevo territorio articulada y validada' },
      { label: 'Partner o financiación identificada en fase de carta de intención' },
      { label: 'Responsable de la nueva presencia designado' },
    ],
    'modelo de negocio': [
      { label: 'Modelo financiero proyectado a 3 años revisado y aceptado' },
      { label: 'Segmento objetivo validado con al menos 3 conversaciones reales' },
      { label: 'Plan de transición con hitos y responsables definido' },
    ],
    'proceso interno': [
      { label: 'Diagnóstico del proceso actual completado y validado' },
      { label: 'Diseño del nuevo proceso revisado por los responsables operativos' },
      { label: 'Plan de implementación con métricas de seguimiento aprobado' },
    ],
    'experiencia de cliente': [
      { label: 'Mapa de la experiencia actual con fricciones identificadas' },
      { label: 'Propuesta de nuevo diseño validada con al menos 5 usuarios reales' },
      { label: 'Métricas de éxito de la nueva experiencia definidas' },
    ],
    'partnership': [
      { label: 'Términos del acuerdo revisados por ambas partes' },
      { label: 'Entregables del primer trimestre definidos y acordados' },
      { label: 'Cláusula de revisión y salida incluida en el acuerdo' },
    ],
    'eficiencia operativa': [
      { label: 'Diagnóstico del proceso actual con cuantificación de la ineficiencia' },
      { label: 'Diseño del proceso optimizado aprobado por el equipo afectado' },
      { label: 'Métricas de seguimiento post-implementación definidas' },
    ],
    'cultura organizativa': [
      { label: 'Diagnóstico de situación actual completado con el equipo' },
      { label: 'Objetivos del proceso de revisión definidos y compartidos' },
      { label: 'Responsable del proceso designado con tiempo asignado' },
    ],
  }

  return (templates[tipo] || []).map((t, i) => ({
    id: `RC-${i + 1}`,
    label: t.label,
    owner: 'Por asignar',
    due: 'Por definir',
    satisfied: false,
  }))
}

// ── Función principal: generar decisión completa ──────────────────────────────

export function generarDecision(params: {
  titulo: string
  tipo: TipoInnovacion
  weight: 'Menor' | 'Significativa' | 'Mayor' | 'Crítica'
  owner: string
  deadline: string
  decisions: UserDecision[]
}): UserDecision {
  const { titulo, tipo, weight, owner, deadline, decisions } = params
  const id = nextDecisionId(decisions)

  const businessImpact: BusinessImpact = {
    hypothesis: generarHipotesis(titulo, tipo),
    plLever: PL_LEVERS[tipo] ?? 'Por definir',
    leadingIndicators: LEADING_INDICATORS[tipo] ?? [],
    laggingIndicators: LAGGING_INDICATORS[tipo] ?? [],
    responsible: owner,
    reviewHorizon: derivarHorizonte(deadline),
    operationalEffect: generarEfectoOperativo(titulo, tipo),
    riskOfInaction: generarRiesgoNoActuar(titulo, tipo),
    evidenceStatus: 'Sin datos',
  }

  return {
    id,
    titulo,
    preguntaEstrategica: PREGUNTA_TEMPLATES[tipo]?.(titulo) ?? `¿Debe ${ORG} avanzar con la iniciativa "${titulo}"?`,
    tipoInnovacion: tipo,
    weight,
    owner,
    deadline,
    opened: new Date().toISOString(),
    status: 'evaluacion',
    businessImpact,
    verdictOptions: VERDICT_OPTIONS[tipo] ?? ['Proceder', 'Aplazar', 'Replantear'],
    selectedVerdict: null,
    settledAt: null,
    deliberationEntries: [],
    resolutionConditions: generarCondiciones(tipo),
  }
}

// ── Análisis de decisión ─────────────────────────────────────────────────────

export function analizarDecision(d: UserDecision): AIObservation[] {
  const obs: AIObservation[] = []

  if (!d.businessImpact.hypothesis || d.businessImpact.hypothesis.startsWith('Esta iniciativa producirá')) {
    obs.push({ type: 'Indicador ausente', text: 'La hipótesis de impacto es genérica. Especificar qué cambio concreto y medible esperamos produces mayor capacidad de revisión.' })
  }

  if (!d.businessImpact.leadingIndicators.length) {
    obs.push({ type: 'Indicador ausente', text: 'La decisión no tiene indicadores tempranos. Sin ellos, no es posible revisar la apuesta antes de que los indicadores finales sean visibles.' })
  }

  if (!d.businessImpact.plLever) {
    obs.push({ type: 'Indicador ausente', text: 'La palanca de cuenta de explotación no está identificada. ¿Afecta esto a ingresos, coste, margen o eficiencia?' })
  }

  if (!d.owner) {
    obs.push({ type: 'Riesgo', text: 'La decisión no tiene responsable asignado. Sin propietario claro, el cierre y la revisión son difíciles de garantizar.' })
  }

  if (!d.deadline) {
    obs.push({ type: 'Pregunta pendiente', text: 'No hay plazo definido. Sin horizonte temporal, la deliberación puede prolongarse indefinidamente.' })
  }

  if (d.deliberationEntries.length === 0) {
    obs.push({ type: 'Señal', text: 'La decisión no tiene notas de deliberación. El razonamiento debe quedar registrado, no solo la conclusión.' })
  }

  if (!d.businessImpact.riskOfInaction) {
    obs.push({ type: 'Riesgo', text: 'No se ha evaluado el riesgo de no actuar. Esta perspectiva es necesaria para una deliberación completa.' })
  }

  const unmet = d.resolutionConditions.filter((c) => !c.satisfied)
  if (unmet.length > 0) {
    obs.push({ type: 'Observación', text: `Quedan ${unmet.length} condición${unmet.length > 1 ? 'es' : ''} de resolución sin cumplir: ${unmet.map((c) => c.label).join('; ')}.` })
  }

  if (obs.length === 0) {
    obs.push({ type: 'Observación', text: 'La decisión está bien estructurada: tiene hipótesis, indicadores, responsable y plazo. Proceder a deliberación y resolución.' })
  }

  return obs
}

// ── Patrones de innovación (para Clima) ──────────────────────────────────────

export function detectarPatrones(
  decisions: UserDecision[]
): Array<{ label: string; description: string; tracedTo: string[] }> {
  if (decisions.length === 0) return []

  const patterns: Array<{ label: string; description: string; tracedTo: string[] }> = []

  const sinIndicadores = decisions.filter(
    (d) => d.status !== 'resuelta' && d.businessImpact.leadingIndicators.length === 0
  )
  if (sinIndicadores.length > 0) {
    patterns.push({
      label: `${sinIndicadores.length} iniciativa${sinIndicadores.length > 1 ? 's' : ''} sin indicadores tempranos`,
      description: `Sin indicadores tempranos, no es posible distinguir actividad de evidencia. Estas iniciativas necesitan indicadores antes de la próxima sesión del Consejo.`,
      tracedTo: sinIndicadores.map((d) => d.id),
    })
  }

  const tiposCount: Record<string, number> = {}
  decisions.forEach((d) => {
    tiposCount[d.tipoInnovacion] = (tiposCount[d.tipoInnovacion] || 0) + 1
  })
  const dominant = Object.entries(tiposCount).sort((a, b) => b[1] - a[1])[0]
  if (dominant && dominant[1] > 1) {
    patterns.push({
      label: `Concentración en innovación de tipo "${dominant[0]}"`,
      description: `${dominant[1]} de ${decisions.length} iniciativas son de tipo "${dominant[0]}". Puede indicar un patrón estratégico deliberado o una zona de confort. Verificar si hay áreas estratégicas sin iniciativas activas.`,
      tracedTo: decisions.filter((d) => d.tipoInnovacion === dominant[0]).map((d) => d.id),
    })
  }

  const resueltas = decisions.filter((d) => d.status === 'resuelta')
  if (resueltas.length > 0) {
    patterns.push({
      label: `${resueltas.length} iniciativa${resueltas.length > 1 ? 's' : ''} completó el ciclo decisión → resolución`,
      description: `${resueltas.map((d) => d.titulo).join(', ')} ha${resueltas.length > 1 ? 'n' : ''} pasado por el proceso completo: iniciativa → decisión → hipótesis → resolución. Revisar evidencia en ${derivarHorizonte(resueltas[0].deadline)}.`,
      tracedTo: resueltas.map((d) => d.id),
    })
  }

  const sinHipotesis = decisions.filter((d) => d.status !== 'resuelta' && !d.businessImpact.hypothesis)
  if (sinHipotesis.length > 0) {
    patterns.push({
      label: `${sinHipotesis.length} iniciativa${sinHipotesis.length > 1 ? 's' : ''} sin hipótesis de impacto económico`,
      description: `La innovación sin hipótesis de impacto es actividad, no aprendizaje organizativo. Formalizar la hipótesis es el primer paso para vincular innovación a la cuenta de explotación.`,
      tracedTo: sinHipotesis.map((d) => d.id),
    })
  }

  return patterns
}

// ── IA real: generar decisión vía proxy ─────────────────────────────────────

export async function generarDecisionIA(params: {
  titulo: string
  tipo: TipoInnovacion
  weight: 'Menor' | 'Significativa' | 'Mayor' | 'Crítica'
  owner: string
  deadline: string
  decisions: UserDecision[]
  orgName?: string
}): Promise<UserDecision> {
  const { titulo, tipo, weight, owner, deadline, decisions, orgName } = params
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateDecision',
        params: { titulo, tipo, orgName: orgName || ORG },
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { data } = await res.json()

    const id = nextDecisionId(decisions)
    const businessImpact: BusinessImpact = {
      hypothesis: data.hipotesis,
      plLever: data.plLever || PL_LEVERS[tipo] || 'Por definir',
      leadingIndicators: data.indicadoresLideres ?? [],
      laggingIndicators: LAGGING_INDICATORS[tipo] ?? [],
      responsible: owner,
      reviewHorizon: derivarHorizonte(deadline),
      operationalEffect: generarEfectoOperativo(titulo, tipo),
      riskOfInaction: data.riesgoNoActuar,
      evidenceStatus: 'Sin datos',
    }

    const ci = data.casoInversion
    const businessCase: BusinessCase | undefined = ci ? {
      costeProblemActual: typeof ci.costeProblemActual === 'number' ? ci.costeProblemActual : null,
      inversionRequerida: typeof ci.inversionRequerida === 'number' ? ci.inversionRequerida : null,
      retornoEsperado: typeof ci.retornoEsperado === 'number' ? ci.retornoEsperado : null,
      paybackMeses: (typeof ci.inversionRequerida === 'number' && typeof ci.retornoEsperado === 'number' && ci.retornoEsperado > 0)
        ? Math.round((ci.inversionRequerida / (ci.retornoEsperado / 12)) * 10) / 10
        : null,
      confianza: ['Bajo', 'Medio', 'Alto'].includes(ci.confianza) ? ci.confianza : 'Medio',
    } : undefined

    const kpis = Array.isArray(data.kpis)
      ? data.kpis.map((k: any, i: number) => ({
          id: `KPI-${Date.now()}-${i}`,
          nombre: k.nombre ?? '',
          unidad: k.unidad ?? '',
          baselineValor: typeof k.baselineValor === 'number' ? k.baselineValor : null,
          baselineEuroUnidad: typeof k.baselineEuroUnidad === 'number' ? k.baselineEuroUnidad : null,
          objetivoValor: typeof k.objetivoValor === 'number' ? k.objetivoValor : null,
          deltaEuros: typeof k.deltaEuros === 'number' ? k.deltaEuros : null,
          fechaMedicion: k.fechaMedicion ?? '',
          responsable: k.responsable ?? '',
        }))
      : undefined

    return {
      id,
      titulo,
      preguntaEstrategica: data.preguntaEstrategica,
      tipoInnovacion: tipo,
      weight,
      owner,
      deadline,
      opened: new Date().toISOString(),
      status: 'evaluacion',
      businessImpact,
      businessCase,
      kpis,
      verdictOptions: VERDICT_OPTIONS[tipo] ?? ['Proceder', 'Aplazar', 'Replantear'],
      selectedVerdict: null,
      settledAt: null,
      deliberationEntries: [],
      resolutionConditions: generarCondiciones(tipo),
    }
  } catch {
    return generarDecision(params)
  }
}

// ── IA real: resumen del Consejo vía proxy ───────────────────────────────────

export async function generarResumenConsejoIA(
  decisions: UserDecision[],
  sessionRef: string,
  date: string,
  orgName?: string
): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateCouncilSummary',
        params: { decisions, sessionRef, date, orgName: orgName || ORG },
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { data } = await res.json()
    return data as string
  } catch {
    return generarResumenConsejo(decisions, sessionRef, date)
  }
}

// ── Resumen del Consejo ──────────────────────────────────────────────────────

export function generarResumenConsejo(decisions: UserDecision[], sessionRef: string, date: string): string {
  const activas = decisions.filter((d) => d.status === 'evaluacion' || d.status === 'deliberando')
  const resueltas = decisions.filter((d) => d.status === 'resuelta')

  const lines: string[] = [
    `RESUMEN DE CONSEJO — ${sessionRef} · ${date}`,
    `${ORG}`,
    ``,
    `INICIATIVAS REVISADAS (${activas.length})`,
    ...activas.map(
      (d) =>
        `· ${d.id} · ${d.titulo}\n  Responsable: ${d.owner || 'Sin asignar'} · Plazo: ${d.deadline || 'Sin definir'}\n  Hipótesis: ${d.businessImpact.hypothesis.slice(0, 100)}…`
    ),
    activas.length === 0 ? '· Ninguna iniciativa activa en el sistema' : '',
    ``,
    `DECISIONES RESUELTAS (${resueltas.length})`,
    ...resueltas.map(
      (d) =>
        `· ${d.id} · ${d.titulo}\n  Responsable: ${d.owner || 'Sin asignar'}\n  Resolución: ${d.selectedVerdict}${d.prediccion ? `\n  Predicción: ${d.prediccion}` : ''}\n  Palanca: ${d.businessImpact.plLever}\n  Revisión: ${d.businessImpact.reviewHorizon}`
    ),
    resueltas.length === 0 ? '· Ninguna decisión resuelta en esta sesión' : '',
    ``,
    `HIPÓTESIS DE IMPACTO`,
    ...decisions
      .filter((d) => d.businessImpact.hypothesis)
      .map(
        (d) =>
          `· ${d.id} — Palanca: ${d.businessImpact.plLever}\n  Indicadores tempranos: ${d.businessImpact.leadingIndicators.slice(0, 2).join(' · ')}`
      ),
    ``,
    `PRÓXIMAS REVISIONES`,
    ...decisions
      .filter((d) => d.businessImpact.reviewHorizon)
      .map((d) => `· ${d.id} · Revisión de evidencia: ${d.businessImpact.reviewHorizon} · Responsable: ${d.owner || 'Sin asignar'}`),
    ``,
    `Generado por STOA · ${date}`,
  ]

  return lines.filter((l) => l !== undefined).join('\n')
}

// ── IA real: diagnóstico de portfolio ────────────────────────────────────────

export async function generarDiagnosticoPortfolioIA(
  decisions: UserDecision[],
  orgName?: string,
  sector?: string
): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'portfolioDiagnosis',
        params: { decisions, orgName: orgName || ORG, sector: sector || '' },
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { data } = await res.json()
    return data as string
  } catch {
    const activas = decisions.filter((d) => d.status !== 'resuelta')
    const resueltas = decisions.filter((d) => d.status === 'resuelta')
    if (decisions.length === 0) return 'Sin decisiones registradas. Crea la primera iniciativa para comenzar el diagnóstico del portfolio.'
    return `Portfolio de ${orgName || 'la organización'}: ${activas.length} iniciativa${activas.length !== 1 ? 's' : ''} activa${activas.length !== 1 ? 's' : ''}, ${resueltas.length} resuelta${resueltas.length !== 1 ? 's' : ''}. Registra más deliberaciones para obtener un diagnóstico completo.`
  }
}
