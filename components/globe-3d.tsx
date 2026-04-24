'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLanguage } from '@/hooks/use-language'
import { getProximityMarkerColor } from '@/lib/game-logic'

interface Globe3DProps {
  guesses: Array<{
    country: {
      id: string
      name: string
      iso_code: string
      flag_emoji: string
      continent: string
      lat: number
      lng: number
    }
    bearing: number
    proximityPct: number
  }>
  onCountryClick?: (countryName: string) => void
}

type GeoCoordinate = [number, number]
type GeoRing = GeoCoordinate[]
type GeoPolygon = GeoRing[]

interface WorldFeature {
  properties: {
    name?: string
    'ISO3166-1-Alpha-2'?: string
  }
  geometry:
    | { type: 'Polygon'; coordinates: GeoPolygon }
    | { type: 'MultiPolygon'; coordinates: GeoPolygon[] }
}

interface WorldGeoJson {
  type: 'FeatureCollection'
  features: WorldFeature[]
}

const TEXTURE_WIDTH = 2048
const TEXTURE_HEIGHT = 1024
const GEOJSON_URL = '/countries.geojson'
const GLOBE_BACKGROUND = '#000000'
const BORDER_COLOR = '#FFFFFF'
const PLANET_OUTLINE_RADIUS_INNER = 1.022
const PLANET_OUTLINE_RADIUS_OUTER = 1.048
const PLANET_GLOW_RADIUS_INNER = 1.046
const PLANET_GLOW_RADIUS_OUTER = 1.085
const STAR_COUNT = 2200
const STARFIELD_RADIUS = 22
const COUNTRY_FILL_OPACITY = 0.78
const SHOOTING_STAR_POOL_SIZE = 3
const SHOOTING_STAR_MIN_INTERVAL_MS = 5000
const SHOOTING_STAR_MAX_INTERVAL_MS = 12000

const LEGEND_ITEMS = [
  {
    key: 'far',
    color: getProximityMarkerColor(0),
    labels: { es: 'Lejos', en: 'Far' },
  },
  {
    key: 'medium',
    color: getProximityMarkerColor(21),
    labels: { es: 'Medio', en: 'Medium' },
  },
  {
    key: 'close',
    color: getProximityMarkerColor(51),
    labels: { es: 'Cerca', en: 'Close' },
  },
  {
    key: 'veryClose',
    color: getProximityMarkerColor(81),
    labels: { es: 'Muy cerca', en: 'Very close' },
  },
  {
    key: 'correct',
    color: getProximityMarkerColor(100),
    labels: { es: 'Correcto', en: 'Correct' },
  },
] as const

function normalizeIsoCode(value: string | undefined): string {
  return value?.trim().toUpperCase() ?? ''
}

function withOpacity(hexColor: string, opacity: number): string {
  const hex = hexColor.replace('#', '')
  if (hex.length !== 6) return hexColor

  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

function createTextureCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_WIDTH
  canvas.height = TEXTURE_HEIGHT
  return canvas
}

function getFeaturePolygons(feature: WorldFeature): GeoPolygon[] {
  return feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates
}

function projectCoordinateToTexture([lng, lat]: GeoCoordinate): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * TEXTURE_WIDTH,
    y: ((90 - lat) / 180) * TEXTURE_HEIGHT,
  }
}

function traceRing(
  ctx: CanvasRenderingContext2D,
  ring: GeoRing,
  shiftX: number
): void {
  if (ring.length === 0) return

  const points = ring.map(projectCoordinateToTexture)
  const unwrapped = points.map((point, index) => {
    if (index === 0) return { x: point.x, y: point.y }

    const prev = points[index - 1]
    let x = point.x
    const delta = x - prev.x

    if (delta > TEXTURE_WIDTH / 2) {
      x -= TEXTURE_WIDTH
    } else if (delta < -TEXTURE_WIDTH / 2) {
      x += TEXTURE_WIDTH
    }

    return { x, y: point.y }
  })

  for (let index = 1; index < unwrapped.length; index += 1) {
    const prev = unwrapped[index - 1]
    const current = unwrapped[index]
    const delta = current.x - prev.x

    if (delta > TEXTURE_WIDTH / 2) {
      current.x -= TEXTURE_WIDTH
    } else if (delta < -TEXTURE_WIDTH / 2) {
      current.x += TEXTURE_WIDTH
    }
  }

  ctx.moveTo(unwrapped[0].x + shiftX, unwrapped[0].y)
  for (let index = 1; index < unwrapped.length; index += 1) {
    ctx.lineTo(unwrapped[index].x + shiftX, unwrapped[index].y)
  }
  ctx.closePath()
}

function tracePolygon(ctx: CanvasRenderingContext2D, polygon: GeoPolygon): void {
  for (const ring of polygon) {
    traceRing(ctx, ring, -TEXTURE_WIDTH)
    traceRing(ctx, ring, 0)
    traceRing(ctx, ring, TEXTURE_WIDTH)
  }
}

function drawFeatureFill(
  ctx: CanvasRenderingContext2D,
  feature: WorldFeature,
  fillColor: string
): void {
  ctx.fillStyle = fillColor
  for (const polygon of getFeaturePolygons(feature)) {
    ctx.beginPath()
    tracePolygon(ctx, polygon)
    ctx.fill('evenodd')
  }
}

function drawFeatureStroke(ctx: CanvasRenderingContext2D, feature: WorldFeature): void {
  for (const polygon of getFeaturePolygons(feature)) {
    ctx.beginPath()
    tracePolygon(ctx, polygon)
    ctx.stroke()
  }
}

function drawBaseMap(
  canvas: HTMLCanvasElement,
  features: WorldFeature[]
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = GLOBE_BACKGROUND
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = BORDER_COLOR
  ctx.lineWidth = 0.9
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (const feature of features) {
    drawFeatureStroke(ctx, feature)
  }
}

function redrawGuessTexture(params: {
  baseCanvas: HTMLCanvasElement
  textureCanvas: HTMLCanvasElement
  texture: THREE.CanvasTexture
  featuresByIso: Map<string, WorldFeature[]>
  guesses: Globe3DProps['guesses']
}): void {
  const { baseCanvas, textureCanvas, texture, featuresByIso, guesses } = params
  const ctx = textureCanvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height)
  ctx.drawImage(baseCanvas, 0, 0)
  ctx.lineWidth = 1.2
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = BORDER_COLOR

  for (const guess of guesses) {
    const isoCode = normalizeIsoCode(guess.country.iso_code)
    const features = featuresByIso.get(isoCode)
    if (!features) continue

    const fillColor = withOpacity(
      getProximityMarkerColor(guess.proximityPct),
      COUNTRY_FILL_OPACITY
    )
    for (const feature of features) {
      drawFeatureFill(ctx, feature, fillColor)
      drawFeatureStroke(ctx, feature)
    }
  }

  texture.needsUpdate = true
}

export default function Globe3D({ guesses }: Globe3DProps) {
  const { language } = useLanguage()
  const mountRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeGroupRef = useRef<THREE.Group | null>(null)
  const globeOutlineRef = useRef<THREE.Mesh | null>(null)
  const globeGlowRef = useRef<THREE.Mesh | null>(null)
  const starfieldRef = useRef<THREE.Points | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const baseTextureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const globeTextureRef = useRef<THREE.CanvasTexture | null>(null)
  const featuresByIsoRef = useRef<Map<string, WorldFeature[]>>(new Map())
  const guessesRef = useRef(guesses)

  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    if (width === 0 || height === 0) {
      console.warn('Globe container has no dimensions')
      return
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(GLOBE_BACKGROUND)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 3.2
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const textureCanvas = createTextureCanvas()
    const textureContext = textureCanvas.getContext('2d')
    textureContext?.fillRect(0, 0, textureCanvas.width, textureCanvas.height)
    textureCanvasRef.current = textureCanvas

    const globeTexture = new THREE.CanvasTexture(textureCanvas)
    globeTexture.colorSpace = THREE.SRGBColorSpace
    globeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    globeTextureRef.current = globeTexture

    const globeGeometry = new THREE.SphereGeometry(1, 64, 64)
    const globeMaterial = new THREE.MeshBasicMaterial({
      map: globeTexture,
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    const globeGroup = new THREE.Group()
    globeGroup.add(globe)
    globeGroup.rotation.y = -Math.PI / 2
    scene.add(globeGroup)
    globeGroupRef.current = globeGroup

    const outlineGeometry = new THREE.RingGeometry(
      PLANET_OUTLINE_RADIUS_INNER,
      PLANET_OUTLINE_RADIUS_OUTER,
      256
    )
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: BORDER_COLOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.58,
    })
    const globeOutline = new THREE.Mesh(outlineGeometry, outlineMaterial)
    scene.add(globeOutline)
    globeOutlineRef.current = globeOutline

    const glowGeometry = new THREE.RingGeometry(
      PLANET_GLOW_RADIUS_INNER,
      PLANET_GLOW_RADIUS_OUTER,
      256
    )
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: BORDER_COLOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    })
    const globeGlow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(globeGlow)
    globeGlowRef.current = globeGlow

    const starPositions: number[] = []
    const starSizes: number[] = []
    for (let index = 0; index < STAR_COUNT; index += 1) {
      const theta = Math.random() * Math.PI * 2
      const u = Math.random() * 2 - 1
      const radius = STARFIELD_RADIUS + Math.random() * 18
      const sinPhi = Math.sqrt(1 - u * u)
      starPositions.push(
        radius * sinPhi * Math.cos(theta),
        radius * sinPhi * Math.sin(theta),
        radius * u
      )
      starSizes.push(Math.random() * 1.6 + 0.4)
    }

    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1))

    const starMaterial = new THREE.PointsMaterial({
      color: BORDER_COLOR,
      size: 0.16,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    })

    const starfield = new THREE.Points(starGeometry, starMaterial)
    scene.add(starfield)
    starfieldRef.current = starfield

    type ShootingStar = {
      geometry: THREE.BufferGeometry
      line: THREE.Line
      material: THREE.LineBasicMaterial
      positions: Float32Array
      active: boolean
      startTime: number
      durationMs: number
      start: THREE.Vector3
      velocity: THREE.Vector3
      trailLength: number
    }

    const shootingStars: ShootingStar[] = []
    let nextShootingStarAt =
      performance.now() +
      SHOOTING_STAR_MIN_INTERVAL_MS +
      Math.random() * (SHOOTING_STAR_MAX_INTERVAL_MS - SHOOTING_STAR_MIN_INTERVAL_MS)

    for (let index = 0; index < SHOOTING_STAR_POOL_SIZE; index += 1) {
      const positions = new Float32Array(6)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const material = new THREE.LineBasicMaterial({
        color: BORDER_COLOR,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })

      const line = new THREE.Line(geometry, material)
      line.visible = false
      scene.add(line)

      shootingStars.push({
        geometry,
        line,
        material,
        positions,
        active: false,
        startTime: 0,
        durationMs: 0,
        start: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        trailLength: 0,
      })
    }

    function spawnShootingStar(now: number): void {
      const star = shootingStars.find(candidate => !candidate.active)
      if (!star) return

      const moveLeft = Math.random() > 0.5
      const startX = moveLeft ? 8 + Math.random() * 4 : -8 - Math.random() * 4
      const startY = 2.5 + Math.random() * 4.5
      const startZ = -10 - Math.random() * 10
      const horizontalSpeed = moveLeft ? -(5 + Math.random() * 3) : 5 + Math.random() * 3
      const verticalSpeed = -(2.3 + Math.random() * 1.7)

      star.active = true
      star.startTime = now
      star.durationMs = 700 + Math.random() * 600
      star.start.set(startX, startY, startZ)
      star.velocity.set(horizontalSpeed, verticalSpeed, 0)
      star.trailLength = 1.1 + Math.random() * 1.4
      star.material.opacity = 0
      star.line.visible = true
    }

    const handleMouseDown = (event: MouseEvent) => {
      isDragging.current = true
      previousMousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.current || !globeGroupRef.current) return

      const deltaX = event.clientX - previousMousePosition.current.x
      const deltaY = event.clientY - previousMousePosition.current.y

      globeGroupRef.current.rotation.y += deltaX * 0.01
      globeGroupRef.current.rotation.x += deltaY * 0.01
      globeGroupRef.current.rotation.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, globeGroupRef.current.rotation.x)
      )

      previousMousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return
      event.preventDefault()
      
      const zoomSpeed = 0.1
      const minZ = 1.5
      const maxZ = 5
      
      cameraRef.current.position.z += event.deltaY * zoomSpeed * 0.01
      cameraRef.current.position.z = Math.max(minZ, Math.min(maxZ, cameraRef.current.position.z))
    }

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('wheel', handleWheel, { passive: false })

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry && cameraRef.current && rendererRef.current) {
        const { width, height } = entry.contentRect
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(width, height)
      }
    })
    resizeObserver.observe(container)

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      const now = performance.now()

      if (globeGroupRef.current && !isDragging.current) {
        globeGroupRef.current.rotation.y += 0.0015
      }

      if (globeOutlineRef.current && cameraRef.current) {
        globeOutlineRef.current.quaternion.copy(cameraRef.current.quaternion)
      }

      if (globeGlowRef.current && cameraRef.current) {
        globeGlowRef.current.quaternion.copy(cameraRef.current.quaternion)
      }

      if (starfieldRef.current) {
        starfieldRef.current.rotation.y += 0.00035
        starfieldRef.current.rotation.x += 0.00008
      }

      if (now >= nextShootingStarAt) {
        spawnShootingStar(now)
        nextShootingStarAt =
          now +
          SHOOTING_STAR_MIN_INTERVAL_MS +
          Math.random() * (SHOOTING_STAR_MAX_INTERVAL_MS - SHOOTING_STAR_MIN_INTERVAL_MS)
      }

      for (const shootingStar of shootingStars) {
        if (!shootingStar.active) continue

        const progress = Math.min(1, (now - shootingStar.startTime) / shootingStar.durationMs)
        const direction = shootingStar.velocity.clone().normalize()
        const head = shootingStar.start.clone().addScaledVector(shootingStar.velocity, progress)
        const tail = head.clone().addScaledVector(direction, -shootingStar.trailLength)

        shootingStar.positions[0] = head.x
        shootingStar.positions[1] = head.y
        shootingStar.positions[2] = head.z
        shootingStar.positions[3] = tail.x
        shootingStar.positions[4] = tail.y
        shootingStar.positions[5] = tail.z

        const fadeIn = Math.min(1, progress / 0.18)
        const fadeOut = 1 - Math.max(0, (progress - 0.72) / 0.28)
        shootingStar.material.opacity = 0.9 * Math.min(fadeIn, fadeOut)
        shootingStar.geometry.attributes.position.needsUpdate = true

        if (progress >= 1) {
          shootingStar.active = false
          shootingStar.line.visible = false
          shootingStar.material.opacity = 0
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('wheel', handleWheel)
      resizeObserver.disconnect()

      globeGeometry.dispose()
      globeMaterial.dispose()
      outlineGeometry.dispose()
      outlineMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
      for (const shootingStar of shootingStars) {
        shootingStar.geometry.dispose()
        shootingStar.material.dispose()
      }
      globeTexture.dispose()

      if (rendererRef.current) {
        rendererRef.current.dispose()
        container.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()

    async function loadCountryGeometry(): Promise<void> {
      try {
        const response = await fetch(GEOJSON_URL, { signal: abortController.signal })
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${GEOJSON_URL}`)
        }

        const data = (await response.json()) as WorldGeoJson
        const baseCanvas = createTextureCanvas()
        drawBaseMap(baseCanvas, data.features)
        baseTextureCanvasRef.current = baseCanvas

        const featuresByIso = new Map<string, WorldFeature[]>()
        for (const feature of data.features) {
          const isoCode = normalizeIsoCode(feature.properties['ISO3166-1-Alpha-2'])
          if (!isoCode) continue
          const existing = featuresByIso.get(isoCode) ?? []
          existing.push(feature)
          featuresByIso.set(isoCode, existing)
        }
        featuresByIsoRef.current = featuresByIso

        const textureCanvas = textureCanvasRef.current
        const texture = globeTextureRef.current
        if (!textureCanvas || !texture) return

        redrawGuessTexture({
          baseCanvas,
          textureCanvas,
          texture,
          featuresByIso,
          guesses: guessesRef.current,
        })
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('[Globe3D] No se pudieron cargar las fronteras del mapa.', error)
        }
      }
    }

    void loadCountryGeometry()

    return () => {
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    guessesRef.current = guesses

    const baseCanvas = baseTextureCanvasRef.current
    const textureCanvas = textureCanvasRef.current
    const texture = globeTextureRef.current
    if (!baseCanvas || !textureCanvas || !texture) return

    redrawGuessTexture({
      baseCanvas,
      textureCanvas,
      texture,
      featuresByIso: featuresByIsoRef.current,
      guesses,
    })
  }, [guesses])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        aria-label="Globo interactivo 3D"
      />

      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 12px',
          borderRadius: 8,
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        {LEGEND_ITEMS.map(item => {
          const label =
            language === 'en'
              ? item.labels.en
              : item.labels.es
          return (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'JetBrains Mono, monospace' }}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
