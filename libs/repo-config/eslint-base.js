import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export const config = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  importPlugin.flatConfigs.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      camelcase: [
        'error',
        {
          ignoreGlobals: true,
          ignoreImports: true,
        },
      ],
      curly: ['error', 'all'],
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'import/extensions': 'off',
      'import/first': 'error',
      'import/named': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          distinctGroup: true,
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          pathGroups: [
            { group: 'index', pattern: '*.module.scss', position: 'after' },
            { group: 'internal', pattern: '@/**', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'object',
            'type',
          ],
        },
      ],
      'max-classes-per-file': ['error', 1],
      'max-lines': [
        'warn',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-params': [
        'warn',
        {
          max: 4,
        },
      ],
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-console': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-eval': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-inner-declarations': 'warn',
      'no-invalid-this': 'error',
      'no-labels': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],
      'no-plusplus': 'error',
      'no-shadow': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'prefer-promise-reject-errors': 'error',
      'prefer-rest-params': 'warn',
      'prefer-template': 'error',
      radix: 'error',
      'require-await': 'error',
      'require-yield': 'error',
      'sort-imports': 'off',
      'sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: true,
          ignoreComputedKeys: true,
          minKeys: 2,
          natural: true,
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.pnp/**',
      '.pnp.js',
      '.yarn/**',
      'storybook-static/**',
      'coverage/**',
      'build/**',
      'dist/**',
      'out/**',
      '.docusaurus/**',
      '.cache-loader/**',
      '.cache/**',
      '.next/**',
      '.Trashes/**',
      '__MACOSX/**',
      '.Spotlight-V100/**',
      '.vercel/**',
      '*.tsbuildinfo',
      'next-env.d.ts',
    ],
  },
]
