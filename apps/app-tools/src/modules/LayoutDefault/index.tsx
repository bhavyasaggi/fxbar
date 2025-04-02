import { AppShell, Burger, Container, Group } from '@mantine/core'
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
  const [desktopOpened, { toggle: toggleDesktop, open: openDesktop }] =
    useDisclosure(true)

  useHotkeys([
    [
      'ctrl+K',
      () => {
        openMobile()
        openDesktop()
      },
    ],
  ])

  return (
    <AppShell
      header={{ height: 60 }}
      padding='xs'
      navbar={{
        breakpoint: 'sm',
        collapsed: {
          desktop: !desktopOpened,
          mobile: !mobileOpened,
        },
        width: 300,
      }}
    >
      <AppShell.Header>
        <Group gap='sm' h='100%' px='xs'>
          <Group gap='xs' mr='auto'>
            <Burger
              hiddenFrom='sm'
              opened={mobileOpened}
              onClick={toggleMobile}
            />
            <Burger
              opened={desktopOpened}
              visibleFrom='sm'
              onClick={toggleDesktop}
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
        <Container
          mih='calc(100vh - 260px)'
          size='lg'
          style={{ overflow: 'hidden auto' }}
        >
          {children}
        </Container>
        <LayoutDefaultFooter />
      </AppShell.Main>
    </AppShell>
  )
}
