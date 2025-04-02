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
  esbuildOptions(esbOptions) {
    esbOptions.target = 'es2020'
    return esbOptions
  },
  format: ['cjs', 'esm', 'iife'],
  globalName: 'fxbar_mbox_client',
  keepNames: true,
  minify: !options.watch,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  name: '@fxbar/mbox-web',
  outDir: 'dist',
  silent: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
}))
