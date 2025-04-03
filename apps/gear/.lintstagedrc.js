/* eslint-disable unicorn/prefer-module */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path')

const buildEslintCommand = (filenames) => {
  const fns = filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')
  return `next lint --fix --file ${fns}`
}

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
