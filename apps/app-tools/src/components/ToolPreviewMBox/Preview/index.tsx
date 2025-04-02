import {
  Box,
  Button,
  Code,
  Group,
  Modal,
  Pill,
  ScrollAreaAutosize,
  SegmentedControl,
  Table,
} from '@mantine/core'
import React, { useState } from 'react'

import Icon from '@/components/Icon'

import type { MBoxWebEmailParsedType } from '@fxbar/mbox-web'

function PreviewContent({
  data,
}: {
  readonly data?: MBoxWebEmailParsedType | null
}) {
  const [view, setView] = useState<'Raw' | 'Text' | 'HTML'>(() => {
    if (!data) {
      return 'Raw'
    }
    if (data.html) {
      return 'HTML'
    }
    if (data.text) {
      return 'Text'
    }
    return 'Raw'
  })
  if (!data) {
    return <PreviewContentEmpty />
  }
  return (
    <Box>
      <Table.ScrollContainer minWidth={300}>
        <Table withTableBorder variant='vertical'>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>From</Table.Th>
              <Table.Td>
                <PreviewContentAddress
                  data={data.from ? [data.from] : undefined}
                />
              </Table.Td>
            </Table.Tr>
            {data.replyTo?.length ? (
              <Table.Tr>
                <Table.Th>Reply To</Table.Th>
                <Table.Td>
                  <PreviewContentAddress data={data.replyTo} />
                </Table.Td>
              </Table.Tr>
            ) : null}
            {data.sender ? (
              <Table.Tr>
                <Table.Th>Sender</Table.Th>
                <Table.Td>
                  <PreviewContentAddress
                    data={data.sender ? [data.sender] : undefined}
                  />
                </Table.Td>
              </Table.Tr>
            ) : null}
            {data.to?.length ? (
              <Table.Tr>
                <Table.Th>To</Table.Th>
                <Table.Td>
                  <PreviewContentAddress data={data.to} />
                </Table.Td>
              </Table.Tr>
            ) : null}
            {data.cc?.length ? (
              <Table.Tr>
                <Table.Th>CC</Table.Th>
                <Table.Td>
                  <PreviewContentAddress data={data.cc} />
                </Table.Td>
              </Table.Tr>
            ) : null}
            {data.bcc?.length ? (
              <Table.Tr>
                <Table.Th>BCC</Table.Th>
                <Table.Td>
                  <PreviewContentAddress data={data.bcc} />
                </Table.Td>
              </Table.Tr>
            ) : null}
            <Table.Tr>
              <Table.Th>Subject</Table.Th>
              <Table.Td>{data.subject}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Td>
                <time dateTime={data.date}>
                  {data.date ? new Date(data.date).toLocaleString() : ''}
                </time>
              </Table.Td>
            </Table.Tr>
            {data.attachments?.length ? (
              <Table.Tr>
                <Table.Th>Attachments</Table.Th>
                <Table.Td>
                  <Group gap={2} wrap='wrap'>
                    {(data.attachments || []).map(
                      (attachment, attachmentIndex) => (
                        <PreviewContentAttachment
                          key={attachmentIndex}
                          data={attachment}
                        />
                      )
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ) : null}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <SegmentedControl
        my='xs'
        value={view}
        data={['Raw', data.text ? 'Text' : '', data.html ? 'HTML' : ''].filter(
          Boolean
        )}
        onChange={(v) => setView(v as typeof view)}
      />
      {view === 'Raw' || (!data.text && !data.html) ? (
        <PreviewContentRaw data={data.raw} />
      ) : null}
      {view === 'Text' && data.text ? (
        <PreviewContentText data={data.text} />
      ) : null}
      {view === 'HTML' && data.html ? (
        <PreviewContentHTML data={data.html} />
      ) : null}
    </Box>
  )
}

function PreviewContentRaw({ data }: { readonly data?: string }) {
  if (!data) {
    return null
  }
  return (
    <ScrollAreaAutosize>
      <Code block>{data}</Code>
    </ScrollAreaAutosize>
  )
}

function PreviewContentText({ data }: { readonly data?: string }) {
  if (!data) {
    return null
  }
  return (
    <ScrollAreaAutosize style={{ whiteSpace: 'pre-line' }}>
      <Box p='xs'>{data}</Box>
    </ScrollAreaAutosize>
  )
}

function PreviewContentHTML({ data }: { readonly data?: string }) {
  if (!data) {
    return null
  }
  return (
    <ScrollAreaAutosize>
      <Box dangerouslySetInnerHTML={{ __html: data }} p='xs' />
    </ScrollAreaAutosize>
  )
}

function PreviewContentAddress({
  data,
}: {
  readonly data?: MBoxWebEmailParsedType['from'][]
}) {
  const addressArray: string[] = (data || []).map((address) => {
    const addressString =
      `${address.name}${address.address ? ` <${address.address}>` : ''}`.trim()
    const groupString = (address.group || [])
      .map((group) =>
        `${group.name}${group.address ? ` <${group.address}>` : ''}`.trim()
      )
      .join(', ')
    return [addressString, groupString].filter(Boolean).join('; ')
  })

  if (addressArray.length === 0) {
    return null
  }

  return (
    <Pill.Group>
      {addressArray.map((address, addressIndex) => (
        <Pill key={addressIndex} title={address}>
          {address.length > 20 ? `${address.slice(0, 20)}...` : address}
        </Pill>
      ))}
    </Pill.Group>
  )
}

function PreviewContentAttachment<
  T extends MBoxWebEmailParsedType['attachments'][number],
>({ data }: { readonly data?: T | null | undefined }) {
  const filename = data?.filename || 'attachment.bin'

  const handleDownload = () => {
    if (!data) {
      return
    }
    const attachmentUrl = URL.createObjectURL(
      new Blob([data.content], { type: data.mimeType })
    )
    setTimeout(() => {
      URL.revokeObjectURL(attachmentUrl)
    }, 30 * 1000)
    //
    window.open(attachmentUrl, '_blank')
    // const link = document.createElement('a')
    // link.href = attachmentUrl
    // link.download = filename
    // link.click()
  }

  if (!data) {
    return null
  }

  return (
    <Button
      rightSection={<Icon name='download' size={12} />}
      size='compact-xs'
      title={data.description || data.filename || 'Attachment'}
      variant='light'
      onClick={handleDownload}
    >
      {filename.length > 10 ? `${filename.slice(0, 10)}...` : filename}
    </Button>
  )
}

function PreviewContentEmpty() {
  return 'Empty'
}

function PreviewContentLoading() {
  return 'Loading...'
}

function PreviewContentError() {
  return 'Error'
}

export default function Preview(props: {
  readonly opened: boolean
  readonly onClose: () => void
  readonly data?: MBoxWebEmailParsedType | null
  readonly isLoading: boolean
  readonly isError: boolean
}) {
  return (
    <Modal
      // lockScroll={false}
      // withOverlay={false}
      // withinPortal={false}
      keepMounted={false}
      opened={props.opened}
      size='xl'
      onClose={props.onClose}
    >
      {props.isLoading ? <PreviewContentLoading /> : null}
      {!props.isLoading && props.isError ? <PreviewContentError /> : null}
      {!props.isLoading && !props.isError ? (
        <PreviewContent data={props.data} />
      ) : null}
    </Modal>
  )
}
