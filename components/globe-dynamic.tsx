'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const Globe3D = dynamic(() => import('./globe-3d'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0A0E1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '2px solid rgba(0,212,255,0.3)',
            borderTopColor: '#00D4FF',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8BA4B0', fontSize: 14 }}>
          Cargando globo...
        </span>
      </div>
    </div>
  ),
})

type Globe3DProps = ComponentProps<typeof Globe3D>

export default function GlobeDynamic(props: Globe3DProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <Globe3D {...props} />
    </div>
  )
}