import { useEffect, useReducer } from 'react'

type NetworkType = 'online' | 'offline' | 'uninitialized'

type NetworkStateType = {
  network: NetworkType
  cameOnline: boolean
  wentOffline: boolean
}

const networkReducer = (
  previous: NetworkStateType,
  next: NetworkType
): NetworkStateType => {
  return {
    ...previous,
    cameOnline: previous.network === 'offline' && next === 'online',
    network: next,
    wentOffline: previous.network === 'online' && next === 'offline',
  }
}

export function useNetworkState(): NetworkStateType {
  const [networkState, setNetworkState] = useReducer(networkReducer, {
    cameOnline: false,
    network: 'uninitialized',
    wentOffline: false,
  })

  useEffect(() => {
    // Initialize network state
    if (globalThis.window !== undefined) {
      setNetworkState(globalThis.navigator.onLine ? 'online' : 'offline')
    }

    const handleOnline = () => {
      setNetworkState('online')
    }
    const handleOffline = () => {
      setNetworkState('offline')
    }

    globalThis.addEventListener('online', handleOnline)
    globalThis.addEventListener('offline', handleOffline)

    return () => {
      globalThis.removeEventListener('online', handleOnline)
      globalThis.removeEventListener('offline', handleOffline)
    }
  }, [])

  return networkState
}
