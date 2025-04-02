import { NavLink } from '@mantine/core'
import LinkNext from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import Icon from '@/components/Icon'
import { tools } from '@/data/tools'
import { getUrlPathname } from '@/helpers/get-url-pathname'

const textIncludes = (text?: string | undefined, search?: string | undefined) =>
  String(text || '')
    .toLowerCase()
    .includes(String(search || '').toLowerCase())

export default function LayoutDefaultNavbarGroups({
  filterLabel,
}: {
  filterLabel?: string | undefined
}) {
  const router = useRouter()

  return tools
    .filter((tool) => {
      if (filterLabel) {
        return (
          textIncludes(tool.label, filterLabel) ||
          textIncludes(tool.description, filterLabel) ||
          textIncludes(tool.group, filterLabel) ||
          textIncludes((tool.keywords || []).join(','), filterLabel)
        )
      }
      return true
    })
    .map((tool, toolIndex) => (
      <NavLink
        key={`__${tool.id || ''}_${toolIndex}`}
        active={getUrlPathname(router.pathname) === getUrlPathname(tool.id)}
        component={LinkNext}
        description={tool.description || ''}
        href={tool.id || '#'}
        label={tool.label || ''}
        leftSection={<Icon name={tool.icon || 'file'} />}
        noWrap={false}
      />
    ))
}
