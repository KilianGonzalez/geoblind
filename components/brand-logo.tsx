'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BrandLogoProps {
  href?: string
  size?: number
  showText?: boolean
  className?: string
}

export default function BrandLogo({
  href = '/',
  size = 36,
  showText = true,
  className = '',
}: BrandLogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      <Image src="/geoblind-logo.svg" alt="GeoBlind" width={size} height={size} priority />
      {showText && (
        <span className="text-xl font-black tracking-tight text-foreground">
          Geo<span className="text-primary">Blind</span>
        </span>
      )}
    </Link>
  )
}
