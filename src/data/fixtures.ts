// Alpha Espai — registro operativo a 23 de mayo de 2026

export const organization = {
  name: 'Alpha Espai',
  chapter: 'Capítulo III — La Arquitectura de la Permanencia',
  period: 'Primavera 2026',
  founded: 2018,
  location: 'Barcelona, Poblenou',
  participants: 7,
  focus: 'Residencia estratégica · infraestructura cultural independiente · compromiso a largo plazo',
}

export const systemStatus = {
  lastSync: '23 May 2026 · 09:42',
  sessionRef: 'S-027',
  sessionActive: true,
  pendingActions: 3,
  overdueDecisions: 1,
}

export const weeklyStanding = {
  deliberationLoad: 'Intensa',
  deliberationLoadTrend: '↑ En aumento',
  activeDecisions: 5,
  activeDecisionsChange: '+2 vs. trimestre anterior',
  settledThisQuarter: 2,
  settledThisQuarterChange: '— sin cambios',
  memoryEntries: 42,
  memoryEntriesChange: '+3 este mes',
  activeParticipants: 7,
  lastConvened: '19 May 2026',
  nextCouncil: '30 May 2026',
}

export const councilHistory = [
  {
    ref: 'S-026',
    date: '16 May 2026',
    focus: 'Primera revisión de D-042 · D-046 marcada urgente',
    attendees: 4,
    summary: 'Primera revisión formal de la cuestión de Lisboa. E. Vidal planteó la urgencia del contrato D-046. P. Soler solicitó más tiempo para formular la pregunta fundadora.',
  },
  {
    ref: 'S-025',
    date: '09 May 2026',
    focus: 'Preparación D-044 Miró · actualización del ciclo de residencia',
    attendees: 5,
    summary: 'Preparación de la colaboración con la Fundación. Solicitudes de residencia confirmadas en 47. D-046 mencionada informalmente sin escalada formal.',
  },
  {
    ref: 'S-024',
    date: '02 May 2026',
    focus: 'Planificación Q2 · pre-encuadre de D-042',
    attendees: 4,
    summary: 'Sesión de planificación trimestral. D-042 pre-encuadrada antes de su apertura formal. Gobernanza v3 funcionando correctamente según D-037.',
  },
]

export const inDeliberation = [
  {
    id: 'D-042',
    title: '¿Debe Alpha Espai abrir una presencia satélite en Lisboa en 2026?',
    opened: '12 May 2026',
    daysActive: 11,
    deliberationEntries: 8,
    lastActivity: 'hace 1 día',
    weight: 'Mayor',
    status: 'deliberating' as const,
    owner: 'Marta Ferrer',
    deadline: 'Q2 2026',
    overdue: false,
    ref: 'D-042',
  },
  {
    id: 'D-046',
    title: 'Renovación del contrato del estudio en Poblenou — nuevas condiciones',
    opened: '05 Abr 2026',
    daysActive: 48,
    deliberationEntries: 2,
    lastActivity: 'hace 12 días',
    weight: 'Crítica',
    status: 'overdue' as const,
    owner: 'Elena Vidal',
    deadline: 'Abr 2026',
    overdue: true,
    ref: 'D-046',
  },
  {
    id: 'D-044',
    title: '¿Aceptar la colaboración institucional con la Fundació Joan Miró?',
    opened: '28 Abr 2026',
    daysActive: 25,
    deliberationEntries: 3,
    lastActivity: 'hace 3 días',
    weight: 'Significativa',
    status: 'deliberating' as const,
    owner: 'Elena Vidal',
    deadline: 'Q2 2026',
    overdue: false,
    ref: 'D-044',
  },
  {
    id: 'D-043',
    title: '¿Ampliar el programa de residencia a una estancia de 18 meses?',
    opened: '03 May 2026',
    daysActive: 20,
    deliberationEntries: 1,
    lastActivity: 'hace 5 días',
    weight: 'Significativa',
    status: 'open' as const,
    owner: 'Pau Soler',
    deadline: 'Q3 2026',
    overdue: false,
    ref: 'D-043',
  },
  {
    id: 'D-045',
    title: 'Encargar una evaluación independiente de los resultados del programa de residencia 2025–2026',
    opened: '21 May 2026',
    daysActive: 2,
    deliberationEntries: 0,
    lastActivity: 'Abierta hoy',
    weight: 'Menor',
    status: 'open' as const,
    owner: 'Javier Ruiz',
    deadline: 'Q3 2026',
    overdue: false,
    ref: 'D-045',
  },
]

export const ripeningPredictions = [
  {
    id: 'P-019',
    signal: 'Ventana del mercado de alquiler en Lisboa — Jul 2026',
    trigger: 'Se requiere la resolución de D-042 antes del 23 Jun para preservar tres propiedades disponibles',
    urgency: 'high' as const,
  },
  {
    id: 'P-020',
    signal: 'Consejo de la Fundació Miró convoca — 10 Jun 2026',
    trigger: 'La posición sobre D-044 debe comunicarse a la Fundación antes del 06 Jun',
    urgency: 'high' as const,
  },
  {
    id: 'P-024',
    signal: 'Extensión informal del propietario de Poblenou vence — 31 May 2026',
    trigger: 'D-046 requiere respuesta formal antes de fin de mes o el contrato caduca',
    urgency: 'high' as const,
  },
]

export const recentlySettled = [
  {
    id: 'D-039',
    title: 'Discontinuar el programa de convocatorias abiertas por cohortes',
    settled: '14 Mar 2026',
    verdict: 'Resuelta — Programa discontinuado; modelo sustituido por afiliaciones a largo plazo',
    thread: 'M-017',
    hypothesisStatus: 'parcialmente confirmada' as const,
    retrospective: 'La reducción de convocatorias abiertas mejoró el encaje de founders, pero redujo el volumen inicial del funnel. La hipótesis original quedó parcialmente confirmada.',
  },
  {
    id: 'D-037',
    title: 'Adoptar el marco de gobernanza revisado (v3)',
    settled: '08 Ene 2026',
    verdict: 'Resuelta — Nuevo marco operativo desde Q1 2026. Sección 4.2 contempla operación multi-sede',
    thread: 'M-015',
    hypothesisStatus: 'confirmada' as const,
    retrospective: 'La gobernanza v3 ha funcionado conforme a lo previsto. La sección 4.2 ya se aplica en la deliberación sobre Lisboa.',
  },
  {
    id: 'D-035',
    title: 'Reducir el programa de exposiciones a cuatro producciones anuales',
    settled: '19 Nov 2025',
    verdict: 'Modificada — Tres producciones confirmadas; cuarta en reserva pendiente de revisión de recursos',
    thread: 'M-013',
    hypothesisStatus: 'parcialmente confirmada' as const,
    retrospective: 'La reducción mejoró la calidad por producción pero el cuarto slot permanece en suspenso. Impacto en cuenta de explotación por confirmar.',
  },
  {
    id: 'D-033',
    title: 'Abandonar la participación en el circuito anual de ferias culturales',
    settled: '14 Ago 2025',
    verdict: 'Resuelta — Retirada del circuito 2025–2026; recursos reasignados al programa de residencia',
    thread: 'M-011',
    hypothesisStatus: 'confirmada' as const,
    retrospective: 'La salida del circuito liberó recursos equivalentes a un 12% del presupuesto operativo, reinvertidos en el programa de residencia.',
  },
  {
    id: 'D-031',
    title: 'Adoptar un marco de compensación para practitioners residentes',
    settled: '03 Jun 2025',
    verdict: 'Resuelta con enmienda — Estipendio base elevado a €800/mes desde Q3 2025',
    thread: 'M-010',
    hypothesisStatus: 'confirmada' as const,
    retrospective: 'La mejora de la compensación aumentó la retención y la calidad de solicitudes en el siguiente ciclo. Hipótesis confirmada.',
  },
]

export const memoryBand = [
  { id: 'M-017', title: 'Por qué dejamos de organizar convocatorias abiertas', date: '14 Mar 2026' },
  { id: 'M-016', title: 'Sobre la arquitectura del compromiso a largo plazo', date: '22 Feb 2026' },
  { id: 'M-015', title: 'Gobernanza v3: el razonamiento detrás de los cambios', date: '08 Ene 2026' },
  { id: 'M-014', title: 'Lo que Lisboa representa para esta organización', date: '15 Dic 2025' },
  { id: 'M-013', title: 'La economía de la exposición: un balance honesto', date: '19 Nov 2025' },
  { id: 'M-011', title: 'Por qué abandonamos el circuito de ferias', date: '14 Ago 2025' },
  { id: 'M-010', title: 'Compensación y compromiso: la relación con el practitioner', date: '03 Jun 2025' },
]

// Structured content item types for Council stations
export type StationItemType = 'note' | 'resolved' | 'action' | 'schedule' | 'signal' | 'attributed'

export interface StationItem {
  type: StationItemType
  text: string
  actor?: string
  date?: string
  ref?: string
  due?: string
}

export const lisbonDecision = {
  id: 'D-042',
  title: '¿Debe Alpha Espai abrir una presencia satélite en Lisboa en 2026?',
  opened: '12 May 2026',
  status: 'deliberating' as const,
  weight: 'Mayor',
  owner: 'Marta Ferrer',
  deadline: 'Q2 2026',
  daysActive: 11,
  deliberationEntries: 8,
  lastActivity: '21 May 2026',
  relatedMemory: 'M-014',
  precedent: 'D-037, D-039',

  businessImpact: {
    hypothesis: 'Abrir Lisboa aumentará las solicitudes cualificadas de founders internacionales y permitirá crear una nueva línea de ingresos vinculada al programa de residencia, estimada en €120k–180k anuales en año 3.',
    plLever: 'Crecimiento de ingresos · expansión del ecosistema',
    leadingIndicators: ['Solicitudes cualificadas de founders internacionales', 'Conversaciones activas con partners locales', 'Tasa de conversión founders Lisboa'],
    laggingIndicators: ['Ingresos del programa de residencia Lisboa', 'Margen del programa en año 2', 'Retención de cohortes internacionales'],
    responsible: 'Marta Ferrer',
    reviewHorizon: 'Q4 2027',
    operationalEffect: 'Nueva línea de ingresos estimada en €120k–180k anuales en año 3. Incremento del alcance geográfico del ecosistema en un 40%.',
    riskOfInaction: 'Pérdida de la ventana de mercado en Lisboa. Consolidación de organizaciones competidoras en el espacio cultural disponible. Deterioro de las relaciones con practitioners en 12–18 meses.',
    evidenceStatus: 'Acumulando',
    retrospectiveResult: null as string | null,
  },

  frame: `Alpha Espai opera desde un único emplazamiento en Barcelona desde su fundación en 2018. La decisión que se somete a deliberación es si abrir una segunda base operativa en Lisboa en 2026 — no una presencia programática ni una afiliación en red, sino un satélite funcional con espacio propio y capacidad de residencia.

Es una decisión estructural. Cambiará la naturaleza de la organización de formas que no pueden preverse en su totalidad. La cuestión es si ese cambio es el correcto, y si el momento es el adecuado.

Ver M-014 (Dic 2025) para el razonamiento organizativo que precedió a la apertura formal de esta decisión.`,

  context: [
    {
      heading: 'Por qué Lisboa, por qué ahora',
      body: 'Tres factores han convergido: relaciones de trabajo consolidadas con practitioners de Lisboa durante 18 meses (Mariana Esteves, Nuno Querido y un tercero aún sin nombrar); un mercado de alquiler todavía accesible para operadores culturales no comerciales — una ventana que la Señal S-001 confirma que se está cerrando (8 de 14 propiedades objetivo ya arrendadas); y la percepción interna de que el modelo de sede única ha llegado al límite de lo que puede producir.',
    },
    {
      heading: 'Qué significa satélite en este contexto',
      body: 'La propuesta no es una sucursal. Es una segunda inteligencia — un lugar donde las preguntas de Alpha Espai se formulan desde una posición diferente. El satélite operaría con autonomía significativa, conectado a Barcelona a través de la gobernanza compartida (D-037, Sección 4.2) pero distinto en su pregunta fundadora.',
    },
    {
      heading: 'Riesgos que deben nombrarse',
      body: 'Bifurcación organizativa. Déficit de capital: €90k disponibles frente a un mínimo de €180k requeridos. Complejidad en la coordinación de la residencia. Riesgo de coherencia si la pregunta fundadora no se resuelve antes del compromiso. Estos riesgos no son motivos para rechazar — son condiciones que deben abordarse dentro de la decisión, no después.',
    },
  ],

  options: [
    {
      id: 'O-1',
      label: 'Proceder en 2026',
      description: 'Establecer el satélite en H2 2026. Requiere: partner de financiación identificado, pregunta fundadora resuelta y liderazgo de Lisboa designado antes del compromiso.',
      consequence: 'Activa la gobernanza del satélite bajo D-037 § 4.2. Compromiso de capital mínimo de €180k. La pregunta fundadora se convierte en elemento estructural.',
    },
    {
      id: 'O-2',
      label: 'Aplazar a 2027',
      description: 'Continuar construyendo relaciones en Lisboa sin compromiso espacial. Retomar la cuestión en Q4 2026 con más información y una posición financiera más sólida.',
      consequence: 'La ventana de alquiler en Lisboa se cierra. Las relaciones con Esteves y Querido se mantienen informalmente. Nueva decisión se abre en Q4 2026 desde una posición más débil.',
    },
    {
      id: 'O-3',
      label: 'Solo modelo de partnerships',
      description: 'Formalizar relaciones con instituciones lisboetas existentes. Sin espacio propio; sin gobernanza de satélite. Menor riesgo, menor ambición.',
      consequence: 'D-042 se cierra como Modificada. Sin compromiso espacial. Barcelona sigue siendo el único nodo operativo. La ambición de Lisboa se absorbe en la lógica de partnerships.',
    },
    {
      id: 'O-4',
      label: 'Replantear la pregunta',
      description: 'La dicotomía Barcelona/Lisboa puede ser el marco equivocado. Considerar si se trata de una decisión sobre convertirse en una organización multi-sede, con Lisboa como caso de prueba.',
      consequence: 'D-042 se cierra. Se abre nueva decisión D-048: "¿Qué tipo de organización debe ser Alpha Espai?" El modelo multi-sede se delibera formalmente.',
    },
  ],

  resolutionConditions: [
    { id: 'RC-1', label: 'Pregunta fundadora presentada', owner: 'Pau Soler', due: '28 May 2026', satisfied: false },
    { id: 'RC-2', label: 'Partner de financiación en fase de carta de intención', owner: 'Marta Ferrer', due: '30 May 2026', satisfied: false },
    { id: 'RC-3', label: 'D-046 contrato Poblenou formalmente gestionado', owner: 'Elena Vidal', due: '24 May 2026', satisfied: false },
  ],

  stakeholders: [
    {
      name: 'Marta Ferrer',
      role: 'Directora',
      position: 'A favor — con cautela',
      weight: 'Principal',
      note: 'El momento es correcto; el riesgo es manejable si el equipo fundador es el adecuado. Conduce la deliberación. Conversaciones con partner de financiación en curso.',
      responded: true,
      lastContribution: '19 May 2026',
    },
    {
      name: 'Pau Soler',
      role: 'Responsable de Programa',
      position: 'Condicional',
      weight: 'Principal',
      note: 'Favorable si el satélite tiene autonomía real y una pregunta fundadora propia. Comprometido a presentar el enunciado de la pregunta fundadora antes del 28 May.',
      responded: true,
      lastContribution: '21 May 2026',
    },
    {
      name: 'Elena Vidal',
      role: 'Directora Financiera',
      position: 'Con reservas',
      weight: 'Principal',
      note: 'Capital en el límite superior del compromiso sin apoyo externo. Disenso registrado formalmente. Contacto con partner financiero en progreso — el panorama mejora.',
      responded: true,
      lastContribution: '20 May 2026',
    },
    {
      name: 'Javier Ruiz',
      role: 'Coordinador de Residencia',
      position: 'Neutral',
      weight: 'Contribuyente',
      note: 'La residencia en dos sedes requiere que la pregunta fundadora esté resuelta antes de poder diseñar la función de residencia para el satélite. Problema de secuenciación señalado.',
      responded: true,
      lastContribution: '17 May 2026',
    },
    {
      name: 'Ana Costa',
      role: 'Patronato — Lisboa',
      position: 'Firmemente a favor',
      weight: 'Asesora',
      note: 'Amplio conocimiento de la infraestructura cultural de Lisboa. Participación asíncrona 19 May 21:14. Confirma interés de Esteves y Querido. "Esta decisión no debe esperar."',
      responded: true,
      lastContribution: '19 May 2026',
    },
  ],

  deliberation: [
    {
      participant: 'Marta Ferrer',
      role: 'Directora',
      text: 'El argumento para Lisboa no es principalmente estratégico — es relacional. Hemos construido algo real con tres practitioners allí durante 18 meses. La cuestión es si estamos preparados para honrar eso construyendo un lugar que pueda sostenerlo.',
      timestamp: '12 May 2026 · 14:32',
    },
    {
      participant: 'Elena Vidal',
      role: 'Directora Financiera',
      text: 'Quiero ser precisa con los números. Establecer un satélite con espacio propio requiere un compromiso mínimo de tres años de aproximadamente €180.000 en capital, más costes operativos. Disponemos de €90.000 en reserva. La brecha no es insalvable, pero nos obliga a nombrar una estrategia de financiación antes de proceder, no después.',
      timestamp: '14 May 2026 · 10:15',
    },
    {
      participant: 'Pau Soler',
      role: 'Responsable de Programa',
      text: 'La cuestión financiera es real pero secundaria. La pregunta más profunda es si Lisboa va a ser Alpha Espai en otra dirección, o algo genuinamente distinto. Si no podemos responder eso con claridad, construiremos algo confuso. La pregunta fundadora debe preceder a la fundación.',
      timestamp: '16 May 2026 · 16:48',
    },
    {
      participant: 'Javier Ruiz',
      role: 'Coordinador de Residencia',
      text: 'Desde la perspectiva de la residencia: actualmente asignamos residentes al espacio de Barcelona con razonable precisión. Un emplazamiento en Lisboa crea un conjunto diferente de expectativas — los residentes que soliciten Lisboa estarían solicitando algo que aún no hemos definido. No puedo diseñar la función de residencia para el satélite hasta que la pregunta fundadora esté resuelta. Es un problema de secuenciación.',
      timestamp: '17 May 2026 · 14:09',
    },
    {
      participant: 'Marta Ferrer',
      role: 'Directora',
      text: 'El planteamiento de Pau es el correcto. El satélite debe tener su propia pregunta fundadora — algo que trate de comprender y que Barcelona no puede preguntar desde su posición. Tenemos un candidato para esa pregunta, pero debe hacerse explícito antes de proceder. Pau, ¿puedes redactarla?',
      timestamp: '19 May 2026 · 09:30',
    },
    {
      participant: 'Ana Costa',
      role: 'Patronato — Lisboa',
      text: 'Escribo desde Lisboa. El interés aquí es real. He hablado con Mariana Esteves y Nuno Querido esta semana — ambos se comprometerían seriamente con lo que Alpha Espai propone. La pregunta específica en la que trabaja Nuno — la relación entre infraestructura y práctica — es exactamente el tipo de pregunta que no puede formularse desde Barcelona. No creo que esta decisión deba esperar.',
      timestamp: '19 May 2026 · 21:14',
    },
    {
      participant: 'Elena Vidal',
      role: 'Directora Financiera',
      text: 'Avances en la cuestión de la financiación. He hablado con dos posibles partners esta semana. Uno ha mostrado interés en un acuerdo de apoyo programático de 3 años — sin compromiso formal, pero receptivo. El segundo es menos probable, aunque merece seguimiento. Ya no estoy segura de que la brecha sea tan pronunciada como la describí el día 14. La precondición se mantiene; el panorama mejora.',
      timestamp: '20 May 2026 · 14:33',
    },
    {
      participant: 'Pau Soler',
      role: 'Responsable de Programa',
      text: 'Leyendo la nota de Ana, creo que la pregunta fundadora es casi articulable: la relación entre infraestructura y práctica en una ciudad simultáneamente sujeta a y agente de una transformación cultural específica. Esa es la pregunta de Lisboa, no la de Barcelona. Si procedemos, eso es lo que el satélite debe construirse para responder. Tendré un borrador escrito antes del 28 May.',
      timestamp: '21 May 2026 · 09:55',
    },
  ],

  dissent: {
    participant: 'Elena Vidal',
    role: 'Directora Financiera',
    text: 'Quiero registrar una preocupación formal sin oponerme a la decisión por completo. El modelo financiero tal como está propuesto conlleva un riesgo organizativo significativo. Si el satélite no obtiene financiación externa en sus primeros 18 meses, la presión sobre las operaciones de Barcelona será considerable. Creo que debemos proceder solo con un partner financiero comprometido ya identificado — no como condición que cumplamos después de la decisión, sino como precondición para tomarla.',
    timestamp: '21 May 2026 · 11:20',
  },

  predictions: [
    { label: 'Satélite en Lisboa establecido, operativo en Q4 2026', probability: 0.54 },
    { label: 'Decisión aplazada — consenso insuficiente en el plazo de Q2', probability: 0.28 },
    { label: 'Modelo de partnerships adoptado como vía alternativa', probability: 0.12 },
    { label: 'Pregunta reformulada, nueva decisión abierta', probability: 0.06 },
  ],

  verdictOptions: ['Proceder en 2026', 'Aplazar a 2027', 'Solo partnerships', 'Replantear'],
}

export const memoryThread = {
  id: 'M-017',
  title: 'Por qué dejamos de organizar convocatorias abiertas.',
  settled: '14 de marzo de 2026',
  author: 'Marta Ferrer',
  role: 'Directora',
  relatedDecision: 'D-039',
  views: 14,
  citedIn: ['D-042'],
  relatedThreads: ['M-016', 'M-014'],
  hypothesisStatus: 'parcialmente confirmada' as const,
  retrospective: 'La reducción de convocatorias abiertas mejoró el encaje de founders con la organización, pero redujo el volumen inicial del funnel de solicitantes. La hipótesis original quedó parcialmente confirmada: el modelo de afiliaciones produce mayor densidad relacional, aunque a un ritmo más lento de lo previsto.',
  body: [
    `Alpha Espai organizó convocatorias abiertas por cohortes durante cuatro años. Entre 2021 y 2024, seleccionamos y acogimos seis cohortes de practitioners emergentes, cada una de doce semanas de duración. Lo hicimos porque era lo que creíamos que las organizaciones creativas debían hacer: abrir la puerta, ampliar el campo, resistir la tentación de la insularidad.`,

    `Nos equivocamos. No en cuanto al valor de la apertura — seguimos comprometidos con ella — sino en cuanto al instrumento.`,

    `La convocatoria abierta por cohortes es un formato diseñado para la abundancia. Presupone una organización capaz de recibir una amplia y heterogénea gama de practitioners, de respaldar su trabajo sin conocerlo de antemano, y de convertir esos encuentros en algo duradero. No éramos esa organización. No teníamos la infraestructura ni, honestamente, la disposición para ello.`,

    `Lo que descubrimos, lentamente y con cierta incomodidad, fue que el modelo por cohortes producía un tipo particular de relación: superficial, temporal y estructuralmente incapaz de convertirse en algo más. Los practitioners llegaban, pasaban tres meses en una proximidad productiva y se marchaban. La conexión se disolvía no por ningún fracaso de voluntad, sino por la temporalidad inherente al formato. Nada se acumulaba. Ninguna relación se profundizaba lo suficiente como para tener consecuencia institucional.`,

    `Más significativamente, el formato de convocatoria abierta nos estaba arrastrando hacia una lógica de representación — de necesitar mostrar amplitud, diversidad, cobertura — que era contraria a nuestra inteligencia real. Alpha Espai piensa bien en términos específicos. Desarrollamos ideas en profundidad, en relación prolongada con un número reducido de personas. La cohorte nos pedía pensar de forma amplia, rápida y superficial. Cumplimos, y nos volvimos menos coherentes en el proceso.`,

    `La decisión de detenernos no llegó rápidamente. Requirió dieciocho meses de rendimientos decrecientes, tres retiros internos y un desacuerdo honesto considerable antes de que pudiéramos nombrar con suficiente claridad lo que estaba ocurriendo para actuar en consecuencia. El disenso queda registrado en este hilo: Pau Soler creía que estábamos sacrificando acceso por calidad, y que la incomodidad que sentíamos era la incomodidad de la apertura genuina más que la incompatibilidad estructural. Puede que tenga razón en parte de eso. La decisión se mantiene.`,

    `Lo que hemos adoptado en su lugar es algo que todavía estamos aprendiendo a nombrar. Un modelo más lento: afiliaciones a largo plazo, menos numerosas, seleccionadas mediante conversación más que mediante solicitud. Algo más cercano al patrocinio que al programa. Si esto funcionará — si producirá la densidad que buscamos — está por ver.`,

    `Este hilo es un registro del razonamiento, no una prueba de corrección. Lo hemos cerrado porque no podíamos permanecer indefinidamente indecisos. La organización necesita avanzar.`,
  ],
  dissent: {
    participant: 'Pau Soler',
    role: 'Responsable de Programa',
    text: 'Quiero que este disenso quede registrado con claridad. El modelo de cohortes tenía fallos genuinos, pero creo que estamos atribuyendo al formato lo que corresponde a nuestra propia ejecución. Organizamos seis cohortes; mejoramos significativamente entre la tercera y la sexta. Detenernos en el momento en que empezábamos a entender cómo hacerlo bien me parece prematuro. Acepto la decisión. No estoy de acuerdo con su momento.',
    timestamp: '10 Mar 2026',
  },
  tags: ['programa', 'convocatoria-abierta', 'cambio-de-modelo', 'D-039', 'afiliación'],
}

export const councilSession = {
  title: 'Revisión Estratégica Q2 — Expansión a Lisboa',
  sessionRef: 'S-027',
  date: '23 May 2026',
  startTime: '09:30',
  nextCouncil: '30 May 2026',
  convener: 'Marta Ferrer',
  previousSession: { ref: 'S-026', date: '16 May 2026', focus: 'Primera revisión D-042 · D-046 marcada urgente' },
  participants: [
    { name: 'Marta Ferrer', role: 'Directora', present: true },
    { name: 'Pau Soler', role: 'Responsable de Programa', present: true },
    { name: 'Elena Vidal', role: 'Directora Financiera', present: true },
    { name: 'Javier Ruiz', role: 'Coordinador de Residencia', present: true },
    { name: 'Ana Costa', role: 'Patronato — Lisboa', present: false },
  ],
  stations: [
    {
      id: 'ripening',
      label: 'En Maduración',
      description: 'Decisiones y señales que se acercan al umbral. Lo que no puede esperar.',
      content: [
        { type: 'signal', ref: 'D-042 · Lisboa', text: 'Ventana de alquiler se cierra en Jul 2026. Decisión requerida antes del 23 Jun para preservar tres propiedades disponibles. Señal S-001 (01 May): 8 de 14 propiedades adecuadas ya arrendadas a competidores. Cada semana de retraso reduce las opciones.' },
        { type: 'signal', ref: 'D-046 · Poblenou', text: '48 días vencida. La extensión informal del propietario caduca el 31 May. Sin prórroga formal por escrito. E. Vidal informó al consejo el 11 May; sin acción formal tomada. El contrato caduca si no se gestiona antes de fin de mes. Escalada urgente.' },
        { type: 'signal', ref: 'D-044 · Fundació Miró', text: 'El consejo convoca el 10 Jun. Nueva directora receptiva a organizaciones independientes (A. Costa, 15 May). La posición debe comunicarse antes del 06 Jun. Quedan tres días hábiles tras este consejo.' },
        { type: 'signal', ref: 'D-043 · Residencia 18M', text: 'Si se decide antes del 31 May, el lanzamiento piloto en Q4 2026 es viable junto a la cohorte actual. Marco provisional de J. Ruiz listo. La ventana se cierra a final de mes.' },
      ] as StationItem[],
    },
    {
      id: 'deliberation',
      label: 'Deliberación',
      description: 'Razonamiento activo sobre D-042. Lo que se ha dicho; lo que aún no se ha dicho.',
      content: [
        { type: 'note', text: 'Ocho intercambios registrados en 11 días (12–21 May). Los cinco participantes han enviado sus posiciones — incluida A. Costa de forma asíncrona desde Lisboa, 19 May 21:14.' },
        { type: 'attributed', actor: 'E. Vidal', date: '14 May', text: 'Identificó €90k disponibles frente a €180k mínimos (compromiso de 3 años). Seguimiento el 20 May: dos posibles partners financieros contactados; uno receptivo a un acuerdo de apoyo programático de 3 años. La brecha sigue abierta pero el panorama mejora.' },
        { type: 'attributed', actor: 'P. Soler', date: '16 May', text: 'El satélite debe tener su propia pregunta fundadora — algo que trate de comprender y que Barcelona no puede preguntar desde su posición. M. Ferrer lo aceptó como precondición. P. Soler se comprometió a presentar un borrador antes del 28 May. Aún no entregado a fecha de hoy.' },
        { type: 'attributed', actor: 'A. Costa', date: '19 May', text: 'Ha hablado directamente con Mariana Esteves y Nuno Querido esta semana. Ambos dispuestos a comprometerse seriamente. La pregunta de Nuno Querido — la relación entre infraestructura y práctica — identificada por P. Soler como candidata a pregunta fundadora.' },
        { type: 'note', text: 'Disenso formalmente registrado: E. Vidal, 21 May. La precondición de financiación debe preceder a la decisión, no seguirla. Registrado en el hilo.' },
      ] as StationItem[],
    },
    {
      id: 'impact-review',
      label: 'Revisión de Impacto',
      description: 'Qué se esperaba, qué indicador se está moviendo, si la apuesta sigue teniendo sentido.',
      content: [
        { type: 'note', text: 'Hipótesis de impacto (D-042): Abrir Lisboa generará una nueva línea de ingresos de €120k–180k anuales en año 3. Palanca de cuenta de explotación: crecimiento de ingresos · expansión del ecosistema.' },
        { type: 'attributed', actor: 'Indicadores tempranos', date: '', text: 'Solicitudes cualificadas de founders internacionales: sin datos aún (decisión no tomada). Conversaciones activas con partners locales en Lisboa: 2 identificados (Esteves, Querido). Tasa de conversión: pendiente de pregunta fundadora.' },
        { type: 'attributed', actor: 'Indicadores finales', date: '', text: 'Ingresos programa de residencia Lisboa, margen del programa en año 2, retención de cohortes internacionales. Ninguno medible hasta Q4 2027 como mínimo.' },
        { type: 'attributed', actor: 'E. Vidal', date: '20 May', text: 'Estado de evidencia: acumulando. Riesgo de no actuar cuantificado: pérdida de ventana de mercado, consolidación de competidores, deterioro de relaciones con practitioners en 12–18 meses.' },
        { type: 'note', text: '¿Sigue teniendo sentido la apuesta? Posición del consejo: sí, condicionada a la identificación del partner financiero y la pregunta fundadora antes del 30 May.' },
      ] as StationItem[],
    },
    {
      id: 'framing',
      label: 'Encuadre',
      description: 'La cuestión tal como se sostiene actualmente. ¿Es la pregunta correcta?',
      content: [
        { type: 'note', text: 'Encuadre actual: ¿Debe Alpha Espai abrir una presencia satélite en Lisboa en 2026?' },
        { type: 'attributed', actor: 'P. Soler', date: '16 May', text: 'Desafío al encuadre: ¿Es esta una pregunta sobre el modelo organizativo — si Alpha Espai debe convertirse en una organización multi-sede — con Lisboa como caso de prueba más que como sujeto?' },
        { type: 'attributed', actor: 'M. Ferrer', date: '19 May', text: 'La cuestión de Lisboa es el encuadre correcto por ahora. La cuestión del modelo es real, pero requiere un tiempo de deliberación adicional del que no disponemos. El plazo disciplina el encuadre.' },
        { type: 'note', text: 'Tensión no resuelta: si proceder sin la pregunta fundadora completamente resuelta constituye una decisión responsable o un compromiso prematuro. Esta tensión no es razón para aplazar — es el trabajo que queda antes del 30 May.' },
      ] as StationItem[],
    },
    {
      id: 'rereading',
      label: 'Relectura',
      description: 'Lo que dice el archivo. Precedentes y razonamiento anterior.',
      content: [
        { type: 'signal', ref: 'M-017 · Mar 2026', text: '"Alpha Espai piensa bien en términos específicos." El modelo de cohortes fracasó porque requería lo contrario. Riesgo: el satélite de Lisboa fracasa por la misma razón si se convierte en un movimiento generalizador en lugar de profundizador.' },
        { type: 'signal', ref: 'M-014 · Dic 2025', text: '"Lisboa no se trata de acceso a un nuevo mercado. Se trata de acceso a una pregunta diferente." Escrito cinco meses antes de que D-042 se abriera formalmente. El problema de la pregunta fundadora estaba anticipado.' },
        { type: 'signal', ref: 'D-037 · Ene 2026', text: 'La gobernanza v3 fue diseñada explícitamente para contemplar la operación multi-sede. La sección 4.2 aborda la gobernanza del satélite. Esta decisión se tomó pensando en Lisboa.' },
        { type: 'signal', ref: 'D-039 · Mar 2026', text: 'Precedente de la disposición de este consejo a aceptar incomodidad organizativa al servicio de la coherencia. La cuestión del satélite requiere la misma calidad de decisión.' },
      ] as StationItem[],
    },
    {
      id: 'closing',
      label: 'Cierre y Acuerdos',
      description: 'Lo que se sostuvo; lo que sigue abierto; lo que debe hacerse.',
      content: [
        { type: 'resolved', text: 'Plazo confirmado: resolución de D-042 requerida antes del 30 Jun 2026. Esta fecha es vinculante. La ventana de alquiler y el impulso organizativo así lo exigen.' },
        { type: 'resolved', text: 'La precondición de financiación de E. Vidal queda incorporada como condición de la opción "Proceder". Avanzar sin un partner financiero identificado no es una vía válida.' },
        { type: 'action', actor: 'P. Soler', due: '28 May 2026', text: 'Redactar una página con la pregunta fundadora del satélite de Lisboa. Este documento es una precondición para la resolución.' },
        { type: 'action', actor: 'M. Ferrer', due: '30 May 2026', text: 'Continuar las conversaciones con el partner financiero esta semana. Informar del estado en el próximo consejo. Objetivo: un partner en fase de carta de intención.' },
        { type: 'action', actor: 'E. Vidal', due: '24 May 2026', text: 'Enviar respuesta formal al propietario de Poblenou. D-046 requiere atención urgente con independencia de D-042.' },
        { type: 'schedule', text: '30 May 2026 · Resolución de D-042 prevista. Documento de pregunta fundadora de P. Soler requerido antes de la sesión.' },
      ] as StationItem[],
    },
  ],
}

export const weatherData = {
  unlocked: true,
  thresholdMet: 5,
  thresholdRequired: 5,
  generatedAt: '23 May 2026',
  basedOn: '42 entradas de deliberación · 5 decisiones activas · 11 semanas desde el último cierre mayor',
  pressureSystems: [
    {
      label: 'Alta presión — Orientación a la expansión',
      description: 'El 67% del peso deliberativo está orientado al crecimiento (D-042, D-043, D-044). Genera un campo direccional coherente, pero comporta riesgo de sobrecompromiso relativo a la capacidad operativa. D-046 vencida sugiere que ya existe un déficit de atención.',
      intensity: 'Alta',
      tracedTo: ['D-042', 'D-043', 'D-044'],
    },
    {
      label: 'Baja presión — Confianza operativa',
      description: 'El programa de residencia está consolidado. La gobernanza v3 funciona correctamente. Las relaciones internas son sanas: los desacuerdos en D-042 se han registrado formalmente en lugar de suprimirse. Este es el suelo estable desde el que se sostienen las preguntas de expansión.',
      intensity: 'Baja',
      tracedTo: ['D-037', 'D-031', 'S-027'],
    },
  ],
  prevailingWinds: {
    direction: 'Hacia el exterior',
    description: 'La organización avanza hacia un mayor alcance geográfico y relacional. Esto es coherente con el arco declarado del Capítulo III — la arquitectura de la permanencia requiere más de un cimiento. Tres de las cinco decisiones activas afectan a compromisos externos.',
  },
  stormFronts: [
    {
      label: 'Riesgo de bifurcación financiera',
      description: 'Si D-042 avanza sin una solución de financiación, el satélite genera una presión estructural sobre Barcelona en un plazo de 24 meses. E. Vidal ha cuantificado esto: déficit de €90k en 3 años. Las conversaciones con posibles partners están activas pero sin resolver.',
      severity: 'significant',
      tracedTo: ['D-042', 'S-005'],
    },
    {
      label: 'Fragmentación de atención — D-046',
      description: 'El contrato de Poblenou (D-046) lleva 48 días vencido sin acción formal. Esto indica fragmentación de la atención — el consejo está centrado en cuestiones estratégicas mayores mientras un riesgo operativo se acumula. Si el contrato caduca, se convierte en una crisis.',
      severity: 'significant',
      tracedTo: ['D-046'],
    },
    {
      label: 'Riesgo de coherencia — tensión de autonomía',
      description: 'El problema no resuelto de la pregunta fundadora podría bifurcar la organización intelectualmente antes de hacerlo espacialmente. Dos sedes con respuestas diferentes a "qué es Alpha Espai" es más peligroso que una sola sede con incertidumbre. Este riesgo tiene una acción específica asociada.',
      severity: 'moderate',
      tracedTo: ['D-042', 'M-014'],
    },
  ],
  calm: [
    {
      label: 'Programa de residencia',
      description: 'La residencia es el elemento más estable de la organización. Propósito claro, trayectoria demostrada, fuerte fidelidad de los participantes. 47 solicitudes para el ciclo 2026, con una estimación de 12 competitivas. Este es el suelo de la organización.',
    },
    {
      label: 'Relaciones internas',
      description: 'La deliberación sobre D-042 ha sido honesta y rigurosa a lo largo de 8 intercambios. Los desacuerdos se han registrado formalmente. Ana Costa contribuyendo desde Lisboa. Javier Ruiz señalando la secuenciación operativa. Esto es salud organizativa.',
    },
  ],
  innovationPatterns: [
    {
      label: 'Tres apuestas de crecimiento, un solo set de indicadores definidos',
      description: 'Tres iniciativas están vinculadas al crecimiento de ingresos (D-042, D-043, D-044), pero solo D-042 tiene indicadores tempranos formalmente definidos. Las otras dos carecen de métricas de seguimiento acordadas.',
      tracedTo: ['D-042', 'D-043', 'D-044'],
    },
    {
      label: 'Las apuestas de eficiencia maduran más rápido que las de expansión',
      description: 'Las decisiones operativas (D-037, D-039, D-031) se cerraron en plazos de 6 a 18 meses. Las apuestas de expansión del ecosistema (D-042, D-044) llevan más tiempo en deliberación y con mayor incertidumbre. Patrón consistente con el perfil de riesgo de la organización.',
      tracedTo: ['D-037', 'D-039', 'D-042', 'D-044'],
    },
    {
      label: 'D-046 revela el coste de la atención estratégica',
      description: 'La decisión operativa más urgente lleva 48 días vencida. El foco en las grandes apuestas estratégicas ha desplazado la gestión de riesgos operativos. Este patrón, si se repite, puede generar cuellos de botella críticos.',
      tracedTo: ['D-046'],
    },
  ],
  backtestReading: {
    period: 'Primavera 2024',
    description: 'Si esta lectura se hubiera tomado en primavera de 2024, habría descrito una organización bajo presión de coherencia significativa por el programa de convocatorias abiertas — una práctica que contradecía su inteligencia central. Ese frente se resolvió a través de D-039 (cerrada en marzo de 2026, tras 18 meses de rendimientos decrecientes). Los frentes actuales son reales pero más manejables: tienen responsables, tienen plazos, y la organización ha demostrado que puede tomar decisiones difíciles.',
  },
}

export const horizonData = {
  bets: [
    {
      id: 'A-001',
      title: 'Lisboa será el próximo centro generativo de Alpha Espai',
      owner: 'Pau Soler',
      conviction: 'Alta',
      horizon: '2028',
      originates: 'D-042',
      businessThesis: 'Si el satélite se establece con autonomía genuina y la pregunta fundadora correcta, Lisboa se convertirá en el nodo más generativo en un plazo de 3 años, generando una nueva línea de ingresos de residencia y ampliando el ecosistema internacional.',
      economicLever: 'Nueva línea de ingresos · expansión del ecosistema internacional',
      reviewConditions: 'Revisar si el satélite obtiene financiación externa en los primeros 18 meses. Si no, replantear el modelo operativo.',
      currentEvidence: 'Interés confirmado de Esteves y Querido. Ventana de mercado en cierre. Hipótesis financiera sin validar.',
      nextReview: 'Q4 2026',
      leadingIndicators: ['Solicitudes de founders internacionales', 'Conversaciones activas con partners Lisboa', 'Tasa de conversión founders Lisboa'],
      laggingIndicators: ['Ingresos residencia Lisboa año 2', 'Margen del programa', 'Retención de cohortes internacionales'],
      rationale: 'Si el satélite se establece con autonomía genuina y la pregunta fundadora correcta, Lisboa se convertirá en el nodo más generativo en 3 años. Barcelona como ancla institucional; Lisboa como frontera experimental. La red de Ana Costa y la pregunta de Nuno Querido apuntan en esta dirección.',
    },
    {
      id: 'A-002',
      title: 'El modelo de convocatoria abierta está permanentemente obsoleto para organizaciones de esta escala',
      owner: 'Marta Ferrer',
      conviction: 'Media',
      horizon: '2027',
      originates: 'D-039',
      businessThesis: 'La lógica que terminó con nuestro programa de cohortes afectará a organizaciones similares. El modelo de afiliaciones a largo plazo producirá mayor retención y menor coste de adquisición por relación sostenida.',
      economicLever: 'Eficiencia operativa · reducción del coste por relación',
      reviewConditions: 'Si el 60%+ de organizaciones comparables ha abandonado el formato antes de 2027, la apuesta queda confirmada.',
      currentEvidence: 'D-039 cerrada con resultado positivo. Modelo de afiliaciones en fase inicial. Primeros indicios de mejor encaje.',
      nextReview: 'Q2 2027',
      leadingIndicators: ['Adopción del formato de afiliación por pares del sector', 'Calidad de solicitudes de residencia', 'Tiempo medio de relación por practitioner'],
      laggingIndicators: ['Coste por relación sostenida', 'Tasa de retención a 24 meses', 'Impacto de practitioners en cuenta de explotación'],
      rationale: 'La lógica que terminó con nuestro programa de cohortes (D-039, M-017) afectará a organizaciones similares. Se estima que el 60%+ de organizaciones comparables habrá abandonado el formato antes de 2027. Alpha Espai está por delante de esta tendencia.',
    },
    {
      id: 'A-003',
      title: 'Alpha Espai consolidará un partnership institucional público en los próximos 18 meses',
      owner: 'Elena Vidal',
      conviction: 'Media',
      horizon: 'Q4 2027',
      originates: 'D-044',
      businessThesis: 'La pregunta Miró (D-044) se resolverá positivamente o quedará superada por una oportunidad diferente. El modelo de la organización es ahora legible para las instituciones públicas, abriendo una vía de diversificación de ingresos.',
      economicLever: 'Diversificación de ingresos · reducción de dependencia de fuentes privadas',
      reviewConditions: 'Si D-044 no se resuelve positivamente antes de Q3 2026, iniciar acercamiento a MACBA y CCCB.',
      currentEvidence: 'Nueva directora de la Fundació Miró receptiva. D-044 en deliberación activa.',
      nextReview: 'Q3 2026',
      leadingIndicators: ['Avance de D-044', 'Calidad del contacto con la institución', 'Receptividad de la nueva dirección'],
      laggingIndicators: ['Ingresos de partnership institucional', 'Duración media del acuerdo', 'Legitimidad institucional generada'],
      rationale: 'La cuestión de la Fundació Miró (D-044) se resolverá positivamente o quedará superada por otra oportunidad. El modelo de la organización es ahora legible para las instituciones públicas de una manera que no lo era durante el período de cohortes. La nueva directora del Miró es una señal.',
    },
  ],
  predictions: [
    { id: 'P-019', label: 'Ventana de alquiler Lisboa se cierra sin resolución de D-042', probability: 0.22, owner: 'Elena Vidal' },
    { id: 'P-020', label: 'Partnership con Fundació Miró rechazado o con condiciones insatisfactorias', probability: 0.55, owner: 'Pau Soler' },
    { id: 'P-021', label: 'Piloto de residencia de 18 meses lanzado en 2026', probability: 0.72, owner: 'Javier Ruiz' },
    { id: 'P-022', label: 'Satélite en Lisboa operativo en Q4 2026', probability: 0.54, owner: 'Marta Ferrer' },
    { id: 'P-023', label: 'D-046 contrato caducado, renegociación de emergencia', probability: 0.31, owner: 'Elena Vidal' },
  ],
  triggers: [
    {
      id: 'T-001',
      condition: 'Si el piloto de Lisboa obtiene financiación externa en los primeros 18 meses',
      consequence: 'Ampliar el satélite a plena capacidad programática — abrir D-048',
      watchedBy: 'Elena Vidal',
    },
    {
      id: 'T-002',
      condition: 'Si la Fundació Miró rechaza o propone condiciones insatisfactorias',
      consequence: 'Acercarse a MACBA y Centre de Cultura Contemporània de Barcelona — abrir D-049',
      watchedBy: 'Marta Ferrer',
    },
    {
      id: 'T-003',
      condition: 'Si las solicitudes de residencia caen más del 20% en el ciclo 2026 vs. 2025',
      consequence: 'Revisión formal del modelo de residencia — comunicar al consejo de inmediato, suspender D-043',
      watchedBy: 'Javier Ruiz',
    },
    {
      id: 'T-004',
      condition: 'Si P. Soler no presenta la pregunta fundadora antes del 28 May',
      consequence: 'Resolución de D-042 aplazada — condiciones insuficientes para una decisión responsable',
      watchedBy: 'Marta Ferrer',
    },
  ],
  watchedSignals: [
    {
      id: 'S-001',
      label: 'Índice de alquiler comercial en Lisboa',
      source: 'Informe trimestral Confidencial Imobiliário',
      lastRead: '01 May 2026',
      reading: 'Crecimiento del 8% interanual. 8 de 14 propiedades objetivo arrendadas. Ventana en cierre: se estima que quedan 3 opciones viables.',
      owner: 'Elena Vidal',
    },
    {
      id: 'S-002',
      label: 'Composición del patronato de la Fundació Joan Miró',
      source: 'Relación directa — Ana Costa',
      lastRead: '15 May 2026',
      reading: 'Nueva directora (incorporada Abr 2026) receptiva a organizaciones independientes. La dirección anterior fue obstructiva. Momento favorable.',
      owner: 'Marta Ferrer',
    },
    {
      id: 'S-003',
      label: 'Actividad de organizaciones pares en Lisboa',
      source: 'Observación de red — informal',
      lastRead: '10 May 2026',
      reading: '2 organizaciones barcelonesas buscan activamente espacio en Lisboa. Una ha identificado una propiedad. La presión competitiva aumenta.',
      owner: 'Pau Soler',
    },
    {
      id: 'S-004',
      label: 'Calidad de solicitudes de residencia — ciclo 2026',
      source: 'Interno — revisión de solicitudes en curso',
      lastRead: '05 May 2026',
      reading: 'Campo sólido: 47 solicitudes recibidas, con una estimación de 12 competitivas. Comparable al año pico de 2024. Sin señales de caída de la demanda.',
      owner: 'Javier Ruiz',
    },
    {
      id: 'S-005',
      label: 'Alquiler comercial en Barcelona — distrito Poblenou',
      source: 'Comunicación con propietario + índice Idealista',
      lastRead: '11 May 2026',
      reading: 'Contrato actual €2.100/mes. Renovación propuesta: €2.650/mes (+26%). Precio de mercado para espacio equivalente: €2.400–2.800. El propietario conoce la posición limitada de la organización.',
      owner: 'Elena Vidal',
    },
  ],
}
