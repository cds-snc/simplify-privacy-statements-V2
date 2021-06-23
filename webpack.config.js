const path = require('path')

module.exports = (env, argv) => {
  const { getConfig } = require('@cdssnc/webpack-starter')
  const config = getConfig({
    mode: argv.mode,
    entry: {
      styles: './assets/scss/app.scss',
      "questions-1": './routes/questions-1/js/questions-1.js',
      "questions-generic": './routes/questions-generic/js/questions-generic.js',
    },
    output: {
      filename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/dist'),
    },
    stats: 'errors-only',
  })

  return config
}
