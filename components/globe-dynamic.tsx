'use client'

import dynamic from 'next/dynamic'

const Globe3D = dynamic(() => import('./globe-3d'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#0A0E1A' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
          style={{ borderTopColor: '#00D4FF' }}
        />
        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Cargando globo...
        </span>
      </div>
    </div>
  ),
})

export default Globe3D
