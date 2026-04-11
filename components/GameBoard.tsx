'use client'

import { checkGuess } from '@/lib/game-logic'
import { X, Check } from 'lucide-react'

interface GameBoardProps {
  guesses: string[]
  secretCountry: string | null
}

export default function GameBoard({ guesses, secretCountry }: GameBoardProps) {
  if (!secretCountry) {
    return (
      <div className="p-8 rounded-xl border border-border/40 bg-card/50 text-center">
        <p className="text-foreground/60">Cargando juego...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Intentos</h2>
      <div className="space-y-2">
        {guesses.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-border/40 text-foreground/60">
            Sin intentos aún. ¡Haz tu primer intento!
          </div>
        ) : (
          guesses.map((guess, index) => {
            const isCorrect = checkGuess(guess, secretCountry)
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  isCorrect
                    ? 'border-success/40 bg-success/10'
                    : 'border-border/40 bg-card/50 hover:border-border/60'
                }`}
              >
                <span className="text-sm font-medium text-foreground/60">#{index + 1}</span>
                <span className="flex-1 font-medium text-foreground">{guess}</span>
                {isCorrect ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <X className="w-5 h-5 text-error" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
