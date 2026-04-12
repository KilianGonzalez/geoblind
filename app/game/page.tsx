'use client'

import { use } from 'react'
import GameClient from './game-client'

export default function GamePage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, never>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  use(params)
  use(searchParams)

  return <GameClient />
}
