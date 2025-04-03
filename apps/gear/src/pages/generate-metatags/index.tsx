import { Skeleton, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const ToolMetaTags = dynamic(() => import('@/components/ToolMetaTags'), {
  loading: () => <Skeleton height={400} />,
  ssr: false,
})

export default function RouteMetaTags() {
  return (
    <React.Fragment>
      <Head>
        <title>Generate Meta tags</title>
      </Head>
      <Title mt='xl' mx='auto' order={1} ta='center'>
        Generate Meta tags for Websites
      </Title>
      <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
        Generate HTML tags used to provide additional information about a page
        to search engines and other clients.
      </Text>
      <ToolMetaTags />
    </React.Fragment>
  )
}
