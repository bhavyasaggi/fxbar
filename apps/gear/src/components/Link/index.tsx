import { Anchor, type AnchorProps } from '@mantine/core'
import LinkNext from 'next/link'
import React from 'react'

export default function Link(
  props: React.ComponentProps<typeof LinkNext> & AnchorProps
) {
  return <Anchor component={LinkNext} {...props} />
}
