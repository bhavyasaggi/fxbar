import { Group, Button, Divider, Code } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import React, { useRef } from 'react'

import Icon from '@/components/Icon'

import { useMetaTagsValue } from '../use-context'

export default function ToolMetaTagsDisplay() {
  const valueMetaTags = useMetaTagsValue()

  const codeRef = useRef<HTMLElement>(null)
  const { copy, copied, error: copiedError } = useClipboard()
  let copyColor
  if (copied) {
    copyColor = 'green'
  } else if (copiedError) {
    copyColor = 'red'
  }

  const handleCopy = () => {
    if (codeRef.current && globalThis.window !== undefined) {
      globalThis?.getSelection()?.selectAllChildren(codeRef.current)
    }
    copy(valueMetaTags)
  }

  return (
    <React.Fragment>
      <Group justify='flex-end'>
        <Button
          color={copyColor}
          leftSection={<Icon name={copied ? 'check' : 'copy'} />}
          variant='outline'
          onClick={handleCopy}
        >
          {`${copied ? 'Copied' : 'Copy'} to clipboard`}
        </Button>
      </Group>
      <Divider my='xs' />
      <Code ref={codeRef} block style={{ whiteSpace: 'pre-wrap' }}>
        {valueMetaTags || ''}
      </Code>
    </React.Fragment>
  )
}
