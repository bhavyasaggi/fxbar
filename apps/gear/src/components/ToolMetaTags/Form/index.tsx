import {
  ColorInput,
  Select,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
  Tabs,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

import { useMetaTagsSet } from '../use-context'

import type { MetaTagsType } from '../types'

export default function ToolMetaTagsForm() {
  const setMetaTags = useMetaTagsSet()

  const form = useForm<MetaTagsType>({
    initialValues: {
      atomFeed: '',
      author: '',
      authorUrl: '',
      cacheControl: '',
      canonical: '',
      copyright: '',
      description: '',
      expires: '',
      googleSiteVerification: '',
      icon: '',
      image: '',
      language: 'en',
      name: '',
      pragma: '',
      publisherUrl: '',
      refresh: '',
      revised: '',
      revisitAfter: '',
      robots: '',
      rssFeed: '',
      summary: '',
      tags: [],
      themeColor: '',
      title: '',
    },
    mode: 'uncontrolled',
    onValuesChange: setMetaTags,
  })

  return (
    <Tabs defaultValue='general'>
      <Tabs.List grow>
        <Tabs.Tab value='general'>General</Tabs.Tab>
        <Tabs.Tab value='view'>View</Tabs.Tab>
        <Tabs.Tab value='author'>Author</Tabs.Tab>
        <Tabs.Tab value='robots'>Search Engines</Tabs.Tab>
        <Tabs.Tab value='advanced'>Advanced</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='general'>
        <Stack gap='xs' py='xs'>
          <TextInput
            description='The name of the website'
            label='Name'
            placeholder='Website name'
            {...form.getInputProps('name')}
          />
          <TextInput
            description='The canonical URL of the page'
            label='URL'
            placeholder='Canonical URL'
            {...form.getInputProps('canonical')}
          />
          <TextInput
            description='The URL of the icon for the page'
            label='Icon (favicon)'
            placeholder='Icon URL'
            {...form.getInputProps('icon')}
          />
          <TagsInput
            description='Press enter to add a keyword'
            label='Keywords'
            {...form.getInputProps('tags')}
          />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value='view'>
        <Stack gap='xs' py='xs'>
          <TextInput
            description='Webpage title'
            label='Title'
            placeholder='Webpage title'
            {...form.getInputProps('title')}
          />
          <Textarea
            label='Description'
            placeholder='Webpage description (preferably 155 characters or less)'
            {...form.getInputProps('description')}
          />
          <TextInput
            description='The URL of the image for the page'
            label='Image'
            placeholder='Image URL'
            {...form.getInputProps('image')}
          />
          <ColorInput
            description='The color of the theme of the page'
            label='Theme Color'
            placeholder='Theme color'
            {...form.getInputProps('themeColor')}
          />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value='author'>
        <Stack gap='xs' py='xs'>
          <TextInput
            description='The name of the author of the page'
            label='Author'
            placeholder='Author name'
            {...form.getInputProps('author')}
          />
          <TextInput
            description='A short summary of the page'
            label='Summary'
            placeholder='Summary'
            {...form.getInputProps('summary')}
          />
          <TextInput
            description='The copyright information for the page'
            label='Copyright'
            placeholder='Copyright'
            {...form.getInputProps('copyright')}
          />
          <TextInput
            description='The date and time the page was last revised'
            label='Revised'
            placeholder='Revised'
            {...form.getInputProps('revised')}
          />
          <TextInput
            label='Author URL'
            placeholder='Author URL'
            {...form.getInputProps('authorUrl')}
          />
          <TextInput
            description='The URL of the publisher'
            label='Publisher URL'
            placeholder='Publisher URL'
            {...form.getInputProps('publisherUrl')}
          />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value='robots'>
        <Stack gap='xs' py='xs'>
          <TextInput
            label='Language'
            placeholder='Language code'
            {...form.getInputProps('language')}
          />
          <TextInput
            label='RSS Feed'
            placeholder='RSS Feed URL'
            {...form.getInputProps('rssFeed')}
          />
          <TextInput
            label='Atom Feed'
            placeholder='Atom Feed URL'
            {...form.getInputProps('atomFeed')}
          />
          <Select
            label='Robots'
            placeholder='Robots'
            {...form.getInputProps('robots')}
            data={[
              { label: 'Index, but not Follow', value: 'index, follow' },
              { label: 'No Index, but Follow', value: 'noindex, follow' },
              { label: 'No Index, No Follow', value: 'noindex, nofollow' },
              { label: 'Index, No Follow', value: 'index, nofollow' },
            ]}
          />
          <TextInput
            description='The Google Site Verification code'
            label='Google Site Verification'
            placeholder='Google Site Verification'
            {...form.getInputProps('googleSiteVerification')}
          />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value='advanced'>
        <Stack gap='xs' py='xs'>
          <TextInput
            description='The date and time after which the page should be considered stale'
            label='Pragma'
            placeholder='Pragma'
            {...form.getInputProps('pragma')}
          />
          <TextInput
            description='The amount of time the page should be cached'
            label='Cache Control'
            placeholder='Cache Control'
            {...form.getInputProps('cacheControl')}
          />
          <TextInput
            description='The date and time after which the page should be considered stale'
            label='Expires'
            placeholder='Expires'
            {...form.getInputProps('expires')}
          />
          <TextInput
            description='Refresh the page after a certain amount of time'
            label='Refresh'
            placeholder='Refresh'
            {...form.getInputProps('refresh')}
          />
        </Stack>
      </Tabs.Panel>
    </Tabs>
  )
}
