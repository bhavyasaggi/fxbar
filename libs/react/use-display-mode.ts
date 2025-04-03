import { useEffect, useState } from 'react'

type DisplayMode =
  | 'browser'
  | 'fullscreen'
  | 'minimal-ui'
  | 'picture-in-picture'
  | 'standalone'
  | 'window-controls-overlay'
  | undefined

const MATCH_MEDIA_QUERY_REGEX = /\(\s*display-mode:\s*(.*)\s*\)/
const DISPLAY_MODE_LIST: DisplayMode[] = [
  'browser',
  'fullscreen',
  'minimal-ui',
  'picture-in-picture',
  'standalone',
  'window-controls-overlay',
]
const MATCH_MEDIA_QUERY_LIST: MediaQueryList[] = []

class MatchMediaObserver {
  private matchMediaList: MediaQueryList[]
  private matchMediaListener: ((event: MediaQueryListEvent) => void) | undefined

  public constructor() {
    this.matchMediaList =
      globalThis.window !== undefined &&
      typeof globalThis.matchMedia === 'function'
        ? DISPLAY_MODE_LIST.map((m) =>
            globalThis.matchMedia(`(display-mode: ${m})`)
          )
        : MATCH_MEDIA_QUERY_LIST
    this.matchMediaListener = undefined
  }

  public getDisplayMode() {
    return this.matchMediaList
      .find((m) => m.matches)
      ?.media.match(MATCH_MEDIA_QUERY_REGEX)?.[1] as DisplayMode | undefined
  }

  public unlisten() {
    if (!this.matchMediaListener) {
      return
    }
    for (const m of this.matchMediaList) {
      try {
        m.removeEventListener('change', this.matchMediaListener)
      } catch {
        m.removeListener(this.matchMediaListener)
      }
    }
  }

  public listen(callback: (displayMode: DisplayMode) => void) {
    const listener: typeof this.matchMediaListener = () => {
      callback(this.getDisplayMode())
    }
    //
    this.unlisten()
    this.matchMediaListener = listener
    for (const m of this.matchMediaList) {
      try {
        m.addEventListener('change', listener)
      } catch {
        m.addListener(listener)
      }
    }
  }
}

export function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>()

  useEffect(() => {
    const mmObserver = new MatchMediaObserver()
    // Set initial display mode
    setDisplayMode(mmObserver.getDisplayMode())
    // Listen for display mode changes
    mmObserver.listen((observedDisplayMode) => {
      setDisplayMode(observedDisplayMode)
    })
    // Cleanup
    return () => {
      mmObserver.unlisten()
    }
  }, [])

  return displayMode
}
