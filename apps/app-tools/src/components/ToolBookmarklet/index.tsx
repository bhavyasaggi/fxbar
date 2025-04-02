import { ActionIcon, Paper, Textarea, TextInput } from '@mantine/core'
import { useClipboard, useDebouncedValue } from '@mantine/hooks'
import React, { useState } from 'react'
import { minify_sync, type MinifyOptions } from 'terser'

import Icon from '@/components/Icon'

// import { useTerser, type MinifyOptions } from '@/hooks/use-terser'

const MINIFY_OPTIONS: MinifyOptions = {
  module: true,
  safari10: true,
}

function Bookmarklet(props: {
  readonly loading: boolean
  readonly sourceCode: string
}) {
  const { copy, copied } = useClipboard()

  let sourceCodeMinified: string | undefined
  if (props.sourceCode) {
    try {
      const minified = minify_sync(props.sourceCode, MINIFY_OPTIONS)
      sourceCodeMinified = minified?.code || undefined
    } catch {
      sourceCodeMinified = undefined
    }
  }
  const bookmarklet = `javascript:(function(){${sourceCodeMinified || ''}})();`

  let copyColor = 'gray'
  if (props.sourceCode && sourceCodeMinified === null) {
    copyColor = 'red'
  } else if (copied) {
    copyColor = 'green'
  }

  return (
    <TextInput
      readOnly
      value={bookmarklet}
      variant='filled'
      rightSection={
        <ActionIcon
          color={copyColor}
          disabled={props.loading || copyColor === 'red'}
          variant='light'
          onClick={() => copy(bookmarklet)}
        >
          <Icon name={props.loading ? 'loader' : 'copy'} size={14} />
        </ActionIcon>
      }
    />
  )
}

export default function ToolBookmarklet() {
  const [sourceCode, setSourceCode] = useState<string>('')
  const [sourceCodeDebounced] = useDebouncedValue(sourceCode, 1000)

  return (
    <Paper withBorder my='xs' p='xs' shadow='md'>
      <Bookmarklet
        loading={sourceCode !== sourceCodeDebounced}
        sourceCode={sourceCodeDebounced}
      />
      <Textarea
        autosize
        minRows={8}
        mt='xs'
        value={sourceCode}
        onChange={(event) => setSourceCode(event.target.value)}
      />
    </Paper>
  )
}
