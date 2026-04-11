export interface Hint {
  type: 'distance' | 'direction' | 'temperature'
  value: string | number
  revealed: boolean
}

export interface Country {
  name: string
  latitude: number
  longitude: number
  temperature: number
}

export interface GameState {
  secretCountry: string | null
  guesses: string[]
  hints: Hint[]
  gameOver: boolean
  won: boolean
  attempts: number
}

export interface GuessResult {
  correct: boolean
  hint?: {
    distance: number
    direction: string
  }
}
