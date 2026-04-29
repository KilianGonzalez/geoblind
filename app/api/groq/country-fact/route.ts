import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant'
const GROQ_TIMEOUT_MS = 12000

interface CountryFactRequest {
  countryName?: unknown
  continent?: unknown
  language?: unknown
  nonce?: unknown
}

function getGroqApiKey(): string | null {
  return (
    process.env.GROQ_API_KEY ??
    process.env.GROQ_KEY ??
    process.env.GROQ_SECRET_KEY ??
    null
  )
}

function asSafeString(value: unknown, maxLen = 120): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLen) : ''
}

function systemPrompt(language: 'es' | 'en'): string {
  const responseLanguage = language === 'en' ? 'English' : 'Spanish'
  return [
    'You generate one concise interesting country fact for a geography game result card.',
    `Always answer in ${responseLanguage}.`,
    'Output plain text only.',
    'Max 28 words.',
    'No markdown, no bullet points, no quotation marks.',
    'Prefer geography, culture, nature, history, economy, or science.',
    'Avoid controversial political framing and avoid trivia with uncertain claims.',
  ].join(' ')
}

function userPrompt(params: {
  countryName: string
  continent: string
  nonce: string
}): string {
  return JSON.stringify(
    {
      country: params.countryName,
      continent: params.continent,
      randomSeed: params.nonce,
      task: 'Return one surprising but reliable fact about this country.',
    },
    null,
    2
  )
}

export async function POST(request: Request) {
  const apiKey = getGroqApiKey()
  if (!apiKey) {
    return NextResponse.json({ error: 'Groq no esta configurado en el servidor.' }, { status: 503 })
  }

  let body: CountryFactRequest
  try {
    body = (await request.json()) as CountryFactRequest
  } catch {
    return NextResponse.json({ error: 'Payload invalido.' }, { status: 400 })
  }

  const countryName = asSafeString(body.countryName, 140)
  const continent = asSafeString(body.continent, 80)
  const language = body.language === 'en' ? 'en' : 'es'
  const nonce = asSafeString(body.nonce, 80) || `${Date.now()}-${Math.random()}`

  if (!countryName) {
    return NextResponse.json({ error: 'Falta countryName.' }, { status: 400 })
  }

  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), GROQ_TIMEOUT_MS)

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_GROQ_MODEL,
        temperature: 0.95,
        max_tokens: 90,
        messages: [
          { role: 'system', content: systemPrompt(language) },
          {
            role: 'user',
            content: userPrompt({ countryName, continent, nonce }),
          },
        ],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Groq no pudo generar el dato.' }, { status: 502 })
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const factRaw = data.choices?.[0]?.message?.content?.trim()
    if (!factRaw) {
      return NextResponse.json({ error: 'No se recibio dato interesante.' }, { status: 502 })
    }

    const fact = factRaw.replace(/\s+/g, ' ').slice(0, 220)
    return NextResponse.json({ fact })
  } catch {
    return NextResponse.json({ error: 'No se pudo consultar Groq ahora.' }, { status: 500 })
  } finally {
    clearTimeout(timeoutId)
  }
}
