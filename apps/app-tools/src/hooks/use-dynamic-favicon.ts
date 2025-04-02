import { useDocumentVisibility, useIdle } from '@mantine/hooks'

import { useNetworkState } from './use-network-state'

export interface UseDynamicFaviconProps {
  default: string
  idle?: string | undefined
  online?: string | undefined
  offline?: string | undefined
}

export function useDynamicFavicon({
  default: defaultFavicon,
  idle: idleFavicon,
  online: onlineFavicon,
  offline: offlineFavicon,
}: UseDynamicFaviconProps) {
  const { network } = useNetworkState()
  const idle = useIdle(10_000)
  const visible = useDocumentVisibility()

  let favicon = defaultFavicon
  if (onlineFavicon && network === 'online') {
    favicon = onlineFavicon
  } else if (offlineFavicon && network === 'offline') {
    favicon = offlineFavicon
  } else if (idleFavicon && (idle || !visible)) {
    favicon = idleFavicon
  }

  return favicon
}
