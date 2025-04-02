import { Progress } from '@mantine/core'
import React from 'react'

export default function ProgressBar(props: {
  readonly progress: number
  readonly error: string
}) {
  const progressColor = props.error ? 'red' : undefined
  let progressLabel =
    props.progress === 100 ? 'Completed' : `${props.progress}%`
  if (props.error) {
    progressLabel = props.error
  }
  return (
    <Progress.Root flex='1 1 auto' size={36}>
      <Progress.Section
        color={progressColor}
        value={props.error ? 100 : props.progress}
      >
        <Progress.Label>{progressLabel}</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  )
}
