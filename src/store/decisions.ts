import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDecision, DeliberationEntry } from '../types'

interface DecisionsState {
  decisions: UserDecision[]
  pilotMode: boolean
  showCreateModal: boolean
  addDecision: (d: UserDecision) => void
  updateDecision: (id: string, patch: Partial<UserDecision>) => void
  settleDecision: (id: string, verdict: string, retrospectiva?: string) => void
  markConditionSatisfied: (decisionId: string, conditionId: string, satisfied: boolean) => void
  addDeliberationEntry: (decisionId: string, entry: Omit<DeliberationEntry, 'id'>) => void
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

      settleDecision: (id, verdict, retrospectiva) =>
        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: 'resuelta' as const,
                  selectedVerdict: verdict,
                  settledAt: new Date().toISOString(),
                  retrospectiva: retrospectiva ?? d.retrospectiva,
                }
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
                  deliberationEntries: [
                    ...d.deliberationEntries,
                    { ...entry, id: `E-${Date.now()}` },
                  ],
                }
              : d
          ),
        })),

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
