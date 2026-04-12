'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  createdAt: string
}

export interface UserStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  averageAttempts: number
  totalScore: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
}

interface AuthContextType {
  user: User | null
  stats: UserStats
  achievements: Achievement[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const defaultStats: UserStats = {
  gamesPlayed: 47,
  gamesWon: 38,
  currentStreak: 5,
  maxStreak: 12,
  averageAttempts: 3.8,
  totalScore: 4250,
}

const defaultAchievements: Achievement[] = [
  { id: '1', name: 'Primera Victoria', description: 'Gana tu primera partida', icon: '🏆', unlockedAt: '2024-01-15' },
  { id: '2', name: 'Racha de 5', description: 'Consigue una racha de 5 victorias', icon: '🔥', unlockedAt: '2024-02-20' },
  { id: '3', name: 'Explorador', description: 'Adivina 10 países diferentes', icon: '🌍', unlockedAt: '2024-03-01' },
  { id: '4', name: 'Perfeccionista', description: 'Adivina en el primer intento', icon: '⭐', unlockedAt: '2024-03-10' },
  { id: '5', name: 'Veterano', description: 'Juega 30 partidas', icon: '🎖️', unlockedAt: '2024-03-25' },
  { id: '6', name: 'Maestro Continental', description: 'Adivina un país de cada continente', icon: '🗺️' },
  { id: '7', name: 'Racha Legendaria', description: 'Consigue una racha de 30 victorias', icon: '💎' },
]

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'geoblind_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setUser(parsed)
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock validation
    if (!email.includes('@')) {
      return { success: false, error: 'Email inválido' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Contraseña incorrecta' }
    }

    // Mock successful login
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      username: email.split('@')[0],
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
    return { success: true }
  }, [])

  const register = useCallback(async (email: string, username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation
    if (!email.includes('@')) {
      return { success: false, error: 'Email inválido' }
    }
    if (username.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' }
    }
    if (password.length < 8) {
      return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' }
    }

    // Mock successful registration
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      username,
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
    return { success: true }
  }, [user])

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (currentPassword.length < 6) {
      return { success: false, error: 'Contraseña actual incorrecta' }
    }
    if (newPassword.length < 8) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres' }
    }

    return { success: true }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        stats: defaultStats,
        achievements: defaultAchievements,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
