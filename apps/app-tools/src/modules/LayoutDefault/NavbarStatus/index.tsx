import {
  Collapse,
  NavLink,
  UnstyledButton,
  type NavLinkProps,
} from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import Router from 'next/router'
import React from 'react'

import Icon, { type IconProps } from '@/components/Icon'
import { useBeforeInstallPrompt } from '@/hooks/use-before-install-prompt'
import { useDisplayMode } from '@/hooks/use-display-mode'
import { useNetworkState } from '@/hooks/use-network-state'

export default function LayoutDefaultNavbarStatus() {
  const prompt = useBeforeInstallPrompt()
  const { cameOnline, wentOffline } = useNetworkState()
  const displayMode = useDisplayMode()
  const { fullscreen } = useFullscreen()

  let label = ''
  let description = ''
  let color: NavLinkProps['color'] | undefined
  let icon: IconProps['name'] | undefined
  let iconRight: IconProps['name'] | undefined
  let action: (() => void) | undefined
  if (wentOffline) {
    label = 'Disconnected'
    description = 'Application is offline'
    icon = 'cloud-off'
    color = 'gray'
  } else if (cameOnline) {
    label = 'Connected'
    description = 'Application is online'
    icon = 'cloud'
    iconRight = 'refresh-cw'
    color = 'green'
    action = Router.reload
  } else if (prompt) {
    label = 'Install'
    description = 'Install the app on your device'
    icon = 'download-cloud'
    iconRight = 'chevrons-right'
    action = prompt
  } else if (fullscreen || displayMode === 'fullscreen') {
    label = 'Fullscreen Mode'
    description = 'Running in fullscreen mode'
    icon = 'maximize'
    // color = 'gray'
  }

  return (
    <Collapse in={Boolean(label)}>
        <NavLink
          active={true}
          color={color}
          component={UnstyledButton}
          description={description}
          disabled={!label}
          label={label || 'Status Action'}
          leftSection={icon ? <Icon name={icon} /> : undefined}
          variant='filled'
          rightSection={
            iconRight ? <Icon name={iconRight} size={14} /> : undefined
          }
          onClick={action}
        />
      </Collapse>
  )
}
