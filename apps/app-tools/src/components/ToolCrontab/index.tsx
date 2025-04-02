import {
  Box,
  Collapse,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import cronParser from 'cron-parser'
import cronstrue from 'cronstrue'
import React, { useRef, useState } from 'react'

import { CRON_SECTIONS } from './constants'

const intlDateTimeFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  dayPeriod: 'long',
  hour: 'numeric',
  hour12: true,
  minute: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
})

const CRON_SECTION_OPTIONS: Array<keyof typeof CRON_SECTIONS> = [
  'minute',
  'hour',
  'day (month)',
  'month',
  'day (week)',
]

export default function ToolCrontab() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cronString, setCronString] = useState('20 8 13 7 1')
  const [cronSection, setCronSection] =
    useState<keyof typeof CRON_SECTIONS>('year')

  let cronStringValid = true

  let cronStringNext = ''
  try {
    cronStringNext = cronString
      ? intlDateTimeFormat.format(cronParser.parse(cronString).next().toDate())
      : ''
  } catch {
    cronStringValid = false
  }

  let cronStringDescription = ''
  try {
    cronStringDescription =
      cronStringValid && cronString ? cronstrue.toString(cronString) : ''
  } catch {
    cronStringValid = false
  }

  const cronOptions = Object.entries({
    ...(cronSection === 'year' ? undefined : CRON_SECTIONS.year),
    ...CRON_SECTIONS[cronSection],
  })

  const handleChangeCronString: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.currentTarget.value
    setCronString(value)
    // setCronSection(value.split(' ')[0] as keyof typeof CRON_SECTIONS)
  }

  const handleSelectCronString: React.ReactEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { selectionStart: cursor, value } = event.currentTarget
    const valueMatch = value
      .slice(0, (cursor || -1) + 1)
      .match(/(\s*[^\s]+\s*)/g)
    const sectionIndex = Math.min(
      Math.max((valueMatch?.length || 0) - 1, 0),
      CRON_SECTION_OPTIONS.length - 1
    )
    const nextCronSection = CRON_SECTION_OPTIONS[sectionIndex]
    if (nextCronSection) {
      setCronSection(nextCronSection)
    }
  }

  const handleBlurCronString: React.ReactEventHandler<HTMLInputElement> = (
    event
  ) => {
    setCronString(event.currentTarget.value.trim().replaceAll(/\s+/g, ' '))
  }

  const handleCronSectionChange = (value: string) => {
    const valueWithType = value as keyof typeof CRON_SECTIONS
    const sectionIndex = Math.min(
      Math.max(CRON_SECTION_OPTIONS.indexOf(valueWithType), 0),
      CRON_SECTION_OPTIONS.length - 1
    )

    if (inputRef.current) {
      const inputValue = inputRef.current.value || ''
      let selectFrom = -1
      let selectTo = -1
      for (
        let index = 0, spaceCount = 0;
        index < inputValue.length && spaceCount <= sectionIndex + 1;
        index += 1
      ) {
        if (inputValue[index] === ' ' && inputValue[index + 1] !== ' ') {
          spaceCount += 1
        }
        if (selectFrom < 0 && spaceCount === sectionIndex) {
          selectFrom = index
        } else if (selectTo < 0 && spaceCount === sectionIndex + 1) {
          selectTo = index
        }
      }

      if (selectFrom > -1) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(
          selectFrom <= 0 ? 0 : selectFrom + 1,
          selectTo <= 0 ? inputValue.length : selectTo
        )
      }
    }
    setCronSection(valueWithType)
  }

  return (
    <Paper withBorder my='xs' p='xs' shadow='md'>
      <Stack gap='xs'>
        <Box mih={44}>
          <Collapse in={Boolean(cronStringDescription)}>
            <Box>
              <Text>&ldquo;{cronStringDescription || ''}&rdquo;</Text>
              {cronStringNext ? (
                <Text c='dimmed' fs='italic' size='xs' ta='end'>
                  <Text span fw='bold'>
                    - Next @&nbsp;
                  </Text>
                  <Text span>{cronStringNext}</Text>
                </Text>
              ) : null}
            </Box>
          </Collapse>
        </Box>
        <TextInput
          ref={inputRef}
          error={!cronStringValid}
          size='lg'
          value={cronString}
          styles={{
            input: {
              textAlign: 'center',
            },
          }}
          onBlur={handleBlurCronString}
          onChange={handleChangeCronString}
          onSelect={handleSelectCronString}
        />
        <ScrollArea>
          <SegmentedControl
            fullWidth
            data={CRON_SECTION_OPTIONS}
            value={cronSection}
            onChange={handleCronSectionChange}
          />
        </ScrollArea>
        <Table c='gray' layout='fixed'>
          <Table.Tbody>
            {cronOptions.map((option) => (
              <Table.Tr key={option[0]}>
                <Table.Td ta='end'>{option[0]}</Table.Td>
                <Table.Td ta='start'>{option[1]}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  )
}
