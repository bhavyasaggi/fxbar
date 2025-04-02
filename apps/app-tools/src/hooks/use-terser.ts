import { useEffect, useState } from 'react'

import type { MinifyOptions, MinifyOutput } from 'terser'
export type { MinifyOptions, MinifyOutput } from 'terser'

export type TerserType = (code: string, options?: MinifyOptions) => MinifyOutput

let cacheImportTerser: Promise<TerserType> | undefined

export function useTerser() {
  const [terser, setTerser] = useState<TerserType | undefined>()

  useEffect(() => {
    let isStale = false
    if (!cacheImportTerser) {
      cacheImportTerser = import('terser').then((module) => module.minify_sync)
    }

    cacheImportTerser
      .then((minifySync) => {
        if (!isStale) {
          setTerser(minifySync)
        }
      })
      .catch(() => {
        setTerser(undefined)
      })
    return () => {
      isStale = true
    }
  }, [])

  return terser
}
