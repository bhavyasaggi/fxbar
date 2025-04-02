import { MBoxWeb, MBoxWebEvent } from '@fxbar/mbox-web'
import {
  Paper,
  Select,
  Group,
  Text,
  Table,
  Button,
  Box,
  Loader,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import React, { useState, useEffect, useRef } from 'react'

import Icon from '@/components/Icon'

import Pagination from './Pagination'
import Preview from './Preview'
import ProgressBar from './ProgressBar'
import { useDataDetail, useDataList } from './use-data'

export default function ToolPreviewMBox() {
  const MBoxWebRef = useRef<MBoxWeb | null>(null)

  const [isUninitialized, setIsUninitialized] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState<{
    id: number | string | undefined
    position: number
    count: number
  }>({
    count: 10,
    id: undefined,
    position: 0,
  })

  const [dataDetail, { isLoading: isLoadingDetail, isError: isErrorDetail }] =
    useDataDetail(
      MBoxWebRef,
      { id: filters.id },
      { skip: isUninitialized || !isReady }
    )

  const [
    dataList,
    { isLoading: isLoadingList, refetch: refectDataList, error: errorDataList },
  ] = useDataList(MBoxWebRef, filters, { skip: isUninitialized || !isReady })
  const dataListTotalCount = dataList?.totalCount || 0
  const dataListPosition = dataList?.position || 0
  const dataListCount = dataList?.count || 0

  useEffect(() => {
    if (!MBoxWebRef.current) {
      MBoxWebRef.current = new MBoxWeb()
      setIsUninitialized(false)
    }
    const progressListener = (event: CustomEvent<number>) => {
      const eventProgress = event.detail
      setProgress(eventProgress)
      if (eventProgress > 10) {
        setIsReady(true)
      }
    }
    MBoxWebRef.current?.addEventListener(
      MBoxWebEvent.PROGRESS,
      progressListener
    )
    return () => {
      MBoxWebRef.current?.removeEventListener(
        MBoxWebEvent.PROGRESS,
        progressListener
      )
    }
  }, [])

  useEffect(() => {
    if (!isUninitialized && isReady && progress === 100) {
      refectDataList()
    }
  }, [isUninitialized, isReady, progress, refectDataList])

  return (
    <Paper>
      <Dropzone
        accept={['application/mbox']}
        disabled={isUninitialized || isLoading}
        multiple={false}
        px='xs'
        py='xl'
        onDrop={async (files) => {
          const file = files[0]
          const MBoxWebInstance = MBoxWebRef.current
          if (file && MBoxWebInstance) {
            setIsReady(false)
            setIsLoading(true)
            setError('')
            try {
              await MBoxWebInstance.open(file, {
                chunkSize: 2.5e7, // 25MB
                maxChunkSize: 2.5e8, // 250MB
              })
              setIsLoading(false)
            } catch (error_) {
              setError(String((error_ as Error).message || error_))
              setIsLoading(false)
            }
          }
        }}
      >
        <Group
          align='center'
          c={isLoading ? 'dimmed' : undefined}
          justify='center'
          wrap='wrap'
        >
          <Dropzone.Accept>
            <Icon name='table' size={64} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <Icon
              name='x-octagon'
              size={64}
              style={{ color: 'var(--mantine-color-red)' }}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            {isLoading ? <Loader size={64} /> : <Icon name='table' size={64} />}
          </Dropzone.Idle>
          <Box>
            <Text fw='bold' size='xl'>
              Select MBox File
            </Text>
            <Text c='gray'>
              <Text span>Drag files here</Text>
              <Text span c='dimmed' fs='italic'>
                &nbsp;or&nbsp;
              </Text>
              <Text span>Browse to upload</Text>
            </Text>
          </Box>
        </Group>
      </Dropzone>
      <Group align='center' gap='xs' justify='space-between' my='xs'>
        <Group align='center' gap='xs' justify='flex-start'>
          <Select
            data={['10', '50', '100']}
            disabled={isUninitialized || !isReady}
            leftSection={<Icon name='filter' />}
            value={String(filters.count)}
            onChange={(v) => setFilters({ ...filters, count: Number(v) })}
          />
        </Group>
        <Pagination
          disabled={isUninitialized || !isReady}
          totalCount={dataListTotalCount}
          value={filters}
          onChange={(nextValue) => {
            setFilters(nextValue)
          }}
        >
          {!isUninitialized && isReady && dataListTotalCount ? (
            <Text c='dimmed'>
              {dataListPosition}{' '}
              <Text span fs='italic'>
                to
              </Text>{' '}
              {dataListPosition + dataListCount}{' '}
              <Text span fs='italic'>
                from
              </Text>{' '}
              {isLoading ? '...' : dataListTotalCount}
            </Text>
          ) : null}
        </Pagination>
      </Group>
      <Group align='center' gap='xs' my='xs'>
        <ProgressBar error={error || errorDataList} progress={progress} />
        <Button
          disabled={isUninitialized || !isReady}
          flex='0 0 auto'
          ms='auto'
          leftSection={
            <Icon name={isLoading || isLoadingList ? 'loader' : 'refresh-cw'} />
          }
          onClick={refectDataList}
        >
          Reload
        </Button>
      </Group>
      <Paper withBorder pos='relative'>
        <Table.ScrollContainer
          mih={dataList?.data.length ? undefined : 300}
          minWidth={600}
        >
          <Table highlightOnHover striped layout='fixed'>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>From</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Subject</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dataList?.data.map((datum) => (
                <Table.Tr key={datum.id}>
                  <Table.Td>{`${datum.from?.name || ''}${
                    datum.from?.address ? ` <${datum.from.address}>` : ''
                  }${
                    datum.from?.group?.length
                      ? ` (${datum.from?.group
                          .map(
                            (g) =>
                              `${g.name}${g.address ? ` <${g.address}>` : ''}`
                          )
                          .join(', ')})`
                      : ''
                  }`}</Table.Td>
                  <Table.Td>
                    {datum.date ? new Date(datum.date).toLocaleString() : '-'}
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant='transparent'
                      onClick={() => {
                        setFilters({ ...filters, id: datum.id })
                      }}
                    >
                      {datum.subject || '-'}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Preview
          data={dataDetail}
          isError={isErrorDetail}
          isLoading={isLoadingDetail}
          opened={Boolean(filters.id)}
          onClose={() => {
            setFilters({ ...filters, id: undefined })
          }}
        />
      </Paper>
    </Paper>
  )
}
