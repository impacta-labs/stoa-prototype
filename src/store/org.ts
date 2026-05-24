import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OrgState {
  name: string
  sector: string
  context: string
  isConfigured: boolean
  configure: (name: string, sector: string, context: string) => void
  showSetup: boolean
  openSetup: () => void
  closeSetup: () => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      name: '',
      sector: '',
      context: '',
      isConfigured: false,
      showSetup: false,

      configure: (name, sector, context) =>
        set({ name, sector, context, isConfigured: true, showSetup: false }),

      openSetup: () => set({ showSetup: true }),
      closeSetup: () => set({ showSetup: false }),
    }),
    { name: 'stoa-org' }
  )
)
