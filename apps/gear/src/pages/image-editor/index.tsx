import { Text, Title } from '@mantine/core'
import Head from 'next/head'
import React from 'react'

import ToolImageEditor from '@/components/ToolImageEditor'

export default function RouteImageEditor() {
  return (
    <React.Fragment>
      <Head>
        <title>Image Editor</title>
      </Head>
      <Title mt='xl' mx='auto' order={1} ta='center'>
        Edit, Resize, and Filter any images.
      </Title>
      <Text c='dimmed' maw={800} mb='xl' mt='sm' mx='auto' ta='center'>
        Resize, crop, rotate, and add various filters to any image - all from
        within the browser!
      </Text>
      <ToolImageEditor />
    </React.Fragment>
  )
}
