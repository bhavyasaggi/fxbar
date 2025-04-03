import {
  AppShell,
  TextInput,
  Code,
  ScrollArea,
  Divider,
  InputClearButton,
  Skeleton,
  NavLink,
  Box,
  Loader,
  Collapse,
  Center,
} from '@mantine/core'
import { useDebouncedValue, useFocusWithin, useHotkeys } from '@mantine/hooks'
import dynamic from 'next/dynamic'
import LinkNext from 'next/link'
import React, { useState } from 'react'

import Icon from '@/components/Icon'

const LayoutDefaultNavbarLinks = dynamic(() => import('../NavbarLinks'), {
  loading: () => (
    <Box mx='xs'>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} height={50} mb='xs' />
      ))}
    </Box>
  ),
  ssr: false,
})
const LayoutDefaultNavbarStatus = dynamic(() => import('../NavbarStatus'), {
  ssr: false,
})

export default function LayoutDefaultNavbar() {
  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebouncedValue(search, 600)

  const { ref, focused } = useFocusWithin<HTMLInputElement>({
    onFocus: () => {
      ref.current.select()
    },
  })
  useHotkeys([
    [
      'ctrl+K',
      () => {
        if (ref.current) {
          ref.current.focus()
        }
      },
    ],
  ])

  return (
    <React.Fragment>
      <AppShell.Section m='xs'>
        <TextInput
          ref={ref}
          leftSection={<Icon name='search' size={12} />}
          placeholder='Search'
          rightSectionWidth={focused || search ? undefined : 70}
          size='xs'
          value={search}
          rightSection={
            focused || search ? (
              <InputClearButton onClick={() => setSearch('')} />
            ) : (
              <Code
                style={{
                  backgroundColor:
                    'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))',
                  border:
                    '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))',
                  fontSize: '10px',
                  fontWeight: '700',
                }}
              >
                Ctrl + K
              </Code>
            )
          }
          onChange={(event) => setSearch(event.target.value)}
        />
      </AppShell.Section>
      <AppShell.Section
        grow
        component={ScrollArea}
        overscrollBehavior='none'
        scrollbars='y'
      >
        <Collapse in={search !== searchDebounced}>
          <Center>
            <Loader color='gray' size='xs' type='dots' />
          </Center>
        </Collapse>
        <LayoutDefaultNavbarLinks filterLabel={searchDebounced} />
      </AppShell.Section>
      <AppShell.Section>
        <LayoutDefaultNavbarStatus />
      </AppShell.Section>
      <Divider />
      <AppShell.Section>
        <NavLink
          component={LinkNext}
          description='Easy-to-use PDF tools'
          href='https://pdfvise.com'
          label='PDFvise.com'
          leftSection={<Icon name='cloud' />}
          rightSection={<Icon name='external-link' size={14} />}
          target='_blank'
        />
      </AppShell.Section>
    </React.Fragment>
  )
}
