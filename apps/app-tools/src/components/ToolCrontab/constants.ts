/* eslint-disable sort-keys */
export const CRON_SECTIONS = {
  minute: {
    '0-59': 'allowed values',
    '@yearly': 'Non-Standard (0 0 1 1 *)',
    '@annually': 'Non-Standard (0 0 1 1 *)',
    '@monthly': 'Non-Standard (0 0 1 * *)',
    '@weekly': 'Non-Standard (0 0 * * 0)',
    '@daily': 'Non-Standard (0 0 * * *)',
    '@hourly': 'Non-Standard (0 * * * *)',
  },
  hour: {
    '0-23': 'allowed values',
  },
  'day (month)': {
    '0-31': 'allowed values',
  },
  month: {
    '0-12': 'allowed values',
    'JAN-DESC': 'alternative single values',
  },
  'day (week)': {
    '0-6': 'allowed values',
    'SAT-SUN': 'alternative single values',
  },
  year: {
    '*': 'any value',
    ',': 'value list separator',
    '-': 'range of values',
    '/': 'step values',
  },
} as const
