import { ActionIcon } from '@mantine/core'
import React from 'react'

import Icon from '@/components/Icon'

export default function Pagination<
  T extends { position: number; count: number },
>(props: {
  readonly disabled?: boolean
  readonly totalCount: number
  readonly value: T
  readonly onChange: (value: T) => void
  readonly children?: React.ReactNode
  readonly className?: string
  readonly style?: React.CSSProperties
}) {
  return (
    <ActionIcon.Group className={props.className} ms='auto' style={props.style}>
      {props.children ? (
        <ActionIcon.GroupSection color='gray' size='lg' variant='outline'>
          {props.children}
        </ActionIcon.GroupSection>
      ) : null}
      <ActionIcon
        color='gray'
        size='lg'
        variant='outline'
        disabled={
          props.disabled || props.value.position === 0 || !props.totalCount
        }
        onClick={() =>
          props.onChange({
            ...props.value,
            position: 0,
          })
        }
      >
        <Icon name='chevrons-left' />
      </ActionIcon>
      <ActionIcon
        color='gray'
        size='lg'
        variant='outline'
        disabled={
          props.disabled || props.value.position === 0 || !props.totalCount
        }
        onClick={() =>
          props.onChange({
            ...props.value,
            position: Math.max(0, props.value.position - props.value.count),
          })
        }
      >
        <Icon name='chevron-left' />
      </ActionIcon>
      <ActionIcon
        color='gray'
        size='lg'
        variant='outline'
        disabled={
          props.disabled ||
          props.value.position >= props.totalCount - props.value.count ||
          !props.totalCount
        }
        onClick={() =>
          props.onChange({
            ...props.value,
            position: Math.max(
              0,
              Math.min(
                props.totalCount - props.value.count,
                props.value.position + props.value.count
              )
            ),
          })
        }
      >
        <Icon name='chevron-right' />
      </ActionIcon>
      <ActionIcon
        color='gray'
        size='lg'
        variant='outline'
        disabled={
          props.disabled ||
          props.value.position >= props.totalCount - props.value.count ||
          !props.totalCount
        }
        onClick={() =>
          props.onChange({
            ...props.value,
            position: Math.max(0, props.totalCount - props.value.count),
          })
        }
      >
        <Icon name='chevrons-right' />
      </ActionIcon>
    </ActionIcon.Group>
  )
}
