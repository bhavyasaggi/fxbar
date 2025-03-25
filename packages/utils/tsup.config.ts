import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  name: '@fxbar/utils',
  entry: [
    '**/*.(j|t)s',
    '!*.(config|test).(j|t)s',
    '!node_modules/*',
    '!dist/*',
  ],
  format: ['cjs', 'esm', 'iife'],
  silent: true,
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: !options.watch,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  keepNames: true,
  treeshake: true,
  globalName: 'fxbar_utils',
  outDir: 'dist',
  esbuildOptions(options) {
    options.target = 'es2020'
    return options
  },
}))
