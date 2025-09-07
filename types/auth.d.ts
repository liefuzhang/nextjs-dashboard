import { User as SupabaseUser } from '@supabase/supabase-js'

declare global {
  export type UserRole = 'admin' | 'user'

  export interface AppUser {
    id: string
    email?: string
    name?: string
    role: UserRole
  }

  export interface AppSession {
    user: AppUser
  }

  export interface AuthContextType {
    user: SupabaseUser | null
    loading: boolean
    signOut: () => Promise<void>
    refresh: () => Promise<void>
  }

  export interface SessionHookReturn {
    data: AppSession | null
    status: 'loading' | 'authenticated' | 'unauthenticated'
  }
}

// Extend Supabase User type to include our metadata structure
declare module '@supabase/supabase-js' {
  interface UserMetadata {
    name?: string
    role?: UserRole
  }
}

export {}