import { Container, Skeleton, Stack, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const ToolPreviewMBox = dynamic(() => import('@/components/ToolPreviewMBox'), {
  loading: () => (
    <Stack gap='xs'>
      <Skeleton height={130} />
      <Skeleton height={36} />
      <Skeleton height={36} />
      <Skeleton height={300} />
    </Stack>
  ),
  ssr: false,
})

export default function RoutePreviewMBox() {
  return (
    <React.Fragment>
      <Head>
        <title>Preview MBox</title>
      </Head>
      <Container size='lg'>
        <Title mt='xl' mx='auto' order={1} ta='center'>
          Preview MBox in Browser
        </Title>
        <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
          Quick preview of a MBox file (exported from mail client) in browser.
        </Text>
        <ToolPreviewMBox />
      </Container>
    </React.Fragment>
  )
}
