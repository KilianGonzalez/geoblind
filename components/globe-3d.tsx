'use client'

import { useEffect, useRef, useCallback } from 'react'
import { getProximityMarkerColor, type GuessResult } from '@/lib/game-logic'

interface Globe3DProps {
  guesses: GuessResult[]
  onCountryClick?: (countryName: string) => void
}

export default function Globe3D({ guesses, onCountryClick }: Globe3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const isInitialized = useRef(false)

  const initGlobe = useCallback(async () => {
    if (!mountRef.current || isInitialized.current) return
    isInitialized.current = true

    const GlobeGL = (await import('globe.gl')).default

    const container = mountRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 800

    const globe = GlobeGL()(container)
      .width(width)
      .height(height)
      .backgroundColor('#0A0E1A')
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .atmosphereColor('#00D4FF')
      .atmosphereAltitude(0.15)

    // Country polygon layer — subtle cyan borders
    globe
      .hexPolygonsData([])
      .hexPolygonAltitude(0.001)

    // Auto-rotation
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableZoom = true
    globe.controls().minDistance = 150
    globe.controls().maxDistance = 700

    globeRef.current = globe

    // Handle resize
    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry && globeRef.current) {
        globeRef.current
          .width(entry.contentRect.width)
          .height(entry.contentRect.height)
      }
    })
    observer.observe(mountRef.current)

    return () => observer.disconnect()
  }, [])

  // Initialize globe on mount
  useEffect(() => {
    initGlobe()
  }, [initGlobe])

  // Update markers and arcs whenever guesses change
  useEffect(() => {
    if (!globeRef.current || guesses.length === 0) return

    const lastGuess = guesses[guesses.length - 1]

    // Points for each guessed country
    const points = guesses.map(g => ({
      lat: g.country.latitude,
      lng: g.country.longitude,
      size: 0.5,
      color: getProximityMarkerColor(g.proximityPct),
      label: g.country.name,
    }))

    globeRef.current
      .pointsData(points)
      .pointAltitude('size')
      .pointColor('color')
      .pointLabel('label')
      .pointRadius(0.4)

    // Draw arc from guessed country outward in the direction of target
    // Arc does NOT reveal target — endpoint is offset in bearing direction
    const arcLat = lastGuess.country.latitude + Math.cos(lastGuess.bearing * Math.PI / 180) * 15
    const arcLng = lastGuess.country.longitude + Math.sin(lastGuess.bearing * Math.PI / 180) * 15

    globeRef.current
      .arcsData([{
        startLat: lastGuess.country.latitude,
        startLng: lastGuess.country.longitude,
        endLat: arcLat,
        endLng: arcLng,
        color: [getProximityMarkerColor(lastGuess.proximityPct), 'rgba(0,212,255,0)'],
        stroke: 1.2,
      }])
      .arcColor('color')
      .arcAltitude(0.08)
      .arcStroke('stroke')
      .arcDashLength(0.6)
      .arcDashGap(0.3)
      .arcDashAnimateTime(1500)

    // Rotate to focus on last guess
    globeRef.current.pointOfView(
      { lat: lastGuess.country.latitude, lng: lastGuess.country.longitude, altitude: 2 },
      1200
    )
  }, [guesses])

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0A0E1A' }}>
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        aria-label="Globo interactivo 3D"
      />

      {/* Legend */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-3 px-3 py-2 rounded-lg"
        style={{ background: 'rgba(13, 27, 42, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(27,58,75,0.6)' }}
      >
        {[
          { color: '#1E6091', label: 'Lejos' },
          { color: '#2D6A4F', label: 'Medio' },
          { color: '#C9A84C', label: 'Cerca' },
          { color: '#FF6B35', label: 'Muy cerca' },
          { color: '#4CAF50', label: 'Correcto' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: item.color }}
              aria-hidden="true"
            />
            <span
              className="text-xs text-muted-foreground"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
