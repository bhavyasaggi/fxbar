import { Switch, Tooltip, useMantineColorScheme } from '@mantine/core'
import React from 'react'

import Icon from '@/components/Icon'

export default function ThemeSwitch() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <Tooltip
      label={colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      position='bottom'
      refProp='rootRef'
    >
      <Switch
        checked={colorScheme === 'dark'}
        color='dark.4'
        offLabel={<Icon name='moon' stroke='var(--mantine-color-blue-6)' />}
        size='lg'
        onChange={toggleColorScheme}
        onLabel={<Icon name='sun' stroke='var(--mantine-color-yellow-4)' />}
      />
    </Tooltip>
  )
}
