import SPRITE_FEATHER from 'feather-icons/dist/feather-sprite.svg'
import React from 'react'

import type { FeatherIconNames } from 'feather-icons'

export interface IconProps {
  readonly name: FeatherIconNames
  /**
   * @default 18
   */
  readonly size?: number
  readonly stroke?: string
  readonly className?: string
  readonly style?: React.CSSProperties | undefined
}

export default function Icon({
  name,
  size,
  stroke,
  className,
  style,
}: IconProps) {
  if (!name) {
    return null
  }

  return (
    <svg
      className={className}
      fill='none'
      focusable='false'
      height={size || 18}
      stroke={stroke || 'currentColor'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      style={style}
      width={size || 18}
    >
      <use href={`${SPRITE_FEATHER}#${name}`} />
    </svg>
  )
}
