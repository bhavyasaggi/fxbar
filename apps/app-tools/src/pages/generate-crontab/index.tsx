import { Box, Skeleton, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const ToolCrontab = dynamic(() => import('@/components/ToolCrontab'), {
  loading: () => (
    <Box m='xs'>
      <Skeleton height={330} width='100%' />
    </Box>
  ),
  ssr: false,
})

export default function RouteGenerateCrontab() {
  return (
    <React.Fragment>
      <Head>
        <title>Crontab Generator</title>
      </Head>
      <Title mt='xl' mx='auto' order={1} ta='center'>
        Crontab Generator
      </Title>
      <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
        Crontab is a tool that allows you to schedule tasks to run at specific
        intervals.
      </Text>
      <ToolCrontab />
    </React.Fragment>
  )
}
