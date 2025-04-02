import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  entry: [
    'src/**/*.(j|t)s',
    '!*.(config|test).(j|t)s',
    '!node_modules/*',
    '!dist/*',
  ],
  esbuildOptions(buildOptions) {
    buildOptions.target = 'es2020'
    return buildOptions
  },
  format: ['cjs', 'esm', 'iife'],
  globalName: 'fxbar_utils',
  keepNames: true,
  minify: !options.watch,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  name: '@fxbar/utils',

  outDir: 'dist',
  silent: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
}))
