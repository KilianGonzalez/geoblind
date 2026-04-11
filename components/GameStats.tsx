'use client'

import { BarChart3, Target } from 'lucide-react'

interface GameStatsProps {
  attempts: number
  guesses: string[]
}

export default function GameStats({ attempts, guesses }: GameStatsProps) {
  const maxAttempts = 6
  const remainingAttempts = maxAttempts - attempts

  return (
    <div className="sticky top-24 space-y-6">
      {/* Attempts Counter */}
      <div className="p-6 rounded-xl border border-border/40 bg-card/50 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Intentos</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Usados</span>
            <span className="text-lg font-bold text-primary">{attempts}/6</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-card rounded-full overflow-hidden border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${(attempts / 6) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs text-foreground/60">
            <span>{remainingAttempts} intentos restantes</span>
            {remainingAttempts === 0 && <span className="text-error">¡Límite alcanzado!</span>}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 rounded-xl border border-border/40 bg-card/50 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Estadísticas</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-foreground/60">Adivinanzas</span>
            <span className="font-semibold text-foreground">{guesses.length}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-foreground/60">Tasa de Error</span>
            <span className="font-semibold text-foreground">
              {guesses.length === 0 ? '0%' : `${Math.round((guesses.length / attempts) * 100)}%`}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
            <span className="text-sm text-foreground/60">Dificultad</span>
            <span className="text-sm font-semibold">
              {attempts <= 2 ? '🔥 Fácil' : attempts <= 4 ? '⚡ Media' : '❄️ Difícil'}
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl border border-border/40 bg-card/50">
        <h3 className="font-semibold text-sm text-foreground mb-3">💡 Consejos</h3>
        <ul className="space-y-2 text-xs text-foreground/60">
          <li>• Usa las pistas estratégicamente</li>
          <li>• Considera la dirección y distancia</li>
          <li>• La temperatura te ayudará a narrowdown</li>
        </ul>
      </div>
    </div>
  )
}
