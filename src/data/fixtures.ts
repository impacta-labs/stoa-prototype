import type { SignalStatus } from '../components/primitives/Signal'

export interface DecisionSignal {
  id: string
  label: string
  status: SignalStatus
  context: string
  timestamp: string
}

export const signals: DecisionSignal[] = [
  {
    id: 'd-001',
    label: 'Market Expansion — Southeast Asia',
    status: 'deliberating',
    context: 'Executive Committee · Q3 Strategic Review',
    timestamp: '14:32',
  },
  {
    id: 'd-002',
    label: 'Restructure of Product Organization',
    status: 'open',
    context: 'Board Initiative · Pending Executive Input',
    timestamp: '09:15',
  },
  {
    id: 'd-003',
    label: 'Capital Allocation — FY2026',
    status: 'resolved',
    context: 'CFO Office · Closed 22 May 2026',
    timestamp: '—',
  },
  {
    id: 'd-004',
    label: 'Chief People Officer Succession',
    status: 'blocked',
    context: 'Board Nomination Committee · Legal Review Pending',
    timestamp: '11:44',
  },
]
