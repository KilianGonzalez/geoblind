'use client'

import { useEffect } from 'react'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set dark theme by default on mount
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const storedTheme = localStorage.getItem('theme')
      
      if (storedTheme === 'light' || (storedTheme === null && !prefersDark)) {
        html.classList.remove('dark')
      } else {
        html.classList.add('dark')
      }
    }
  }, [])

  return <>{children}</>
}
