import { Skeleton, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const ToolPreviewMBox = dynamic(() => import('@/components/ToolPreviewMBox'), {
  loading: () => <Skeleton height={374} my='xs' width='100%' />,
  ssr: false,
})

export default function RoutePreviewMBox() {
  return (
    <React.Fragment>
      <Head>
        <title>Preview MBox</title>
      </Head>
      <Title mt='xl' mx='auto' order={1} ta='center'>
        Preview MBox in Browser
      </Title>
      <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
        Preview MBox (exported from mail client) in Browser
      </Text>
      <ToolPreviewMBox />
    </React.Fragment>
  )
}
