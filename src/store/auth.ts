import { create } from 'zustand'
import { supabase, SUPABASE_ENABLED } from '../lib/supabase'
import { useDecisionsStore } from './decisions'
import { useOrgStore } from './org'
import type { User, Session } from '@supabase/supabase-js'
import type { UserDecision } from '../types'

interface AuthState {
  user: User | null
  orgId: string | null
  session: Session | null
  loading: boolean
  initialized: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  syncDecisions: () => Promise<void>
  syncOrg: (name: string, sector: string, context: string) => Promise<void>
}

async function loadUserData(userId: string): Promise<string | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', userId)
    .single()

  if (!profile?.org_id) return null
  const orgId = profile.org_id as string

  const { data: org } = await supabase
    .from('orgs')
    .select('name, sector, context')
    .eq('id', orgId)
    .single()

  if (org) {
    useOrgStore.getState().configure(
      org.name as string,
      (org.sector as string) || '',
      (org.context as string) || ''
    )
  }

  const { data: rows } = await supabase
    .from('decisions')
    .select('data')
    .eq('org_id', orgId)

  if (rows && rows.length > 0) {
    const decisions = rows.map((r: any) => r.data as UserDecision)
    useDecisionsStore.getState().loadDemoDecisions(decisions)
  } else {
    useDecisionsStore.getState().clearDecisions()
  }

  return orgId
}

let authListenerSet = false

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  orgId: null,
  session: null,
  loading: false,
  initialized: false,
  error: null,

  initialize: async () => {
    if (!SUPABASE_ENABLED) {
      set({ initialized: true })
      return
    }
    set({ loading: true })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const orgId = await loadUserData(session.user.id)
        set({ user: session.user, session, orgId, initialized: true, loading: false })
      } else {
        set({ initialized: true, loading: false })
      }
    } catch {
      set({ initialized: true, loading: false })
    }

    if (!authListenerSet) {
      authListenerSet = true
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const orgId = await loadUserData(session.user.id)
          set({ user: session.user, session, orgId })
        } else if (event === 'SIGNED_OUT') {
          useDecisionsStore.getState().clearDecisions()
          useOrgStore.getState().resetOrg()
          set({ user: null, session: null, orgId: null })
        }
      })
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ loading: false, error: error.message })
      return error.message
    }
    if (data.user) {
      const orgId = await loadUserData(data.user.id)
      set({ user: data.user, session: data.session, orgId, loading: false })
    }
    return null
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ loading: false, error: error.message })
      return error.message
    }
    if (data.user) {
      const { data: org, error: orgErr } = await supabase
        .from('orgs')
        .insert({ name: 'Nueva organización', sector: '', context: '' })
        .select()
        .single()
      if (orgErr || !org) {
        set({ loading: false, error: 'Error creando la organización' })
        return 'Error creando la organización'
      }
      await supabase.from('profiles').insert({ id: data.user.id, org_id: org.id })
      set({ user: data.user, session: data.session, orgId: org.id as string, loading: false })
    }
    return null
  },

  signOut: async () => {
    await supabase.auth.signOut()
    useDecisionsStore.getState().clearDecisions()
    useOrgStore.getState().resetOrg()
    set({ user: null, session: null, orgId: null, error: null })
  },

  syncDecisions: async () => {
    const { orgId } = get()
    if (!orgId || !SUPABASE_ENABLED) return
    const decisions = useDecisionsStore.getState().decisions
    if (decisions.length === 0) return
    await supabase.from('decisions').upsert(
      decisions.map((d) => ({
        id: d.id,
        org_id: orgId,
        data: d,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'id,org_id' }
    )
  },

  syncOrg: async (name, sector, context) => {
    const { orgId } = get()
    if (!orgId || !SUPABASE_ENABLED) return
    await supabase
      .from('orgs')
      .update({ name, sector, context, updated_at: new Date().toISOString() })
      .eq('id', orgId)
  },
}))
