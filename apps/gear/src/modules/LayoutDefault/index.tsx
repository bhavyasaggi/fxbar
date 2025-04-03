import { AppShell, Box, Burger, Group } from '@mantine/core'
import { useDisclosure, useHotkeys } from '@mantine/hooks'
import React from 'react'

import Image from '@/components/Image'
import IMAGE_LOGO from '@/images/logo.png'

import LayoutDefaultFooter from './Footer'
import LayoutDefaultHeader from './Header'
import LayoutDefaultNavbar from './Navbar'

export default function LayoutDefault({
  children,
}: {
  readonly children?: React.ReactNode | undefined
}) {
  const [mobileOpened, { toggle: toggleMobile, open: openMobile }] =
    useDisclosure()

  useHotkeys([
    [
      'ctrl+K',
      () => {
        openMobile()
      },
    ],
  ])

  return (
    <AppShell
      header={{ height: 60 }}
      // padding='xs'
      navbar={{
        breakpoint: 'md',
        collapsed: {
          desktop: false,
          mobile: !mobileOpened,
        },
        width: 300,
      }}
    >
      <AppShell.Header>
        <Group gap='sm' h='100%' px='xs'>
          <Group gap='xs' mr='auto'>
            <Burger
              hiddenFrom='md'
              opened={mobileOpened}
              onClick={toggleMobile}
            />
            <Image alt='logo' height={32} src={IMAGE_LOGO} width={32} />
          </Group>
          <LayoutDefaultHeader />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <LayoutDefaultNavbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box mih='calc(100vh - 200px)' style={{ overflow: 'hidden auto' }}>
          {children}
        </Box>
        <LayoutDefaultFooter />
      </AppShell.Main>
    </AppShell>
  )
}
