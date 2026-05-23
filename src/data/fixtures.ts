// Alpha Espai — operational record as of 23 May 2026

export const organization = {
  name: 'Alpha Espai',
  chapter: 'Chapter III — The Architecture of Permanence',
  period: 'Spring 2026',
  founded: 2018,
  location: 'Barcelona, Poblenou',
  participants: 7,
}

export const systemStatus = {
  lastSync: '23 May 2026 · 09:42',
  sessionRef: 'S-027',
  sessionActive: true,
  pendingActions: 3,
  overdueDecisions: 1,
}

export const weeklyStanding = {
  deliberationLoad: 'Heavy',
  deliberationLoadTrend: '↑ Rising',
  activeDecisions: 5,
  activeDecisionsChange: '+2 vs. last quarter',
  settledThisQuarter: 2,
  settledThisQuarterChange: '— unchanged',
  memoryEntries: 42,
  memoryEntriesChange: '+3 this month',
  activeParticipants: 7,
  lastConvened: '19 May 2026',
  nextCouncil: '30 May 2026',
}

export const inDeliberation = [
  {
    id: 'D-042',
    title: 'Should Alpha Espai open a Lisbon satellite presence in 2026?',
    opened: '12 May 2026',
    daysActive: 11,
    deliberationEntries: 8,
    lastActivity: '1 day ago',
    weight: 'Major',
    status: 'deliberating' as const,
    owner: 'Marta Ferrer',
    deadline: 'Q2 2026',
    overdue: false,
    ref: 'D-042',
  },
  {
    id: 'D-046',
    title: 'Renew Poblenou studio lease — revised terms',
    opened: '05 Apr 2026',
    daysActive: 48,
    deliberationEntries: 2,
    lastActivity: '12 days ago',
    weight: 'Critical',
    status: 'overdue' as const,
    owner: 'Elena Vidal',
    deadline: 'Apr 2026',
    overdue: true,
    ref: 'D-046',
  },
  {
    id: 'D-044',
    title: 'Accept institutional partnership with Fundació Joan Miró?',
    opened: '28 Apr 2026',
    daysActive: 25,
    deliberationEntries: 3,
    lastActivity: '3 days ago',
    weight: 'Significant',
    status: 'deliberating' as const,
    owner: 'Elena Vidal',
    deadline: 'Q2 2026',
    overdue: false,
    ref: 'D-044',
  },
  {
    id: 'D-043',
    title: 'Extend residency programme to 18-month tenure?',
    opened: '03 May 2026',
    daysActive: 20,
    deliberationEntries: 1,
    lastActivity: '5 days ago',
    weight: 'Significant',
    status: 'open' as const,
    owner: 'Pau Soler',
    deadline: 'Q3 2026',
    overdue: false,
    ref: 'D-043',
  },
  {
    id: 'D-045',
    title: 'Commission independent evaluation of 2025–2026 residency outcomes',
    opened: '21 May 2026',
    daysActive: 2,
    deliberationEntries: 0,
    lastActivity: 'Opened today',
    weight: 'Minor',
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
    signal: 'Lisbon rental market window closes — Jul 2026',
    trigger: 'D-042 verdict required before 23 Jun to preserve three remaining properties',
    urgency: 'high' as const,
  },
  {
    id: 'P-020',
    signal: 'Fundació Miró board convenes — 10 Jun 2026',
    trigger: 'D-044 position must reach the Foundation no later than 06 Jun',
    urgency: 'high' as const,
  },
  {
    id: 'P-024',
    signal: 'Poblenou landlord informal extension expires — 31 May 2026',
    trigger: 'D-046 formal response required before end of month or lease lapses',
    urgency: 'high' as const,
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
    verdict: 'Sustained — New framework operational from Q1 2026. Section 4.2 accommodates multi-node.',
    thread: 'M-015',
  },
  {
    id: 'D-035',
    title: 'Reduce exhibition programme to four annual productions',
    settled: '19 Nov 2025',
    verdict: 'Modified — Three productions confirmed; fourth held in reserve pending resource review',
    thread: 'M-013',
  },
  {
    id: 'D-033',
    title: 'Discontinue participation in annual cultural fair circuit',
    settled: '14 Aug 2025',
    verdict: 'Sustained — Withdrawn from 2025–2026 circuit; resources reallocated to residency programme',
    thread: 'M-011',
  },
  {
    id: 'D-031',
    title: 'Adopt compensation framework for resident practitioners',
    settled: '03 Jun 2025',
    verdict: 'Sustained with amendment — Base stipend raised to €800/month from Q3 2025',
    thread: 'M-010',
  },
]

export const memoryBand = [
  { id: 'M-017', title: 'Why we stopped running open-call cohorts', date: '14 Mar 2026' },
  { id: 'M-016', title: 'On the architecture of long-term commitment', date: '22 Feb 2026' },
  { id: 'M-015', title: 'Governance v3: the reasoning behind the changes', date: '08 Jan 2026' },
  { id: 'M-014', title: 'What Lisbon represents for this organization', date: '15 Dec 2025' },
  { id: 'M-013', title: 'The economics of exhibition: a frank account', date: '19 Nov 2025' },
  { id: 'M-011', title: 'Why we left the fair circuit', date: '14 Aug 2025' },
  { id: 'M-010', title: 'Compensation and commitment: the practitioner relationship', date: '03 Jun 2025' },
]

export const lisbonDecision = {
  id: 'D-042',
  title: 'Should Alpha Espai open a Lisbon satellite presence in 2026?',
  opened: '12 May 2026',
  status: 'deliberating' as const,
  weight: 'Major',
  owner: 'Marta Ferrer',
  deadline: 'Q2 2026',
  daysActive: 11,
  deliberationEntries: 8,
  lastActivity: '21 May 2026',
  relatedMemory: 'M-014',
  precedent: 'D-037, D-039',

  frame: `Alpha Espai has operated from a single site in Barcelona since its founding in 2018. The question before the organization is whether to establish a second operational base in Lisbon in 2026 — not a programme presence or a network affiliation, but a working satellite with dedicated space and resident capacity.

This is a structural decision. It will change the nature of the organization in ways that cannot be fully predicted in advance. The question is whether the change is the right one, and whether the timing is correct.

See M-014 (Dec 2025) for the organizational reasoning that preceded this decision being formally opened.`,

  context: [
    {
      heading: 'Why Lisbon, why now',
      body: "Three factors have converged: working relationships with Lisbon practitioners built over 18 months (Mariana Esteves, Nuno Querido, and one other not yet named); a rental market still accessible to non-commercial cultural operators — a window Signal S-001 confirms is closing (8 of 14 target properties now leased); and the organization's sense that its single-site model is reaching the limit of what it can produce.",
    },
    {
      heading: 'What satellite means in this context',
      body: "The proposal is not a branch office. It is a second intelligence — a place where Alpha Espai's questions are asked from a different position. The satellite would operate with significant autonomy, connected to Barcelona through shared governance (per D-037's framework, Section 4.2) but distinct in its founding question.",
    },
    {
      heading: 'The risks that must be named',
      body: 'Organizational bifurcation. Capital shortfall: €90k available vs. €180k minimum required. Residency coordination complexity (J. Ruiz, 17 May). Coherence risk if founding question is not settled before commitment. These risks are not reasons to decline — they are conditions that must be addressed within the decision, not after it.',
    },
  ],

  options: [
    {
      id: 'O-1',
      label: 'Proceed in 2026',
      description: 'Establish the satellite in H2 2026. Requires: identified funding partner, settled founding question, and named Lisbon leadership before commitment.',
    },
    {
      id: 'O-2',
      label: 'Defer to 2027',
      description: 'Continue building Lisbon relationships without spatial commitment. Return to the question in Q4 2026 with more information and a stronger financial position.',
    },
    {
      id: 'O-3',
      label: 'Partnership model only',
      description: 'Formalize relationships with existing Lisbon institutions. No dedicated space; no satellite governance. Lower risk, lower ambition.',
    },
    {
      id: 'O-4',
      label: 'Reframe the question',
      description: 'The binary Barcelona/Lisbon framing may be wrong. Consider whether this is a question about becoming a multi-node organization, with Lisbon as the test case.',
    },
  ],

  stakeholders: [
    {
      name: 'Marta Ferrer',
      role: 'Director',
      position: 'In favour — cautiously',
      weight: 'Primary',
      note: 'Timing is correct; risk is manageable if the founding team is right. Has reservations about pace. Driving the deliberation.',
      responded: true,
      lastContribution: '19 May 2026',
    },
    {
      name: 'Pau Soler',
      role: 'Programme Lead',
      position: 'Conditional',
      weight: 'Primary',
      note: 'Supportive if satellite has genuine autonomy and a distinct founding question. Committed to drafting the founding question statement by 28 May.',
      responded: true,
      lastContribution: '21 May 2026',
    },
    {
      name: 'Elena Vidal',
      role: 'Finance Director',
      position: 'Concerned',
      weight: 'Primary',
      note: 'Capital at upper limit of commitment without external support. Dissent formally registered. Funding partner contact in progress — picture improving.',
      responded: true,
      lastContribution: '20 May 2026',
    },
    {
      name: 'Javier Ruiz',
      role: 'Residency Coordinator',
      position: 'Neutral',
      weight: 'Contributing',
      note: 'Focused on operational implications. Two-site residency requires founding question settled before residency function can be designed for the satellite.',
      responded: true,
      lastContribution: '17 May 2026',
    },
    {
      name: 'Ana Costa',
      role: 'Board — Lisbon',
      position: 'Strongly in favour',
      weight: 'Advisory',
      note: 'Deep knowledge of Lisbon cultural infrastructure. Submitted async 19 May. Confirms appetite from Esteves and Querido. "This decision should not wait."',
      responded: true,
      lastContribution: '19 May 2026',
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
      role: 'Finance Director',
      text: 'I want to be precise about the numbers. Establishing a satellite with dedicated space requires a minimum three-year commitment of approximately €180,000 in capital, plus operating costs. We have €90,000 in reserve. The gap is not insurmountable but it requires us to name a funding strategy before we proceed, not after.',
      timestamp: '14 May 2026 · 10:15',
    },
    {
      participant: 'Pau Soler',
      role: 'Programme Lead',
      text: 'The financial question is real but secondary. The deeper question is whether Lisbon will be Alpha Espai at a different address, or something genuinely distinct. If we cannot answer that clearly, we will build something confused. The founding question must precede the founding.',
      timestamp: '16 May 2026 · 16:48',
    },
    {
      participant: 'Javier Ruiz',
      role: 'Residency Coordinator',
      text: 'From the residency side: we currently match residents to the Barcelona space with reasonable precision. A Lisbon site creates a different set of expectations — residents who apply for Lisbon would be applying for something we have not yet defined. I cannot design a residency function for the satellite until the founding question is settled. This is a sequencing issue.',
      timestamp: '17 May 2026 · 14:09',
    },
    {
      participant: 'Marta Ferrer',
      role: 'Director',
      text: "Pau's point is the right one. The satellite must have its own founding question — something it is trying to understand that Barcelona cannot ask from its position. We have a candidate for that question but it needs to be made explicit before we proceed. Pau, can you draft this?",
      timestamp: '19 May 2026 · 09:30',
    },
    {
      participant: 'Ana Costa',
      role: 'Board — Lisbon',
      text: "Writing from Lisbon. The appetite here is real. I spoke with Mariana Esteves and Nuno Querido this week — both would engage seriously with what Alpha Espai proposes. The specific question Nuno is working on — the relationship between infrastructure and practice — is exactly the kind of question that cannot be asked from Barcelona. I don't think this decision should wait.",
      timestamp: '19 May 2026 · 21:14',
    },
    {
      participant: 'Elena Vidal',
      role: 'Finance Director',
      text: 'Progress on the funding question. Spoke with two potential partners this week. One has indicated interest in a 3-year programme support arrangement — not committed, but responsive. The second is less likely but worth continuing. I am no longer certain the gap is as sharp as I characterized it on the 14th. The precondition stands; the picture is improving.',
      timestamp: '20 May 2026 · 14:33',
    },
    {
      participant: 'Pau Soler',
      role: 'Programme Lead',
      text: "Reading Ana's note, I think the founding question is close to articulable: the relationship between infrastructure and practice in a city simultaneously subject to and instrument of a specific cultural transformation. That is Lisbon's question, not Barcelona's. If we proceed, that is what the satellite should be built to ask. I will have a written draft by 28 May.",
      timestamp: '21 May 2026 · 09:55',
    },
  ],

  dissent: {
    participant: 'Elena Vidal',
    role: 'Finance Director',
    text: "I want to register a formal concern without opposing the decision entirely. The financial model as currently proposed carries meaningful organizational risk. If the satellite does not achieve external funding in its first 18 months, the pressure on Barcelona's operations will be significant. I believe we should proceed only with a committed funding partner already identified — not as a condition we meet after the decision, but as a precondition for making it.",
    timestamp: '21 May 2026 · 11:20',
  },

  predictions: [
    { label: 'Lisbon satellite established, operational by Q4 2026', probability: 0.54 },
    { label: 'Decision deferred — insufficient consensus at Q2 deadline', probability: 0.28 },
    { label: 'Partnership model adopted as alternative path', probability: 0.12 },
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
  views: 14,
  citedIn: ['D-042'],
  relatedThreads: ['M-016', 'M-014'],
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
  tags: ['programme', 'open-call', 'model-shift', 'D-039', 'affiliation'],
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
        'D-042 LISBON — Rental window closes Jul 2026. Decision required before 23 Jun to preserve three remaining target properties. Signal S-001 (01 May): 8 of 14 suitable properties now leased to competitors. Each week of delay narrows the field.',
        "D-046 POBLENOU LEASE — 48 days overdue. Landlord's informal extension expires 31 May. No formal extension in writing. E. Vidal flagged this to council on 11 May; no formal action taken. Lease lapses if not addressed by end of month. Escalated.",
        'D-044 FUNDACIÓ MIRÓ — Board convenes 10 Jun. A. Costa (15 May): new director sympathetic to independent organizations. Position must be communicated no later than 06 Jun to allow preparation time. Three working days remain after this council.',
        'D-043 RESIDENCY 18-MONTH — If decision made before 31 May, Q4 2026 pilot launch is viable alongside current cohort. J. Ruiz has provisional framework ready. Window closes at end of month.',
      ],
    },
    {
      id: 'deliberation',
      label: 'Deliberation',
      description: 'Active reasoning on D-042. What has been said; what has not yet been said.',
      content: [
        'Eight exchanges recorded across 11 days (12–21 May). All five stakeholders have submitted positions — including A. Costa async from Lisbon on 19 May at 21:14.',
        'Financial position: E. Vidal (14 May) identified €90k available vs. €180k minimum (3-year commitment). Follow-up (20 May): two potential funding partners contacted; one responsive to 3-year programme support arrangement. Gap remains open but picture improving.',
        "Founding-question problem: P. Soler (16 May): the satellite must have its own founding question — something it is trying to understand that Barcelona cannot ask from its position. M. Ferrer accepted this as a precondition. P. Soler committed to draft statement by 28 May. Not yet submitted as of today.",
        'Lisbon appetite confirmed: A. Costa (19 May) spoke directly with Mariana Esteves and Nuno Querido this week. Both willing to engage seriously. Nuno Querido\'s current question — the relationship between infrastructure and practice — identified by P. Soler as a candidate founding question.',
        'Dissent formally registered: E. Vidal (21 May). Funding precondition should precede decision, not follow it. Recorded in thread.',
      ],
    },
    {
      id: 'framing',
      label: 'Framing',
      description: 'The question as currently held. Is it the right question?',
      content: [
        'Current frame: Should Alpha Espai open a Lisbon satellite presence in 2026?',
        "Frame challenge — P. Soler (16 May): Is this a question about organizational model — whether Alpha Espai should become a multi-node organization — with Lisbon as the test case rather than the subject?",
        "M. Ferrer response (19 May): The Lisbon question is the right frame for now. The model question is real but requires additional deliberation time we do not have. The deadline disciplines the framing.",
        'Unresolved tension: whether proceeding without the founding question fully settled constitutes a responsible decision or a premature commitment. This tension is not a reason to defer — it is the work that remains before 30 May.',
      ],
    },
    {
      id: 'rereading',
      label: 'Re-reading',
      description: 'What the archive says. Precedent and prior reasoning.',
      content: [
        "M-017 (Mar 2026) — Why we stopped open-call cohorts: 'Alpha Espai thinks well in specific terms.' The cohort model failed because it required the opposite. Risk: Lisbon satellite fails for the same reason if it becomes a generalizing rather than a deepening move.",
        "M-014 (Dec 2025) — What Lisbon represents: 'Lisbon is not about access to a new market. It is about access to a different question.' Written five months before D-042 was formally opened. The founding-question problem was anticipated.",
        'D-037 (Jan 2026) — Governance v3: The revised framework was designed explicitly to accommodate multi-node operation. Section 4.2 addresses satellite governance. This decision was made with Lisbon in mind.',
        "D-039 (Mar 2026) — Cohort programme: Precedent for this council's willingness to accept organizational discomfort in service of coherence. The satellite question requires the same quality of decision.",
      ],
    },
    {
      id: 'closing',
      label: 'Closing Summary',
      description: 'What was held; what remains open; what is to be done.',
      content: [
        'RESOLVED — Deadline confirmed: D-042 verdict required before 30 Jun 2026. This date is binding. Rental window and organizational momentum require it.',
        "RESOLVED — E. Vidal's funding precondition incorporated as a condition of the 'Proceed' option. Proceeding without an identified funding partner is not a valid path.",
        'ACTION: P. Soler — Draft one-page founding question for the Lisbon satellite. Due 28 May 2026. This document is a precondition for the verdict.',
        'ACTION: M. Ferrer — Continue funding partner conversations this week. Report status at next council. Target: one partner at letter-of-intent stage by 30 May.',
        'ACTION: E. Vidal — Send formal response to Poblenou landlord by 24 May. D-046 requires urgent attention independent of D-042.',
        'NEXT COUNCIL: 30 May 2026. Verdict on D-042 expected. P. Soler founding question document due.',
      ],
    },
  ],
}

export const weatherData = {
  unlocked: true,
  thresholdMet: 5,
  thresholdRequired: 5,
  generatedAt: '23 May 2026',
  basedOn: '42 deliberation entries · 5 active decisions · 11 weeks since last major settlement',
  pressureSystems: [
    {
      label: 'High pressure — Expansion orientation',
      description: '67% of deliberation weight is oriented toward growth (D-042, D-043, D-044). Creates a coherent directional field but risks overcommitment relative to operational capacity. D-046 overdue suggests attention deficit already present.',
      intensity: 'High',
    },
    {
      label: 'Low pressure — Operational confidence',
      description: 'Residency programme is settled. Governance v3 running smoothly. Internal relationships healthy: disagreements in D-042 have been recorded formally rather than suppressed. This is the stable ground from which the expansion questions are being held.',
      intensity: 'Low',
    },
  ],
  prevailingWinds: {
    direction: 'Outward',
    description: "The organization is moving toward greater geographic and relational reach. This is consistent with Chapter III's stated arc — the architecture of permanence requires more than one foundation. Three of five active decisions concern external commitments.",
  },
  stormFronts: [
    {
      label: 'Financial bifurcation risk',
      description: 'If D-042 proceeds without a funding solution, the satellite creates structural drain on Barcelona within 24 months. E. Vidal has quantified this: €90k shortfall over 3 years. Partner conversations are active but not resolved. This is the most significant storm front in the current reading.',
      severity: 'significant',
    },
    {
      label: 'Attention fragmentation — D-046',
      description: 'The Poblenou lease (D-046) has been overdue for 48 days with no formal action. This signals attention fragmentation — the council is focused on the larger strategic questions while an operational risk accumulates. If the lease lapses, it becomes a crisis.',
      severity: 'significant',
    },
    {
      label: 'Coherence risk — autonomy tension',
      description: "P. Soler's unresolved founding-question problem could bifurcate the organization intellectually before it does so spatially. Two sites with different answers to 'what is Alpha Espai' is more dangerous than one site with uncertainty. This risk is manageable — it has a specific action attached.",
      severity: 'moderate',
    },
  ],
  calm: [
    {
      label: 'Residency programme',
      description: "The residency is the organization's most stable element. Clear purpose, demonstrated track record, strong participant loyalty. 47 applications for the 2026 cycle, estimated 12 competitive. This is the organization's ground.",
    },
    {
      label: 'Internal relationships',
      description: 'The deliberation on D-042 has been honest and rigorous across 8 exchanges. Disagreements recorded formally. Ana Costa contributing from Lisbon. Javier Ruiz flagging operational sequencing. This is organizational health.',
    },
  ],
  backtestReading: {
    period: 'Spring 2024',
    description: 'Had this reading been taken in Spring 2024, it would have described an organization under significant coherence pressure from the open-call programme — a practice that contradicted its core intelligence. That storm front resolved through D-039 (settled March 2026, after 18 months of diminishing returns). Current storm fronts are real but more tractable: they have owners, they have deadlines, and the organization has demonstrated it can make hard decisions.',
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
      rationale: 'If the satellite is established with genuine autonomy and the right founding question, Lisbon will become the more generative of the two nodes within 3 years. Barcelona becomes the institutional anchor; Lisbon the experimental edge. Ana Costa\'s network and Nuno Querido\'s question point toward this.',
    },
    {
      id: 'B-002',
      title: 'The open-call model is permanently obsolete for organizations of this scale',
      owner: 'Marta Ferrer',
      conviction: 'Medium',
      horizon: '2027',
      rationale: 'The logic that killed our cohort programme (D-039, M-017) will affect peers operating at similar scale. Expect 60%+ of comparable organizations to have abandoned the format by 2027, whether or not they articulate the reasoning clearly. Alpha Espai is ahead of this curve.',
    },
    {
      id: 'B-003',
      title: 'Alpha Espai will hold a public institutional partnership within 18 months',
      owner: 'Elena Vidal',
      conviction: 'Medium',
      horizon: 'Q4 2027',
      rationale: 'The Fundació Miró question (D-044) will resolve positively or will be superseded by a different opportunity. The organization\'s model is now legible to public institutions in a way it was not during the cohort period. New Miró director is a signal.',
    },
  ],
  predictions: [
    { id: 'P-019', label: 'Lisbon rental window closes without D-042 decision', probability: 0.22, owner: 'Elena Vidal' },
    { id: 'P-020', label: 'Fundació Miró partnership declined or terms unsatisfactory', probability: 0.55, owner: 'Pau Soler' },
    { id: 'P-021', label: '18-month residency pilot launched in 2026', probability: 0.72, owner: 'Javier Ruiz' },
    { id: 'P-022', label: 'Lisbon satellite operational by Q4 2026', probability: 0.54, owner: 'Marta Ferrer' },
    { id: 'P-023', label: 'D-046 lease lapse requiring emergency renegotiation', probability: 0.31, owner: 'Elena Vidal' },
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
      consequence: 'Re-approach MACBA and Centre de Cultura Contemporània de Barcelona — open D-049',
      watchedBy: 'Marta Ferrer',
    },
    {
      id: 'T-003',
      condition: 'If residency applications drop >20% in 2026 cycle vs. 2025',
      consequence: 'Formal review of residency model — flag to council immediately, suspend D-043',
      watchedBy: 'Javier Ruiz',
    },
    {
      id: 'T-004',
      condition: 'If Lisbon founding question is not submitted by P. Soler by 28 May',
      consequence: 'D-042 verdict deferred — insufficient conditions for responsible decision',
      watchedBy: 'Marta Ferrer',
    },
  ],
  watchedSignals: [
    {
      id: 'S-001',
      label: 'Lisbon commercial rental index',
      source: 'Confidencial Imobiliário quarterly report',
      lastRead: '01 May 2026',
      reading: 'Rising 8% YoY. 8 of 14 target properties leased. Window narrowing: est. 3 viable options remain.',
      owner: 'Elena Vidal',
    },
    {
      id: 'S-002',
      label: 'Fundació Joan Miró board composition',
      source: 'Direct relationship — Ana Costa',
      lastRead: '15 May 2026',
      reading: 'New director (appointed Apr 2026) sympathetic to independent organizations. Previous director was obstructive. Timing favourable.',
      owner: 'Marta Ferrer',
    },
    {
      id: 'S-003',
      label: 'Peer organization Lisbon activity',
      source: 'Network observation — informal',
      lastRead: '10 May 2026',
      reading: '2 Barcelona-based peers actively seeking Lisbon space. One (unnamed) has identified a property. Competitive pressure building.',
      owner: 'Pau Soler',
    },
    {
      id: 'S-004',
      label: 'Residency application quality — 2026 cycle',
      source: 'Internal — application review in progress',
      lastRead: '05 May 2026',
      reading: 'Strong field: 47 applications received, estimated 12 competitive. Comparable to 2024 peak year. No sign of demand decline.',
      owner: 'Javier Ruiz',
    },
    {
      id: 'S-005',
      label: 'Barcelona commercial rent — Poblenou district',
      source: 'Landlord communication + Idealista index',
      lastRead: '11 May 2026',
      reading: 'Current lease €2,100/month. Proposed renewal: €2,650/month (+26%). Market rate for equivalent space: €2,400–2,800. Landlord aware of organization\'s constrained position.',
      owner: 'Elena Vidal',
    },
  ],
}
