import { Group, Paper } from '@mantine/core'
import React from 'react'

import ToolMetaTagsDisplay from './Display'
import ToolMetaTagsForm from './Form'
import { MetaTagsContextProvider } from './use-context'

export default function ToolMetaTags() {
  return (
    <MetaTagsContextProvider>
      <Group grow align='stretch'>
        <Paper withBorder p='xs'>
          <ToolMetaTagsForm />
        </Paper>
        <Paper withBorder p='xs'>
          <ToolMetaTagsDisplay />
        </Paper>
      </Group>
    </MetaTagsContextProvider>
  )
}
