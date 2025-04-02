import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config } from '@lib/repo-config/eslint-nextjs'

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
    rules: {
      'unicorn/no-null': 'off',
      // 'react-hooks/exhaustive-deps': [
      //   'warn',
      //   {
      //     additionalHooks: '(useMyCustomHook|useMyOtherCustomHook)',
      //   },
      // ],
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          project: __dirname,
        },
      },
    },
  },
]
