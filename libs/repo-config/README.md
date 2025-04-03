# @lib/repo-config

Collection of internal eslint & typescript configurations.

## ESLint config

Include a `eslint.config.mjs` in project directory with the folloing content
Ensure to replace `{...}` with approriate config.

```javascript
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '@lib/repo-config/eslint.{...}'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  ...config,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          project: __dirname,
        },
      },
    },
  }
]
```

## Typescript Config

Include a `tsconfig.json` in project directory with the folloing content
Ensure to replace `{...}` with approriate config.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@lib/repo-config/tsconfig.{...}.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "**.*.mjs", "**/*.js", "**/*.jsx"],
  "exclude": ["node_modules", "out", "dist", "build", "coverage"]
}
```
