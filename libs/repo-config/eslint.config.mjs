import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config } from './eslint-base.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        project: true,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
    },
  },
]
