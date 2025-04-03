import { BrowserMBox, BrowserMBoxEvent } from '@fxbar/browser-mbox'
import { startTransition, useEffect, useRef, useState } from 'react'

export function useBrowserMBoxRef() {
  const ref = useRef<BrowserMBox | undefined>(undefined)
  const [isUninitialized, setIsUninitialized] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      ref.current = new BrowserMBox()
      setIsUninitialized(false)
    }
  }, [])

  useEffect(() => {
    const currentRef = ref.current
    const progressListener = (event: CustomEvent<number>) => {
      startTransition(() => {
        setIsReady(event.detail > 10)
      })
    }
    currentRef?.addEventListener(BrowserMBoxEvent.PROGRESS, progressListener)
    return () => {
      currentRef?.removeEventListener(
        BrowserMBoxEvent.PROGRESS,
        progressListener
      )
    }
  }, [])

  return { isReady, isUninitialized, ref }
}
