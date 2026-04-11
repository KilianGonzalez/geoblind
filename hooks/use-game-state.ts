'use client'

import { useState, useCallback } from 'react'
import {
  getMockTarget,
  evaluateGuess,
  searchCountries,
  type GuessResult,
  type CountryData,
} from '@/lib/game-logic'

export type GameMode = 'diario' | 'infinito' | 'region' | 'contrarreloj' | 'dificil'
export type GameStatus = 'playing' | 'won' | 'lost'

export interface GameState {
  mode: GameMode
  targetCountry: CountryData
  guesses: GuessResult[]
  gameStatus: GameStatus
  attemptsUsed: number
  maxAttempts: number
  searchQuery: string
  searchResults: CountryData[]
  selectedIndex: number
}

export function useGameState() {
  const target = getMockTarget()

  const [state, setState] = useState<GameState>({
    mode: 'diario',
    targetCountry: target,
    guesses: [],
    gameStatus: 'playing',
    attemptsUsed: 0,
    maxAttempts: 6,
    searchQuery: '',
    searchResults: [],
    selectedIndex: -1,
  })

  const submitGuess = useCallback((countryName: string) => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') return prev
      const result = evaluateGuess(countryName, prev.targetCountry)
      if (!result) return prev

      // Prevent duplicate guesses
      if (prev.guesses.some(g => g.country.name === result.country.name)) return prev

      const newGuesses = [...prev.guesses, result]
      const newAttempts = prev.attemptsUsed + 1
      let newStatus: GameStatus = 'playing'

      if (result.isCorrect) {
        newStatus = 'won'
      } else if (newAttempts >= prev.maxAttempts) {
        newStatus = 'lost'
      }

      return {
        ...prev,
        guesses: newGuesses,
        attemptsUsed: newAttempts,
        gameStatus: newStatus,
        searchQuery: '',
        searchResults: [],
        selectedIndex: -1,
      }
    })
  }, [])

  const updateSearch = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      searchResults: searchCountries(query),
      selectedIndex: -1,
    }))
  }, [])

  const navigateResults = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      const max = prev.searchResults.length - 1
      if (max < 0) return prev
      let next = prev.selectedIndex + (direction === 'down' ? 1 : -1)
      next = Math.max(-1, Math.min(max, next))
      return { ...prev, selectedIndex: next }
    })
  }, [])

  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchQuery: '', searchResults: [], selectedIndex: -1 }))
  }, [])

  const giveUp = useCallback(() => {
    setState(prev => ({ ...prev, gameStatus: 'lost' }))
  }, [])

  const resetGame = useCallback(() => {
    const newTarget = getMockTarget()
    setState({
      mode: 'diario',
      targetCountry: newTarget,
      guesses: [],
      gameStatus: 'playing',
      attemptsUsed: 0,
      maxAttempts: 6,
      searchQuery: '',
      searchResults: [],
      selectedIndex: -1,
    })
  }, [])

  return { state, submitGuess, updateSearch, navigateResults, clearSearch, giveUp, resetGame }
}
