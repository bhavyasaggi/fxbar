import { useNetworkState } from '@lib/react/use-network-state'
import { useDocumentVisibility, useIdle } from '@mantine/hooks'
import Router from 'next/router'
import { useState, useEffect } from 'react'

const getEmojiFavicon = (emoji: string) => {
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='80'>${
    emoji || '⚙️'
  }</text></svg>`
}

export interface UseDynamicFaviconProps {
  default: string
  idle?: string | undefined
  online?: string | undefined
  offline?: string | undefined
}

export function useDynamicFavicon({
  default: defaultFavicon,
}: UseDynamicFaviconProps) {
  const { network } = useNetworkState()
  const idle = useIdle(10_000)
  const visible = useDocumentVisibility()
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setNavigating(true))
    Router.events.on('routeChangeComplete', () => setNavigating(false))
    Router.events.on('routeChangeError', () => setNavigating(false))
    return () => {
      Router.events.off('routeChangeStart', () => setNavigating(true))
      Router.events.off('routeChangeComplete', () => setNavigating(false))
      Router.events.off('routeChangeError', () => setNavigating(false))
    }
  }, [])

  let favicon = defaultFavicon
  if (network === 'offline') {
    favicon = getEmojiFavicon('✈️')
  } else if (navigating) {
    favicon = getEmojiFavicon('💨')
  } else if (visible === 'hidden') {
    favicon = getEmojiFavicon('👀')
  } else if (idle) {
    favicon = getEmojiFavicon('💤')
  }

  return favicon
}
