import dynamic from 'next/dynamic'
import React from 'react'

const LayoutDefaultThemeSwitch = dynamic(
  () => import('@/components/ThemeSwitch'),
  {
    ssr: false,
  }
)

export default function LayoutDefaultHeader() {
  return <LayoutDefaultThemeSwitch />
}
