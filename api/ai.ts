import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { action, params } = req.body

  if (!action || !params) {
    res.status(400).json({ error: 'Missing action or params' })
    return
  }

  try {
    if (action === 'generateDecision') {
      const { titulo, tipo, orgName = 'la organización' } = params

      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1600,
        messages: [
          {
            role: 'user',
            content: `Eres un asesor estratégico senior y CFO interno de ${orgName}.\n\nLa organización está evaluando esta iniciativa:\nTítulo: "${titulo}"\nTipo: ${tipo}\n\nGenera en español:\n1. preguntaEstrategica: pregunta estratégica precisa (1 frase, termina en "?") que enmarca esto como una decisión, no una tarea.\n2. hipotesis: hipótesis de impacto (2-3 frases) con cambio medible y estimación económica concreta en euros.\n3. plLever: palanca de cuenta de explotación CON cuantificación en euros. Formato: descripción + cifra en €M. Obligatorio incluir cifra.\n4. indicadoresLideres: array de 3 indicadores tempranos concretos y medibles\n5. riesgoNoActuar: coste de oportunidad (2-3 frases, con cifra en €)\n6. casoInversion: caso de negocio con campos NUMÉRICOS en euros:\n   - costeProblemActual: € por año (coste de NO actuar)\n   - inversionRequerida: € total (capex + opex primer año)\n   - retornoEsperado: € por año (ahorro o ingreso incremental)\n   - confianza: "Bajo", "Medio", o "Alto"\n7. kpis: array de 2-3 indicadores CON PUENTE FINANCIERO. Para cada uno:\n   - nombre: nombre del KPI (corto, concreto)\n   - unidad: unidad de medida (ej: "semanas", "días", "%", "proyectos", "puntos NPS")\n   - baselineValor: valor actual (número)\n   - baselineEuroUnidad: cuántos € vale mejorar 1 unidad de este KPI (número entero, puede ser 0)\n   - objetivoValor: valor objetivo (número)\n   - deltaEuros: impacto financiero total estimado en € de alcanzar el objetivo (número entero positivo)\n   - fechaMedicion: cuándo se medirá (ej: "Q4 2026")\n   - responsable: quién mide (puede ser "")\n   Importante: el deltaEuros debe ser coherente con casoInversion.retornoEsperado. Los 2-3 KPIs deben explicar de dónde viene el retorno.\n\nResponde SOLO con JSON válido sin markdown:\n{"preguntaEstrategica":"...","hipotesis":"...","plLever":"...","indicadoresLideres":["...","...","..."],"riesgoNoActuar":"...","casoInversion":{"costeProblemActual":0,"inversionRequerida":0,"retornoEsperado":0,"confianza":"Medio"},"kpis":[{"nombre":"...","unidad":"...","baselineValor":0,"baselineEuroUnidad":0,"objetivoValor":0,"deltaEuros":0,"fechaMedicion":"...","responsable":""}]}`,
          },
        ],
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      const data = extractJSON(text)
      return res.json({ success: true, data })
    }

    if (action === 'generateCouncilSummary') {
      const { decisions, sessionRef, date, orgName = 'la organización' } = params

      const activas = decisions.filter(
        (d: any) => d.status === 'evaluacion' || d.status === 'deliberando'
      )
      const resueltas = decisions.filter((d: any) => d.status === 'resuelta')

      const activasSummary =
        activas
          .map(
            (d: any) =>
              `- ${d.id}: "${d.titulo}" | Responsable: ${d.owner || 'Sin asignar'} | Plazo: ${d.deadline || 'Sin definir'} | Hipótesis: ${d.businessImpact?.hypothesis?.slice(0, 120) || 'Sin hipótesis'}`
          )
          .join('\n') || 'Ninguna iniciativa activa'

      const resueltasSummary =
        resueltas
          .map(
            (d: any) =>
              `- ${d.id}: "${d.titulo}" → Resolución: "${d.selectedVerdict}" | Predicción: "${d.prediccion || 'Sin predicción'}" | Revisión: ${d.businessImpact?.reviewHorizon}`
          )
          .join('\n') || 'Ninguna decisión resuelta en esta sesión'

      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 900,
        messages: [
          {
            role: 'user',
            content: `Eres el secretario del Consejo de Innovación de ${orgName}. Redacta el resumen ejecutivo de la sesión ${sessionRef} celebrada el ${date}.\n\nIniciativas en seguimiento:\n${activasSummary}\n\nDecisiones resueltas en esta sesión:\n${resueltasSummary}\n\nEscribe un resumen ejecutivo formal en español (250-350 palabras) que:\n- Abra con el estado del portafolio en este consejo\n- Cubra cada iniciativa activa con su estado y responsable\n- Destaque las decisiones resueltas con su veredicto y predicción\n- Liste las 3 próximas acciones más importantes con responsables\n- Cierre con las fechas de revisión pendientes\n\nTono: actas formales de consejo. Prosa para la narrativa, bullets solo para acciones y revisiones.`,
          },
        ],
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      return res.json({ success: true, data: text })
    }

    if (action === 'portfolioDiagnosis') {
      const { decisions, orgName = 'la organización', sector = '' } = params

      const activas = decisions.filter(
        (d: any) => d.status === 'evaluacion' || d.status === 'deliberando'
      )
      const resueltas = decisions.filter((d: any) => d.status === 'resuelta')
      const conHipotesis = decisions.filter((d: any) => d.businessImpact?.hypothesis?.trim()).length
      const conPrediccion = resueltas.filter((d: any) => d.prediccion?.trim()).length
      const tiposCount: Record<string, number> = {}
      decisions.forEach((d: any) => {
        tiposCount[d.tipoInnovacion] = (tiposCount[d.tipoInnovacion] || 0) + 1
      })
      const tiposResumen = Object.entries(tiposCount)
        .map(([tipo, n]) => `${tipo}: ${n}`)
        .join(', ')

      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [
          {
            role: 'user',
            content: `Eres un asesor estratégico experto en innovación corporativa analizando el portfolio de decisiones de ${orgName}${sector ? ` (${sector})` : ''}.

Portfolio actual:
- Total decisiones: ${decisions.length}
- Activas: ${activas.length} (en evaluación o deliberación)
- Resueltas: ${resueltas.length}
- Con hipótesis medible: ${conHipotesis}/${decisions.length}
- Con predicción comprometida: ${conPrediccion}/${resueltas.length}
- Tipos de innovación: ${tiposResumen || 'Sin datos'}
- Decisiones activas: ${activas.map((d: any) => `"${d.titulo}" (${d.weight}, ${d.owner || 'sin responsable'})`).join('; ') || 'Ninguna'}

Escribe un diagnóstico estratégico del portfolio en español (150-200 palabras) que:
1. Evalúe el balance del portfolio (¿hay concentración excesiva en algún tipo?)
2. Identifique el riesgo más urgente (decisión que necesita atención inmediata)
3. Señale la oportunidad más relevante
4. Proponga la siguiente acción concreta para el equipo

Tono: asesor estratégico senior. Directo. Sin rodeos. Sin introducción genérica.`,
          },
        ],
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      return res.json({ success: true, data: text })
    }

    return res.status(400).json({ error: 'Unknown action' })
  } catch (error: any) {
    console.error('AI proxy error:', error?.message)
    return res.status(500).json({ error: 'AI generation failed', detail: error?.message })
  }
}

function extractJSON(text: string): any {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Could not extract JSON from response')
  }
}
