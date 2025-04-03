import { BrowserMBoxEvent } from '@fxbar/browser-mbox'
import { Paper, Select, Group, Text, Table, Button } from '@mantine/core'
import React, { useState, useEffect } from 'react'

import Icon from '@/components/Icon'

import Pagination from './Pagination'
import Preview from './Preview'
import ProgressBar from './ProgressBar'
import { useDataDetail, useDataList } from './use-data'
import { useBrowserMBoxRef } from './use-mbox-ref'

export default function ToolPreviewMBox() {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const { ref: browserMBoxRef, isUninitialized } = useBrowserMBoxRef()

  const [dataDetail, { isLoading: isLoadingDetail, isError: isErrorDetail }] =
    useDataDetail(
      browserMBoxRef,
      { id: filters.id },
      { skip: isUninitialized || !isReady }
    )

  const [
    dataList,
    { isLoading: isLoadingList, refetch: refectDataList, error: errorDataList },
  ] = useDataList(browserMBoxRef, filters, {
    skip: isUninitialized || !isReady,
  })
  const dataListTotalCount = dataList?.totalCount || 0
  const dataListPosition = dataList?.position || 0
  const dataListCount = dataList?.count || 0

  useEffect(() => {
    const currentBrowserMBoxRef = browserMBoxRef.current
    const progressListener = (event: CustomEvent<number>) => {
      if (event.detail > 10) {
        setIsReady(true)
      }
    }
    currentBrowserMBoxRef?.addEventListener(
      BrowserMBoxEvent.PROGRESS,
      progressListener
    )
    return () => {
      currentBrowserMBoxRef?.removeEventListener(
        BrowserMBoxEvent.PROGRESS,
        progressListener
      )
    }
  }, [browserMBoxRef])

  useEffect(() => {
    if (!isUninitialized && isReady && !isLoading) {
      refectDataList()
    }
  }, [isUninitialized, isReady, isLoading, refectDataList])

  return (
    <Paper>
      <Button
        fullWidth
        disabled={isUninitialized || isLoading}
        leftSection={<Icon name={isLoading ? 'loader' : 'table'} size={14} />}
        loading={isLoading}
        my='xs'
        onClick={async () => {
          const browserMBoxInstance = browserMBoxRef.current
          if (!browserMBoxInstance) {
            return
          }
          setIsReady(false)
          setIsLoading(true)
          setError('')
          try {
            await browserMBoxInstance.open({
              chunkSize: 2.5e7, // 25MB
              maxChunkSize: 2.5e8, // 250MB
            })
            setIsLoading(false)
          } catch (error_) {
            setError(String((error_ as Error).message || error_))
            setIsLoading(false)
          }
        }}
      >
        Select File
      </Button>
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
        <ProgressBar error={error || errorDataList} mboxRef={browserMBoxRef} />
        <Button
          disabled={isUninitialized || !isReady}
          flex='0 0 auto'
          ms='auto'
          leftSection={
            <Icon name={isLoading || isLoadingList ? 'loader' : 'refresh-cw'} />
          }
          onClick={refectDataList}
        >
          Refresh
        </Button>
      </Group>
      <Paper withBorder pos='relative'>
        <Table.ScrollContainer
          mih={dataList?.data.length ? undefined : 300}
          minWidth={600}
        >
          <Table
            highlightOnHover
            striped
            layout='fixed'
            style={{ wordBreak: 'break-word' }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={200}>From</Table.Th>
                <Table.Th w={200}>Date</Table.Th>
                <Table.Th w='calc(100% - 400px)'>Subject</Table.Th>
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
                      fullWidth
                      justify='flex-start'
                      size='compact-sm'
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
