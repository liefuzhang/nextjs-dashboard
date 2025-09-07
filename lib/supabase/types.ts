// Local types for convenience
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

// Utility functions for user metadata
export const getUserRole = (user: { user_metadata?: { role?: UserRole } }): UserRole => {
  return user?.user_metadata?.role || 'user'
}

export const getUserName = (user: { user_metadata?: { name?: string }; email?: string }): string => {
  return user?.user_metadata?.name || user?.email || 'User'
}

export const mapSupabaseUserToAppUser = (user: { 
  id: string; 
  email?: string; 
  user_metadata?: { name?: string; role?: UserRole } 
}): AppUser => ({
  id: user.id,
  email: user.email,
  name: getUserName(user),
  role: getUserRole(user)
})