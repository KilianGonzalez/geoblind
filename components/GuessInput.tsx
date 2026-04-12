'use client'

import { useState, useRef, useEffect } from 'react'
import { getAllCountries } from '@/lib/game-logic'
import { Search } from 'lucide-react'

interface GuessInputProps {
  onGuess: (country: string) => void
  disabled: boolean
}

export default function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLFormElement>(null)

  const allCountries = getAllCountries()

  const handleInputChange = (value: string) => {
    setInput(value)

    if (value.trim().length > 0) {
      const filtered = allCountries.filter(country =>
        country.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (country: string) => {
    setInput(country)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onGuess(input.trim())
      setInput('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-2" ref={containerRef}>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Escribe un país..."
            disabled={disabled}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden shadow-lg z-10">
            {suggestions.map((country, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(country)}
                className="w-full px-4 py-3 text-left text-foreground hover:bg-primary/10 transition-colors"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Adivinar
      </button>
    </form>
  )
}
