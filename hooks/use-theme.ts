'use client'

import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemPreference
    setTheme(initialTheme)
    
    // Apply the correct theme class
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    if (typeof document !== 'undefined') {
      // Remove both classes and add the new one
      document.documentElement.classList.remove('dark', 'light')
      document.documentElement.classList.add(newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  return { theme, toggleTheme }
}
