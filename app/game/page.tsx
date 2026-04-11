'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe, ArrowLeft, Settings, Share2, RotateCcw } from 'lucide-react'
import GameBoard from '@/components/GameBoard'
import GuessInput from '@/components/GuessInput'
import HintDisplay from '@/components/HintDisplay'
import GameStats from '@/components/GameStats'
import GameModal from '@/components/GameModal'
import { getCountryOfDay, getHints, checkGuess } from '@/lib/game-logic'
import type { GameState, Hint } from '@/lib/types'

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    secretCountry: null,
    guesses: [],
    hints: [],
    gameOver: false,
    won: false,
    attempts: 0,
  })

  const [showSettings, setShowSettings] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)

  // Initialize game on mount
  useEffect(() => {
    const country = getCountryOfDay()
    const hints = getHints(country)
    
    setGameState(prev => ({
      ...prev,
      secretCountry: country,
      hints: hints,
    }))
  }, [])

  const handleGuess = (countryName: string) => {
    if (gameState.gameOver || !gameState.secretCountry) return

    const isCorrect = checkGuess(countryName, gameState.secretCountry)
    const newAttempts = gameState.attempts + 1

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        guesses: [...prev.guesses, countryName],
        gameOver: true,
        won: true,
        attempts: newAttempts,
      }))
      setShowWinModal(true)
    } else {
      if (newAttempts >= 6) {
        setGameState(prev => ({
          ...prev,
          guesses: [...prev.guesses, countryName],
          gameOver: true,
          won: false,
          attempts: newAttempts,
        }))
        setShowLoseModal(true)
      } else {
        setGameState(prev => ({
          ...prev,
          guesses: [...prev.guesses, countryName],
          attempts: newAttempts,
        }))
      }
    }
  }

  const handleReset = () => {
    const country = getCountryOfDay()
    const hints = getHints(country)
    
    setGameState({
      secretCountry: country,
      guesses: [],
      hints: hints,
      gameOver: false,
      won: false,
      attempts: 0,
    })
    setShowWinModal(false)
    setShowLoseModal(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">GeoBlind</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-card transition-colors">
              <Share2 className="w-5 h-5 text-foreground/70" />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-card transition-colors"
            >
              <Settings className="w-5 h-5 text-foreground/70" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Game Board */}
          <div className="lg:col-span-2 space-y-8">
            <GameBoard guesses={gameState.guesses} secretCountry={gameState.secretCountry} />
            
            {/* Hints Display */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Pistas Disponibles</h2>
              <div className="grid grid-cols-3 gap-4">
                {gameState.hints.map((hint, index) => (
                  <HintDisplay key={index} hint={hint} index={index} />
                ))}
              </div>
            </div>

            {/* Input Section */}
            {!gameState.gameOver && (
              <GuessInput 
                onGuess={handleGuess}
                disabled={gameState.gameOver}
              />
            )}

            {gameState.gameOver && (
              <div className="text-center space-y-4 p-8 rounded-xl border border-border/40 bg-card/50">
                <p className="text-foreground/70">
                  {gameState.won 
                    ? `¡Correcto! El país era ${gameState.secretCountry}` 
                    : `Game Over. El país era ${gameState.secretCountry}`}
                </p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Jugar de Nuevo
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div>
            <GameStats attempts={gameState.attempts} guesses={gameState.guesses} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWinModal && (
        <GameModal
          type="win"
          country={gameState.secretCountry || ''}
          attempts={gameState.attempts}
          onClose={() => setShowWinModal(false)}
          onPlayAgain={handleReset}
        />
      )}

      {showLoseModal && (
        <GameModal
          type="lose"
          country={gameState.secretCountry || ''}
          attempts={gameState.attempts}
          onClose={() => setShowLoseModal(false)}
          onPlayAgain={handleReset}
        />
      )}
    </main>
  )
}
