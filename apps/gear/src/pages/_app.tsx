import '@mantine/core/styles.css'
import '@mantine/nprogress/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'

import { generateColors } from '@mantine/colors-generator'
import { createTheme, MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import Head from 'next/head'
import React, { useEffect } from 'react'

import { useDynamicFavicon } from '@/hooks/use-dynamic-favicon'
import LayoutDefault from '@/modules/LayoutDefault'
import ProviderInstrumentation from '@/modules/ProviderInstrumentation'

import type { AppProps } from 'next/app'

const theme = createTheme({
  /** Put your mantine theme override here */
  colors: {
    primary: generateColors('#da2f47'),
  },
  cursorType: 'pointer',
  primaryColor: 'primary',
})

export default function App({ router, Component, pageProps }: AppProps) {
  const routerEvents = router.events
  useEffect(() => {
    const handleRouteChangeStart = () => nprogress.start()
    const handleRouteChangeComplete = () => nprogress.complete()
    const handleRouteChangeReset = () => nprogress.reset()
    routerEvents.on('routeChangeStart', handleRouteChangeStart)
    routerEvents.on('routeChangeComplete', handleRouteChangeComplete)
    routerEvents.on('routeChangeError', handleRouteChangeReset)
    return () => {
      routerEvents.off('routeChangeStart', handleRouteChangeStart)
      routerEvents.off('routeChangeComplete', handleRouteChangeComplete)
      routerEvents.off('routeChangeError', handleRouteChangeReset)
    }
  }, [routerEvents])

  const favicon = useDynamicFavicon({
    default: '/favicon.ico',
  })

  return (
    <React.Fragment>
      <Head>
        <link href={favicon} rel='icon' />
        <ColorSchemeScript />
      </Head>
      <ProviderInstrumentation>
        <MantineProvider theme={theme}>
          <NavigationProgress />
          <LayoutDefault>
            <Component {...pageProps} />
          </LayoutDefault>
          <Notifications />
        </MantineProvider>
      </ProviderInstrumentation>
    </React.Fragment>
  )
}
