import { useDebouncedCallback } from '@mantine/hooks'
import React, {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useState,
} from 'react'

import type { MetaTagsType } from './types'

// TODO: Add language to lang-code support
const generateTags = (values: MetaTagsType) => {
  const jsonld: Record<string, string> = {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
  }
  if (values.name) {
    jsonld.name = values.name
  }
  if (values.canonical) {
    jsonld.url = values.canonical
  }
  if (values.description) {
    jsonld.description = values.description
  }
  if (values.image) {
    jsonld.image = values.image
  }
  return [
    '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">',
    `<meta http-equiv="Content-Language" content="${values.language || 'en'}">`,
    '<meta name="type" content="website">',
    values.name ? `<meta name="site_name" content="${values.name}">` : '',
    `<meta name="locale" content="${values.language || 'en'}">`,
    values.themeColor
      ? `<meta name="theme-color" content="${values.themeColor}">`
      : '',
    //
    values.title ? `<title>${values.title}</title>` : '',
    values.canonical ? `<link rel="canonical" href="${values.canonical}">` : '',
    values.description
      ? `<meta name="description" content="${values.description}" />`
      : '',
    values.icon ? `<link rel="icon" href="${values.icon}">` : '',
    values.image ? `<meta name="image" content="${values.image}">` : '',
    values.canonical ? `<meta name="url" content="${values.canonical}">` : '',
    values.tags?.length
      ? `<meta name="keywords" content="${values.tags.join(',')}">`
      : '',
    //
    values.author ? `<meta name="author" content="${values.author}">` : '',
    values.summary ? `<meta name="summary" content="${values.summary}">` : '',
    values.revised ? `<meta name="revised" content="${values.revised}">` : '',
    values.authorUrl ? `<link rel="author" href="${values.authorUrl}">` : '',
    values.publisherUrl
      ? `<link rel="publisher" href="${values.publisherUrl}">`
      : '',
    //
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    values.robots ? `<meta name="robots" content="${values.robots}">` : '',
    values.googleSiteVerification
      ? `<meta name="google-site-verification" content="${values.googleSiteVerification}">`
      : '',
    //
    values.rssFeed
      ? `<link rel="alternate" type="application/rss+xml" title="RSS Feed Title" href="${values.rssFeed}">`
      : '',
    values.atomFeed
      ? `<link rel="alternate" type="application/atom+xml" title="Atom Feed Title" href="${values.atomFeed}">`
      : '',
    //
    // '<link rel="alternate" href="Your URL" hreflang="en">',
    //
    values.pragma
      ? `<meta http-equiv="pragma" content="${values.pragma}">`
      : '',
    values.cacheControl
      ? `<meta http-equiv="cache-control" content="${values.cacheControl}">`
      : '',
    values.expires
      ? `<meta http-equiv="expires" content="${values.expires}">`
      : '',
    values.refresh
      ? `<meta http-equiv="refresh" content="${values.refresh}">`
      : '',
    `<script type="application/ld+json">${JSON.stringify(jsonld, undefined, 2)}</script>`,
  ]
    .filter(Boolean)
    .join('\n')
}

const MetaTagsValueContext = createContext<string>('')
const MetaTagsSetContext = createContext<(tags: MetaTagsType) => void>(() => {})

export function MetaTagsContextProvider({
  children,
}: {
  readonly children?: React.ReactNode
}) {
  const [generatedTags, setGeneratedTags] = useState(generateTags({}))
  const evaluateGeneratedTags = useCallback((values: MetaTagsType) => {
    startTransition(() => {
      setGeneratedTags(generateTags(values))
    })
  }, [])
  const debouncedSetGeneratedTags = useDebouncedCallback(
    evaluateGeneratedTags,
    600
  )

  return (
    <MetaTagsSetContext.Provider value={debouncedSetGeneratedTags}>
      <MetaTagsValueContext.Provider value={generatedTags}>
        {children}
      </MetaTagsValueContext.Provider>
    </MetaTagsSetContext.Provider>
  )
}

export function useMetaTagsValue() {
  const context = useContext(MetaTagsValueContext)
  return context
}

export function useMetaTagsSet() {
  const context = useContext(MetaTagsSetContext)
  return context
}
