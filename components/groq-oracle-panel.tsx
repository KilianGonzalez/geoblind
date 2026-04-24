'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bot, LoaderCircle, SendHorizonal, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Country } from '@/lib/types'
import type { GuessResult } from '@/lib/game-logic'

const MAX_ORACLE_QUESTIONS = 3

interface OracleMessage {
  role: 'user' | 'assistant'
  content: string
}

interface GroqOraclePanelProps {
  sessionId: string | null
  isPlaying: boolean
  targetCountry: Country | null
  guesses: GuessResult[]
}

const SUGGESTED_QUESTIONS = [
  '¿Qué patrón ves en mis últimos intentos?',
  '¿Estoy buscando demasiado al norte o al sur?',
  '¿Debería pensar en un país grande o pequeño?',
]

export default function GroqOraclePanel({
  sessionId,
  isPlaying,
  targetCountry,
  guesses,
}: GroqOraclePanelProps) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<OracleMessage[]>([])
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setQuestion('')
    setMessages([])
    setQuestionsUsed(0)
    setError(null)
  }, [sessionId])

  const remainingQuestions = MAX_ORACLE_QUESTIONS - questionsUsed
  const canAsk =
    isPlaying &&
    !loading &&
    !!sessionId &&
    !!targetCountry &&
    remainingQuestions > 0 &&
    question.trim().length > 0

  const oraclePayloadGuesses = useMemo(
    () =>
      guesses.map(guess => ({
        country: {
          name: guess.country.name,
          continent: guess.country.continent,
          iso_code: guess.country.iso_code,
        },
        distance: guess.distance,
        proximityPct: guess.proximityPct,
        direction: {
          label: guess.direction.label,
        },
        attemptNumber: guess.attemptNumber,
      })),
    [guesses]
  )

  async function askOracle(customQuestion?: string): Promise<void> {
    const nextQuestion = (customQuestion ?? question).trim()
    if (!nextQuestion || !sessionId || !targetCountry || !isPlaying || loading || remainingQuestions <= 0) {
      return
    }

    const nextHistory = [...messages, { role: 'user' as const, content: nextQuestion }]
    setLoading(true)
    setError(null)
    setMessages(nextHistory)
    setQuestion('')

    try {
      const response = await fetch('/api/groq/oracle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          question: nextQuestion,
          language: 'es',
          targetCountry: {
            name: targetCountry.name,
            iso_code: targetCountry.iso_code,
            continent: targetCountry.continent,
            region: targetCountry.region,
            lat: targetCountry.lat,
            lng: targetCountry.lng,
            neighbor_codes: targetCountry.neighbor_codes,
            population: targetCountry.population,
            area_km2: targetCountry.area_km2,
          },
          guesses: oraclePayloadGuesses,
          history: messages.slice(-6),
        }),
      })

      const data = (await response.json()) as { answer?: string; error?: string }
      if (!response.ok || !data.answer) {
        throw new Error(data.error ?? 'No se pudo obtener respuesta del oráculo.')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.answer! }])
      setQuestionsUsed(prev => prev + 1)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo obtener respuesta del oráculo.'
      setError(message)
      setMessages(prev => prev.slice(0, -1))
      setQuestion(nextQuestion)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/40 bg-card">
      <CardHeader className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Oráculo Groq
            </CardTitle>
            <CardDescription className="mt-1">
              Haz hasta {MAX_ORACLE_QUESTIONS} preguntas estratégicas. La IA responde sin revelar el país.
            </CardDescription>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-mono text-primary">
            {remainingQuestions} restantes
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuestion(suggestion)
                void askOracle(suggestion)
              }}
              disabled={!isPlaying || loading || remainingQuestions <= 0 || !targetCountry || !sessionId}
              className="rounded-full border border-border/50 bg-background px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <Textarea
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder="Pregunta algo como: ¿voy bien encaminado hacia cierto continente?"
            disabled={!isPlaying || loading || remainingQuestions <= 0 || !targetCountry || !sessionId}
            className="min-h-[96px] resize-none border-border/50 bg-background"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Usa el oráculo para pedir orientación, no para pedir la respuesta.
            </p>
            <Button onClick={() => void askOracle()} disabled={!canAsk}>
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
              Preguntar
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {messages.length > 0 && (
          <div className="mt-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl border px-3 py-2 ${
                  message.role === 'assistant'
                    ? 'border-primary/30 bg-primary/10'
                    : 'border-border/40 bg-background'
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {message.role === 'assistant' ? (
                    <>
                      <Bot className="h-3.5 w-3.5" />
                      Oráculo
                    </>
                  ) : (
                    'Tú'
                  )}
                </div>
                <p className="text-sm leading-6 text-foreground">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
