module.exports = function (ctx) {
  return {
    map: ctx.options.map,
    parser: ctx.options.parser,
    plugins: {
      cssnano: {
        preset: [
          'advanced',
          {
            autoprefixer: {
              add: true,
              cascade: false,
              flexbox: 'no-2009',
              grid: 'autoplace',
              remove: true,
              supports: false,
            },
            cssDeclarationSorter: {
              order: 'smacss',
              exclude: false,
            },
            discardComments: {
              removeAll: true,
            },
            minifyFontValues: {
              removeQuotes: false,
            },
            normalizeCharset: {
              add: true,
            },
          },
        ],
      },
      'postcss-combine-media-query': {},
      'postcss-combine-duplicated-selectors': {
        removeDuplicatedProperties: true,
      },
      'postcss-fail-on-warn': {},
    },
  }
}
