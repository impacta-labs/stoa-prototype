export const organization = {
  name: 'Alpha Espai',
  chapter: 'Chapter III — The Architecture of Permanence',
  period: 'Spring 2026',
  founded: 2018,
  location: 'Barcelona',
  participants: 7,
}

export const weeklyStanding = {
  deliberationLoad: 'Heavy',
  activeDecisions: 3,
  settledThisQuarter: 2,
  memoryEntries: 42,
  activeParticipants: 7,
  lastConvened: '19 May 2026',
  nextCouncil: '30 May 2026',
}

export const inDeliberation = [
  {
    id: 'D-042',
    title: 'Should Alpha Espai open a Lisbon satellite presence in 2026?',
    opened: '12 May 2026',
    weight: 'Major',
    status: 'deliberating' as const,
    owner: 'Marta Ferrer',
    deadline: 'Q2 2026',
  },
  {
    id: 'D-043',
    title: 'Extend residency programme to 18-month tenure?',
    opened: '03 May 2026',
    weight: 'Significant',
    status: 'open' as const,
    owner: 'Pau Soler',
    deadline: 'Q3 2026',
  },
  {
    id: 'D-044',
    title: 'Accept institutional partnership with Fundació Joan Miró?',
    opened: '28 Apr 2026',
    weight: 'Significant',
    status: 'deliberating' as const,
    owner: 'Elena Vidal',
    deadline: 'Q2 2026',
  },
]

export const ripeningPredictions = [
  {
    id: 'P-019',
    signal: 'Lisbon rental market window closes — Jul 2026',
    trigger: 'D-042 decision required before Jun 30',
    urgency: 'high' as const,
  },
  {
    id: 'P-020',
    signal: 'Fundació Miró board convenes — 10 Jun 2026',
    trigger: 'D-044 position must be communicated before board date',
    urgency: 'medium' as const,
  },
]

export const recentlySettled = [
  {
    id: 'D-039',
    title: 'Discontinue open-call cohort programme',
    settled: '14 Mar 2026',
    verdict: 'Sustained — Programme discontinued, model replaced with long-term affiliations',
    thread: 'M-017',
  },
  {
    id: 'D-037',
    title: 'Adopt revised governance framework (v3)',
    settled: '08 Jan 2026',
    verdict: 'Sustained — New framework operational from Q1 2026',
    thread: 'M-015',
  },
  {
    id: 'D-035',
    title: 'Reduce exhibition programme to four annual productions',
    settled: '19 Nov 2025',
    verdict: 'Modified — Three productions confirmed, fourth held in reserve',
    thread: 'M-013',
  },
]

export const memoryBand = [
  { id: 'M-017', title: 'Why we stopped running open-call cohorts', date: '14 Mar 2026' },
  { id: 'M-016', title: 'On the architecture of long-term commitment', date: '22 Feb 2026' },
  { id: 'M-015', title: 'Governance v3: the reasoning behind the changes', date: '08 Jan 2026' },
  { id: 'M-014', title: 'What Lisbon represents for this organization', date: '15 Dec 2025' },
  { id: 'M-013', title: 'The economics of exhibition: a frank account', date: '19 Nov 2025' },
]

export const lisbonDecision = {
  id: 'D-042',
  title: 'Should Alpha Espai open a Lisbon satellite presence in 2026?',
  opened: '12 May 2026',
  status: 'deliberating' as const,
  weight: 'Major',
  owner: 'Marta Ferrer',
  deadline: 'Q2 2026',

  frame: `Alpha Espai has operated from a single site in Barcelona since its founding in 2018. The question before the organization is whether to establish a second operational base in Lisbon in 2026 — not a programme presence or a network affiliation, but a working satellite with dedicated space and resident capacity.

This is a structural decision. It will change the nature of the organization in ways that cannot be fully predicted in advance. The question is whether the change is the right one, and whether the timing is correct.`,

  context: [
    {
      heading: 'Why Lisbon, why now',
      body: 'Three factors have converged: a small number of practitioners in Lisbon with whom Alpha Espai has developed significant working relationships over 18 months; a rental market still accessible to non-commercial cultural operators (a window that will likely close by late 2026); and the organization\'s own sense that its current single-site model is reaching the limit of what it can produce.',
    },
    {
      heading: 'What satellite means in this context',
      body: 'The proposal is not a branch office. It is a second intelligence — a place where Alpha Espai\'s questions are asked from a different position. The Lisbon satellite would operate with significant autonomy, connected to Barcelona through shared governance and a common programme logic but distinct in its local orientation.',
    },
    {
      heading: 'The risks that must be named',
      body: 'Organizational bifurcation is a real risk. Resources — financial, attentional, relational — would be divided. The Barcelona operation could be weakened. The satellite could fail to develop its own coherence and become a drain rather than an amplification. These risks are not reasons not to proceed, but they must be weighed honestly.',
    },
  ],

  options: [
    {
      id: 'O-1',
      label: 'Proceed in 2026',
      description: 'Establish the Lisbon satellite in the second half of 2026 with committed resources and a two-year founding mandate.',
    },
    {
      id: 'O-2',
      label: 'Defer to 2027',
      description: 'Continue building Lisbon relationships without spatial commitment. Return to the question in Q4 2026 with more information.',
    },
    {
      id: 'O-3',
      label: 'Partnership model only',
      description: 'Formalize relationships with existing Lisbon institutions rather than establishing independent space.',
    },
    {
      id: 'O-4',
      label: 'Reframe the question',
      description: 'The binary of Barcelona vs. Lisbon may be wrong. Consider whether the question is really about organizational model rather than location.',
    },
  ],

  stakeholders: [
    {
      name: 'Marta Ferrer',
      role: 'Director',
      position: 'In favour — cautiously',
      weight: 'Primary',
      note: 'Believes the timing is correct and the risk is manageable if the founding team in Lisbon is right. Has reservations about pace.',
    },
    {
      name: 'Pau Soler',
      role: 'Programme Lead',
      position: 'Conditional',
      weight: 'Primary',
      note: 'Supportive if the satellite has genuine autonomy. Opposed if it becomes a programming outpost of Barcelona rather than a distinct intelligence.',
    },
    {
      name: 'Elena Vidal',
      role: 'Finance Director',
      position: 'Concerned',
      weight: 'Primary',
      note: 'Capital requirements are at the upper limit of what the organization can commit without external support. Wants a clear funding model before proceeding.',
    },
    {
      name: 'Javier Ruiz',
      role: 'Residency Coordinator',
      position: 'Neutral',
      weight: 'Contributing',
      note: 'Focused on operational implications for the residency programme. Would need significant support to run a two-site residency operation.',
    },
    {
      name: 'Ana Costa',
      role: 'Board — Lisbon',
      position: 'Strongly in favour',
      weight: 'Advisory',
      note: 'Board member with deep knowledge of Lisbon cultural infrastructure. Willing to provide introductions and advisory support in establishing period.',
    },
  ],

  deliberation: [
    {
      participant: 'Marta Ferrer',
      role: 'Director',
      text: 'The case for Lisbon is not primarily strategic — it is relational. We have built something real with three practitioners there over 18 months. The question is whether we are prepared to honour that by building a place that can hold it.',
      timestamp: '12 May 2026 · 14:32',
    },
    {
      participant: 'Elena Vidal',
      role: 'Finance',
      text: 'I want to be precise about the numbers. Establishing a satellite with dedicated space requires a minimum three-year commitment of approximately €180,000 in capital, plus operating costs. We have €90,000 in reserve. The gap is not insurmountable but it requires us to name a funding strategy before we proceed.',
      timestamp: '14 May 2026 · 10:15',
    },
    {
      participant: 'Pau Soler',
      role: 'Programme',
      text: 'The financial question is real but secondary. The deeper question is whether Lisbon will be Alpha Espai at a different address, or something genuinely distinct. If we cannot answer that clearly, we will build something confused.',
      timestamp: '16 May 2026 · 16:48',
    },
    {
      participant: 'Marta Ferrer',
      role: 'Director',
      text: 'Pau\'s point is the right one. The satellite must have its own founding question — something it is trying to understand that Barcelona cannot ask from its position. We have a candidate for that question but it needs to be made explicit.',
      timestamp: '19 May 2026 · 09:30',
    },
  ],

  dissent: {
    participant: 'Elena Vidal',
    role: 'Finance Director',
    text: 'I want to register a formal concern without opposing the decision entirely. The financial model as currently proposed carries meaningful organizational risk. If the satellite does not achieve external funding in its first 18 months, the pressure on Barcelona\'s operations will be significant. I believe we should proceed only with a committed funding partner already identified — not as a condition we meet after the decision, but as a precondition for making it.',
    timestamp: '21 May 2026 · 11:20',
  },

  predictions: [
    { label: 'Lisbon satellite established, operational by Q4 2026', probability: 0.54 },
    { label: 'Decision deferred — insufficient consensus', probability: 0.28 },
    { label: 'Partnership model adopted as alternative', probability: 0.12 },
    { label: 'Question reframed, new decision opened', probability: 0.06 },
  ],

  verdictOptions: ['Proceed in 2026', 'Defer to 2027', 'Partnership model', 'Reframe'],
}

export const memoryThread = {
  id: 'M-017',
  title: 'Why we stopped running open-call cohorts.',
  settled: '14 March 2026',
  author: 'Marta Ferrer',
  role: 'Director',
  relatedDecision: 'D-039',
  body: [
    `Alpha Espai ran open-call cohorts for four years. Between 2021 and 2024, we selected and hosted six cohorts of emerging practitioners, each lasting twelve weeks. We did this because it was what we believed creative organizations were supposed to do: open the door, widen the field, resist the temptation of insularity.`,

    `We were wrong. Not about the value of openness — we remain committed to that — but about the instrument.`,

    `The open-call cohort is a format designed for abundance. It assumes an organization capable of receiving a broad and unpredictable range of practitioners, of resourcing their work without understanding it in advance, and of translating those encounters into something lasting. We were not that organization. We had neither the infrastructure nor, honestly, the disposition.`,

    `What we discovered, slowly and with some discomfort, was that the cohort model was producing a particular kind of relationship: shallow, temporary, and structurally unable to become more. Practitioners arrived, spent three months in productive proximity, and left. The connection dissolved not from any failure of will but from the format's inherent temporality. Nothing accumulated. No relationship deepened to the point where it could carry institutional consequence.`,

    `More significantly, the open-call format was drawing us into a logic of representation — of needing to show range, diversity, coverage — that was at odds with our actual intelligence. Alpha Espai thinks well in specific terms. We develop ideas deeply, in long relationship with a small number of people. The cohort asked us to think broadly, quickly, and superficially. We complied, and we became less coherent in the process.`,

    `The decision to stop was not reached quickly. It took eighteen months of diminishing returns, three internal retreats, and considerable honest disagreement before we could name what was happening clearly enough to act on it. The dissent is recorded in this thread: Pau Soler believed we were sacrificing access for quality, and that the discomfort we felt was the discomfort of genuine openness rather than structural incompatibility. He may be right about some of that. The decision stands.`,

    `What we have moved toward instead is something we are still learning to name. A slower model: longer-term affiliations, fewer in number, selected through conversation rather than application. Something closer to patronage than programme. Whether this will work — whether it will produce the kind of density we are looking for — remains to be seen.`,

    `This thread is a record of the reasoning, not a proof of correctness. We have settled it because we could not remain undecided indefinitely. The organization needs to move.`,
  ],
  dissent: {
    participant: 'Pau Soler',
    role: 'Programme Lead',
    text: 'I want this dissent recorded clearly. The cohort model had genuine failures, but I believe we are attributing to the format what belongs to our own execution. We ran six cohorts; we improved significantly between the third and the sixth. Stopping at the point when we were beginning to understand how to do it well seems premature. I accept the decision. I do not agree with its timing.',
    timestamp: '10 Mar 2026',
  },
  tags: ['programme', 'open-call', 'model-shift', 'D-039'],
}

export const councilSession = {
  title: 'Q2 Strategic Review — Lisbon Expansion',
  sessionRef: 'S-027',
  date: '23 May 2026',
  startTime: '09:30',
  nextCouncil: '30 May 2026',
  convener: 'Marta Ferrer',
  participants: [
    { name: 'Marta Ferrer', role: 'Director', present: true },
    { name: 'Pau Soler', role: 'Programme Lead', present: true },
    { name: 'Elena Vidal', role: 'Finance Director', present: true },
    { name: 'Javier Ruiz', role: 'Residency Coordinator', present: true },
    { name: 'Ana Costa', role: 'Board — Lisbon', present: false },
  ],
  stations: [
    {
      id: 'ripening',
      label: 'Ripening',
      description: 'Decisions and signals approaching threshold. What cannot wait.',
      content: [
        'D-042 (Lisbon) — Deadline pressure: Rental window closes July 2026. Decision required before 30 Jun.',
        'D-044 (Fundació Miró) — Partner board convenes 10 Jun. Position must be communicated.',
        'P-019 — Lisbon rental market: 4 suitable properties available now; estimated 2 available in 90 days.',
      ],
    },
    {
      id: 'deliberation',
      label: 'Deliberation',
      description: 'Active reasoning on D-042. What has been said; what has not yet been said.',
      content: [
        'Four exchanges recorded across 10 days. Financial gap identified: €90k available, €180k minimum required.',
        "Pau Soler's question about autonomy not yet resolved: what is the founding question of the Lisbon satellite?",
        "Elena Vidal's dissent formally registered. Funding precondition proposed.",
        'Ana Costa not present today — her position (strongly in favour) is recorded in the thread.',
      ],
    },
    {
      id: 'framing',
      label: 'Framing',
      description: 'The question as currently held. Is it the right question?',
      content: [
        'Current frame: Should Alpha Espai open a Lisbon satellite in 2026?',
        'Alternative frame surfaced by Pau Soler: Is the question really about organizational model — whether Alpha Espai should become a multi-node organization — rather than about a specific city?',
        "Marta Ferrer's view: The Lisbon question is the right frame for now. The model question is real but would require 6 more months of deliberation. We do not have that time.",
      ],
    },
    {
      id: 'rereading',
      label: 'Re-reading',
      description: 'What the archive says. Relevant precedent.',
      content: [
        'M-017 (Why we stopped open-call cohorts): Alpha Espai thinks in specific, deep terms. The cohort model failed because it required the opposite. The Lisbon satellite could fail for the same reason if it becomes a generalizing rather than a deepening move.',
        'M-014 (What Lisbon represents): Written Dec 2025. "Lisbon is not about access to a new market. It is about access to a different question." This was written before D-042 was formally opened.',
        'D-037 (Governance v3): The new framework was designed to accommodate multi-node operation. This decision was made with Lisbon in mind.',
      ],
    },
    {
      id: 'closing',
      label: 'Closing Summary',
      description: 'What was held; what remains open; what is to be done.',
      content: [
        'The council confirmed the deadline pressure. D-042 requires a verdict before 30 June 2026.',
        'Elena Vidal\'s funding precondition was accepted as a condition of the "Proceed" option, not a reason to defer.',
        'Pau Soler agreed to draft a one-page statement of the founding question for the Lisbon satellite by 28 May.',
        'Marta Ferrer will approach two potential funding partners this week.',
        'Next council: 30 May 2026. Verdict expected.',
      ],
    },
  ],
}

export const weatherData = {
  unlocked: true,
  thresholdMet: 5,
  thresholdRequired: 5,
  generatedAt: '23 May 2026',
  pressureSystems: [
    {
      label: 'High pressure — Expansion orientation',
      description: '67% of deliberation weight is oriented toward growth (Lisbon, 18-month residency, Fundació partnership). This creates a coherent directional field but risks overcommitment.',
      intensity: 'High',
    },
    {
      label: 'Low pressure — Operational confidence',
      description: 'The residency programme is settled. Governance v3 is running smoothly. This creates a stable base from which the expansion questions can be held without panic.',
      intensity: 'Low',
    },
  ],
  prevailingWinds: {
    direction: 'Outward',
    description: 'The organization is moving toward greater geographic and relational reach. This is consistent with Chapter III\'s stated arc — the architecture of permanence requires more than one foundation.',
  },
  stormFronts: [
    {
      label: 'Financial bifurcation risk',
      description: 'If D-042 proceeds without a funding solution, the satellite could create a structural drain on the Barcelona operation within 24 months. This is the most significant storm front in the current reading.',
      severity: 'significant',
    },
    {
      label: 'Coherence risk — autonomy tension',
      description: 'Pau Soler\'s unresolved question about satellite autonomy could bifurcate the organization intellectually even before it does so spatially. Two sites with different answers to "what is Alpha Espai" is more dangerous than one site with uncertainty.',
      severity: 'moderate',
    },
  ],
  calm: [
    {
      label: 'Residency programme',
      description: 'The residency is the organization\'s most stable element. It has clear purpose, demonstrated track record, and strong participant loyalty. This is the organization\'s ground.',
    },
    {
      label: 'Internal relationships',
      description: 'The deliberation on D-042 has been honest and rigorous. Disagreements have been recorded formally rather than suppressed. This is organizational health.',
    },
  ],
  backtestReading: {
    period: 'Spring 2024',
    description: 'Had this reading been taken in Spring 2024, it would have described an organization under significant coherence pressure from the open-call programme — a practice that contradicted its core intelligence. That storm front resolved through D-039 (settled March 2026). Current storm fronts are real but more tractable than that one was.',
  },
}

export const horizonData = {
  bets: [
    {
      id: 'B-001',
      title: 'Lisbon will carry Alpha Espai\'s next decade',
      owner: 'Pau Soler',
      conviction: 'High',
      horizon: '2028',
      rationale: 'If the satellite is established with genuine autonomy and the right founding question, Lisbon will become the more generative of the two nodes within 3 years. Barcelona will become the institutional anchor; Lisbon the experimental edge.',
    },
    {
      id: 'B-002',
      title: 'The open-call model is permanently obsolete for organizations of this scale',
      owner: 'Marta Ferrer',
      conviction: 'Medium',
      horizon: '2027',
      rationale: 'The logic that killed our cohort programme will affect peers operating at similar scale. Expect 60%+ of comparable organizations to have abandoned the format by 2027, whether or not they articulate the reasoning clearly.',
    },
    {
      id: 'B-003',
      title: 'Alpha Espai will hold a public institutional partnership within 18 months',
      owner: 'Elena Vidal',
      conviction: 'Medium',
      horizon: 'Q4 2027',
      rationale: 'The Fundació Miró question (D-044) will resolve positively or will be superseded by a different opportunity. The organization\'s model is now legible to public institutions in a way it was not during the cohort period.',
    },
  ],
  predictions: [
    { id: 'P-019', label: 'Lisbon rental window closes without decision — Jul 2026', probability: 0.22, owner: 'Elena Vidal' },
    { id: 'P-020', label: 'Fundació Miró partnership declined', probability: 0.55, owner: 'Pau Soler' },
    { id: 'P-021', label: '18-month residency piloted in 2026', probability: 0.72, owner: 'Javier Ruiz' },
    { id: 'P-022', label: 'Lisbon satellite operational Q4 2026', probability: 0.54, owner: 'Marta Ferrer' },
  ],
  triggers: [
    {
      id: 'T-001',
      condition: 'If Lisbon pilot achieves external funding in first 18 months',
      consequence: 'Expand satellite to full programme capacity — open D-048',
      watchedBy: 'Elena Vidal',
    },
    {
      id: 'T-002',
      condition: 'If Fundació Miró declines or proposes unsatisfactory terms',
      consequence: 'Re-approach MACBA and Centre de Cultura Contemporània — open D-049',
      watchedBy: 'Marta Ferrer',
    },
    {
      id: 'T-003',
      condition: 'If residency applications drop >20% in 2026 cycle',
      consequence: 'Formal review of residency model — flag to council immediately',
      watchedBy: 'Javier Ruiz',
    },
  ],
  watchedSignals: [
    {
      id: 'S-001',
      label: 'Lisbon commercial rental index',
      source: 'Confidencial Imobiliário quarterly report',
      lastRead: '01 May 2026',
      reading: 'Rising 8% YoY — window narrowing',
      owner: 'Elena Vidal',
    },
    {
      id: 'S-002',
      label: 'Fundació Joan Miró board composition',
      source: 'Direct relationship — Ana Costa',
      lastRead: '15 May 2026',
      reading: 'New director sympathetic to independent organizations',
      owner: 'Marta Ferrer',
    },
    {
      id: 'S-003',
      label: 'Peer organization Lisbon activity',
      source: 'Network observation',
      lastRead: '10 May 2026',
      reading: '2 Barcelona peers actively seeking Lisbon space — competitive pressure building',
      owner: 'Pau Soler',
    },
    {
      id: 'S-004',
      label: 'Residency application quality — 2026 cycle',
      source: 'Internal — application review',
      lastRead: '05 May 2026',
      reading: 'Strong field — 47 applications, estimated 12 competitive',
      owner: 'Javier Ruiz',
    },
  ],
}
