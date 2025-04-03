import {
  Box,
  Container,
  Tooltip,
  ActionIcon,
  Breadcrumbs,
  Flex,
  Group,
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import LinkNext from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import Icon from '@/components/Icon'
import Image from '@/components/Image'
import Link from '@/components/Link'
import { getUrlPathname } from '@/helpers/get-url-pathname'
import IMAGE_LOGO from '@/images/logo.png'

export default function LayoutDefaultFooter() {
  const { colorScheme } = useMantineColorScheme()

  const router = useRouter()
  const pathnameSegments = getUrlPathname(router.pathname).split('/').slice(1)

  return (
    <React.Fragment>
      <Box bg='primary' color='white' mt='lg' py='xs'>
        <Container component='footer' size='lg'>
          {pathnameSegments.length > 0 ? (
            <Breadcrumbs
              ps='xs'
              separatorMargin='xs'
              separator={
                <Icon
                  name='chevrons-right'
                  size={16}
                  style={{ color: 'var(--mantine-color-white)' }}
                />
              }
            >
              <Link inline c='white' href='/'>
                <Icon name='home' size={16} />
              </Link>
              {pathnameSegments.map((path, index, segments) => {
                return (
                  <Link
                    key={`__${path}_${index}`}
                    inline
                    c='white'
                    href={`/${segments.slice(0, index + 1).join('/')}`}
                  >
                    {path}
                  </Link>
                )
              })}
            </Breadcrumbs>
          ) : undefined}
        </Container>
      </Box>
      <Box bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'}>
        <Container py='lg' size='lg'>
          <Flex align='flex-start' justify='space-between' px='xs' wrap='wrap'>
            <Box>
              <Image alt='logo' height={32} src={IMAGE_LOGO} />
              <Text c='dimmed' mt='xs' size='sm'>
                © 20xx | All right reserved
              </Text>
            </Box>
            <Group ms='auto'>
              <Tooltip label='Github' position='top'>
                <ActionIcon
                  color='gray'
                  component={LinkNext}
                  href='https://github.com/'
                  variant='outline'
                >
                  <Icon name='github' />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Flex>
        </Container>
      </Box>
    </React.Fragment>
  )
}
