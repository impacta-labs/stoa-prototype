import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OrgState {
  name: string
  sector: string
  context: string
  isConfigured: boolean
  configure: (name: string, sector: string, context: string) => void
  resetOrg: () => void
  showSetup: boolean
  openSetup: () => void
  closeSetup: () => void
  showOnboarding: boolean
  openOnboarding: () => void
  closeOnboarding: () => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      name: '',
      sector: '',
      context: '',
      isConfigured: false,
      showSetup: false,
      showOnboarding: false,

      configure: (name, sector, context) =>
        set({ name, sector, context, isConfigured: true, showSetup: false, showOnboarding: false }),

      resetOrg: () =>
        set({ name: '', sector: '', context: '', isConfigured: false }),

      openSetup: () => set({ showSetup: true }),
      closeSetup: () => set({ showSetup: false }),

      openOnboarding: () => set({ showOnboarding: true }),
      closeOnboarding: () => set({ showOnboarding: false }),
    }),
    {
      name: 'stoa-org',
      partialize: (s) => ({
        name: s.name,
        sector: s.sector,
        context: s.context,
        isConfigured: s.isConfigured,
      }),
    }
  )
)
