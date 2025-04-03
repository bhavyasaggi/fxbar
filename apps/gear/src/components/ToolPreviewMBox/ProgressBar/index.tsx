import { BrowserMBoxEvent, type BrowserMBox } from '@fxbar/browser-mbox'
import { Progress } from '@mantine/core'
import React, { startTransition, useEffect, useState } from 'react'

export default function ProgressBar({
  mboxRef,
  error,
}: {
  readonly mboxRef?: React.RefObject<BrowserMBox | undefined>
  readonly error?: string
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const currentMboxRef = mboxRef?.current
    const progressListener = (event: CustomEvent<number>) => {
      startTransition(() => {
        setProgress(event.detail)
      })
    }
    currentMboxRef?.addEventListener(
      BrowserMBoxEvent.PROGRESS,
      progressListener
    )
    return () => {
      currentMboxRef?.removeEventListener(
        BrowserMBoxEvent.PROGRESS,
        progressListener
      )
    }
  }, [mboxRef])

  const progressColor = error ? 'red' : undefined
  let progressLabel = progress === 100 ? 'Completed' : `${progress}%`
  if (error) {
    progressLabel = error
  }

  return (
    <Progress.Root flex='1 1 auto' size={36}>
      <Progress.Section color={progressColor} value={error ? 100 : progress}>
        <Progress.Label>{progressLabel}</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  )
}
