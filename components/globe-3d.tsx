'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useLanguage } from '@/hooks/use-language'

interface Globe3DProps {
  guesses: Array<{
    country: {
      id: string
      name: string
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

const PROXIMITY_COLORS = {
  lejos: '#1E6091',
  medio: '#2D6A4F',
  cerca: '#C9A84C',
  muyCerca: '#FF6B35',
  correcto: '#4CAF50',
} as const

function getProximityMarkerColor(proximityPct: number): string {
  if (proximityPct >= 100) return PROXIMITY_COLORS.correcto
  if (proximityPct >= 50) return PROXIMITY_COLORS.cerca
  if (proximityPct >= 25) return PROXIMITY_COLORS.muyCerca
  if (proximityPct >= 10) return PROXIMITY_COLORS.medio
  return PROXIMITY_COLORS.lejos
}

function latLngToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

export default function Globe3D({ guesses, onCountryClick }: Globe3DProps) {
  const { language } = useLanguage()
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const markersRef = useRef<THREE.Group | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const animationIdRef = useRef<number | null>(null)
  
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })

  const initGlobe = useCallback(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    if (width === 0 || height === 0) {
      console.warn('Globe container has no dimensions')
      return
    }

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0A0E1A')
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 3.5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Globe geometry
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64)
    const textureLoader = new THREE.TextureLoader()
    const globeTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: globeTexture,
      bumpScale: 0.05,
      specular: new THREE.Color('grey'),
      shininess: 10
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)
    globeRef.current = globe

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Starfield
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = []
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 200
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      starPositions.push(x, y, z)
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3 })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
    starsRef.current = stars

    // Markers group
    const markersGroup = new THREE.Group()
    scene.add(markersGroup)
    markersRef.current = markersGroup

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      isDragging.current = true
      previousMousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.current || !globeRef.current) return
      
      const deltaX = event.clientX - previousMousePosition.current.x
      const deltaY = event.clientY - previousMousePosition.current.y
      
      globeRef.current.rotation.y += deltaX * 0.01
      globeRef.current.rotation.x += deltaY * 0.01
      
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

    // Resize observer
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

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (globeRef.current && !isDragging.current) {
        globeRef.current.rotation.y += 0.001
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('wheel', handleWheel)
      resizeObserver.disconnect()
      
      if (rendererRef.current) {
        rendererRef.current.dispose()
        container.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  // Update markers when guesses change
  useEffect(() => {
    if (!markersRef.current) return

    // Clear existing markers
    while (markersRef.current.children.length > 0) {
      const child = markersRef.current.children[0]
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
      markersRef.current.remove(child)
    }

    // Add new markers
    guesses.forEach(guess => {
      const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16)
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: getProximityMarkerColor(guess.proximityPct)
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      
      const position = latLngToVector3(guess.country.lat, guess.country.lng, 1.02)
      marker.position.copy(position)
      
      if (markersRef.current) {
        markersRef.current.add(marker)
      }
    })
  }, [guesses])

  useEffect(() => {
    const cleanup = initGlobe()
    return cleanup
  }, [initGlobe])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#0A0E1A',
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
          background: 'rgba(13, 27, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(27,58,75,0.6)',
        }}
      >
        {[
          { color: '#1E6091', key: 'far' },
          { color: '#2D6A4F', key: 'medium' },
          { color: '#C9A84C', key: 'close' },
          { color: '#FF6B35', key: 'veryClose' },
          { color: '#4CAF50', key: 'correct' },
        ].map(item => {
          const labels = {
            es: { far: 'Lejos', medium: 'Medio', close: 'Cerca', veryClose: 'Muy cerca', correct: 'Correcto' },
            en: { far: 'Far', medium: 'Medium', close: 'Close', veryClose: 'Very close', correct: 'Correct' }
          }
          const label = labels[language as 'es' | 'en'][item.key as keyof typeof labels.es]
          return (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#8BA4B0', fontFamily: 'JetBrains Mono, monospace' }}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
