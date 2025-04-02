import { Skeleton, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const ToolCodeEditor = dynamic(() => import('@/components/ToolCodeEditor'), {
  loading: () => <Skeleton height={374} my='xs' width='100%' />,
  ssr: false,
})

export default function RouteCodeEditor() {
  return (
    <React.Fragment>
      <Head>
        <title>Live Code Editor</title>
      </Head>
      <Title mt='xl' mx='auto' order={1} ta='center'>
        Live coding in the browser.
      </Title>
      <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
        Run any JavaScript and Node.js app in any browser.
      </Text>
      <ToolCodeEditor />
    </React.Fragment>
  )
}
