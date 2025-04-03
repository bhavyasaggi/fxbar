import { useCallback, useEffect, useRef, useState } from 'react'

import type {
  BrowserMBox,
  BrowserMBoxEmailType,
  BrowserMBoxEmailParsedType,
} from '@fxbar/browser-mbox'

export function useDataList(
  parserRef: React.RefObject<BrowserMBox | undefined>,
  parameters: { position?: number; count?: number; progress?: number },
  options?: { skip?: boolean }
) {
  const requestRef = useRef<string>('__init__')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const [data, setData] = useState<
    | {
        totalCount: number
        position: number
        count: number
        data: BrowserMBoxEmailType[]
      }
    | undefined
  >()

  const refetch = useCallback(() => {
    const requestId =
      Math.random().toString(36).slice(2) + String(parameters.progress || 0)
    if (parserRef.current && !options?.skip) {
      requestRef.current = requestId
      setIsLoading(true)
      Promise.all([
        parserRef.current.count(),
        parserRef.current.list(
          parameters.position ?? 0,
          parameters.count ?? 10
        ),
      ])
        .then(([totalCount, listData]) => {
          if (requestRef.current !== requestId) {
            return
          }
          setIsError(false)
          setError('')
          setData({
            count: listData.length,
            data: listData,
            position: parameters.position ?? 0,
            totalCount,
          })
          setIsError(false)
          setIsLoading(false)
        })
        .catch((error_) => {
          setIsError(true)
          setError(String((error_ as Error).message || error_))
          if (requestRef.current !== requestId) {
            return
          }
          setData(undefined)
          setIsError(true)
          setIsLoading(false)
        })
    }
  }, [
    parserRef,
    parameters.position,
    parameters.count,
    parameters.progress,
    options?.skip,
  ])

  useEffect(() => {
    refetch()
  }, [refetch])

  return [
    data,
    { error, isError, isLoading, refetch, requestId: requestRef.current },
  ] as const
}

export function useDataDetail(
  parserRef: React.RefObject<BrowserMBox | undefined>,
  parameters: { id?: number | string },
  options?: { skip?: boolean }
) {
  const requestRef = useRef<string>('__init__')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')

  const [data, setData] = useState<BrowserMBoxEmailParsedType | undefined>()

  const refetch = useCallback(() => {
    const requestId = Math.random().toString().slice(2)

    if (parserRef.current && !options?.skip) {
      requestRef.current = requestId
      setIsLoading(true)
      parserRef.current
        .get(parameters.id ?? '')
        .then((detailData) => {
          if (requestRef.current !== requestId) {
            return
          }
          setIsError(false)
          setError('')
          setData(detailData)
          setIsError(false)
          setIsLoading(false)
        })
        .catch((error_) => {
          setIsError(true)
          setError(String((error_ as Error).message || error_))
          if (requestRef.current !== requestId) {
            return
          }
          setData(undefined)
          setIsError(true)
          setIsLoading(false)
        })
    }
  }, [parserRef, parameters.id, options?.skip])

  useEffect(() => {
    refetch()
  }, [refetch])

  return [
    data,
    { error, isError, isLoading, refetch, requestId: requestRef.current },
  ] as const
}
