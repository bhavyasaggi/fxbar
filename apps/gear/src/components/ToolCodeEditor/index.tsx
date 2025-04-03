import {
  Sandpack,
  type SandpackPredefinedTemplate,
} from '@codesandbox/sandpack-react'
import {
  ActionIcon,
  Flex,
  Paper,
  Select,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import React, { useState } from 'react'

import Icon from '../Icon'

const OPTIONS_TEMPLATES: Array<{
  label: string
  value: SandpackPredefinedTemplate
}> = [
  { label: 'Static', value: 'static' },
  { label: 'Angular', value: 'angular' },
  { label: 'React', value: 'react' },
  { label: 'React (Typescript)', value: 'react-ts' },
  { label: 'Solid', value: 'solid' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Vanilla (Typescript)', value: 'vanilla-ts' },
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Vue', value: 'vue' },
  { label: 'Vue (Typescript)', value: 'vue-ts' },
  { label: 'Node', value: 'node' },
  { label: 'Nextjs', value: 'nextjs' },
  { label: 'Vite', value: 'vite' },
  { label: 'Vite-React', value: 'vite-react' },
  { label: 'Vite-React (Typescript)', value: 'vite-react-ts' },
  { label: 'Vite-Preact', value: 'vite-preact' },
  { label: 'Vite-Preact (Typescript)', value: 'vite-preact-ts' },
  { label: 'Vite-Vue', value: 'vite-vue' },
  { label: 'Vite-Vue (Typescript)', value: 'vite-vue-ts' },
  { label: 'Vite-Svelte', value: 'vite-svelte' },
  { label: 'Vite-Svelte (Typescript)', value: 'vite-svelte-ts' },
  { label: 'Astro', value: 'astro' },
]

export default function ToolPreviewCode() {
  const { colorScheme } = useMantineColorScheme()
  const { ref, toggle, fullscreen } = useFullscreen()

  const [template, setTemplate] = useState<SandpackPredefinedTemplate>('node')

  return (
    <Paper ref={ref} withBorder my='xs' p='xs' shadow='md'>
      <Flex
        align='flex-end'
        gap='xs'
        justify='space-between'
        mb='xs'
        wrap='wrap'
      >
        <Select
          searchable
          allowDeselect={false}
          aria-label='Template'
          clearable={false}
          data={OPTIONS_TEMPLATES}
          value={template}
          onChange={(v) => setTemplate(v as SandpackPredefinedTemplate)}
        />
        <Tooltip label={fullscreen ? 'Exit Fullscreen' : 'Fullscreen mode'}>
          <ActionIcon color='gray' variant='outline' onClick={toggle}>
            <Icon name={fullscreen ? 'minimize-2' : 'maximize-2'} />
          </ActionIcon>
        </Tooltip>
      </Flex>
      <Sandpack
        // key={`${template}-${layout}`}
        template={template}
        theme={colorScheme}
        options={{
          autoReload: false,
          autorun: false,
          closableTabs: true,
          editorHeight: fullscreen ? 'calc(100vh - 100px)' : '300px',
          layout: 'preview',
          showConsole: true,
          showConsoleButton: true,
          showLineNumbers: true,
          showNavigator: true,
          showRefreshButton: true,
          showTabs: true,
        }}
      />
    </Paper>
  )
}
