import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDecision, DeliberationEntry, ActualResults } from '../types'

interface DecisionsState {
  decisions: UserDecision[]
  pilotMode: boolean
  showCreateModal: boolean
  addDecision: (d: UserDecision) => void
  updateDecision: (id: string, patch: Partial<UserDecision>) => void
  settleDecision: (id: string, verdict: string, prediccion?: string, retrospectiva?: string) => void
  registerActualResults: (id: string, results: ActualResults) => void
  markConditionSatisfied: (decisionId: string, conditionId: string, satisfied: boolean) => void
  addDeliberationEntry: (decisionId: string, entry: Omit<DeliberationEntry, 'id'>) => void
  loadDemoDecisions: (demos: UserDecision[]) => void
  clearDecisions: () => void
  togglePilotMode: () => void
  openCreateModal: () => void
  closeCreateModal: () => void
}

export const useDecisionsStore = create<DecisionsState>()(
  persist(
    (set) => ({
      decisions: [],
      pilotMode: false,
      showCreateModal: false,

      addDecision: (d) => set((s) => ({ decisions: [...s.decisions, d] })),

      updateDecision: (id, patch) =>
        set((s) => ({
          decisions: s.decisions.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),

      settleDecision: (id, verdict, prediccion, retrospectiva) =>
        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: 'resuelta' as const,
                  selectedVerdict: verdict,
                  prediccion: prediccion !== undefined ? prediccion : d.prediccion,
                  settledAt: new Date().toISOString(),
                  retrospectiva: retrospectiva ?? d.retrospectiva,
                }
              : d
          ),
        })),

      registerActualResults: (id, results) =>
        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === id
              ? { ...d, actualResults: results, hypothesisStatus: results.hypothesisStatus, retrospectiva: results.narrativa || d.retrospectiva }
              : d
          ),
        })),

      markConditionSatisfied: (decisionId, conditionId, satisfied) =>
        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  resolutionConditions: d.resolutionConditions.map((c) =>
                    c.id === conditionId ? { ...c, satisfied } : c
                  ),
                }
              : d
          ),
        })),

      addDeliberationEntry: (decisionId, entry) =>
        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === decisionId
              ? {
                  ...d,
                  status: d.status === 'evaluacion' ? ('deliberando' as const) : d.status,
                  deliberationEntries: [
                    ...d.deliberationEntries,
                    { ...entry, id: `E-${Date.now()}` },
                  ],
                }
              : d
          ),
        })),

      loadDemoDecisions: (demos) => set({ decisions: demos }),
      clearDecisions: () => set({ decisions: [] }),

      togglePilotMode: () => set((s) => ({ pilotMode: !s.pilotMode })),
      openCreateModal: () => set({ showCreateModal: true }),
      closeCreateModal: () => set({ showCreateModal: false }),
    }),
    {
      name: 'stoa-decisions',
      partialize: (s) => ({
        decisions: s.decisions,
        pilotMode: s.pilotMode,
      }),
    }
  )
)

export function nextDecisionId(decisions: UserDecision[]): string {
  const count = decisions.filter((d) => d.id.startsWith('U-')).length
  return `U-${String(count + 1).padStart(3, '0')}`
}

export function formatOpenedDate(): string {
  const d = new Date()
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export function daysActive(opened: string): number {
  const then = new Date(opened).getTime()
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000))
}

export function reviewHorizonDate(horizon: string): Date | null {
  if (!horizon) return null
  // "Q1 2026" → end of March 2026
  const q = horizon.match(/Q([1-4])\s*(\d{4})/i)
  if (q) {
    const endMonth = parseInt(q[1]) * 3 - 1  // 0-indexed: Q1→2, Q2→5, Q3→8, Q4→11
    return new Date(parseInt(q[2]), endMonth + 1, 0)
  }
  // "Dic 2026", "Dec 2026", "Mar 2026"
  const months: Record<string, number> = {
    ene:0, feb:1, mar:2, abr:3, may:4, jun:5,
    jul:6, ago:7, sep:8, oct:9, nov:10, dic:11,
    jan:0, apr:3, aug:7, sep2:8, oct2:9,
    dec:11,
  }
  const m = horizon.match(/([A-Za-zéúíó]+)\s*(\d{4})/i)
  if (m) {
    const key = m[1].toLowerCase().slice(0, 3)
    const mo = months[key]
    if (mo !== undefined) return new Date(parseInt(m[2]), mo + 1, 0)
  }
  // ISO date
  const d = new Date(horizon)
  return isNaN(d.getTime()) ? null : d
}

export function reviewHorizonPassed(horizon: string): boolean {
  const d = reviewHorizonDate(horizon)
  return d ? d.getTime() < Date.now() : false
}

export function reviewHorizonDaysLeft(horizon: string): number | null {
  const d = reviewHorizonDate(horizon)
  if (!d) return null
  return Math.floor((d.getTime() - Date.now()) / 86_400_000)
}
