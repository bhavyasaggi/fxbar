import { Box, Skeleton, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const ToolBookmarklet = dynamic(() => import('@/components/ToolBookmarklet'), {
  loading: () => (
    <Box m='xs'>
      <Skeleton height={330} width='100%' />
    </Box>
  ),
  ssr: false,
})

export default function RouteGenerateBookmarklet() {
  return (
    <React.Fragment>
      <Head>
        <title>Bookmarklet Generator</title>
      </Head>
      <Title mt='xl' mx='auto' order={1} ta='center'>
        Bookmarklet Generator
      </Title>
      <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
        Bookmarklet allows you run javascript code in browser via bookmark
        links.
      </Text>
      <ToolBookmarklet />
    </React.Fragment>
  )
}
