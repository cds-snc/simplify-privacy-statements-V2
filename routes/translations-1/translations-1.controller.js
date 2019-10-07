const path = require('path')
const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const i18n = require('i18n')

module.exports = app => {
  const name = 'translations-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))
  app
    .get(route.path, (req, res) => {
      const language = i18n.getLocale(req) === 'en' ? 'en' : 'fr'
      const otherLanguage = i18n.getLocale(req) === 'en' ? 'fr' : 'en'
      const jsFiles = ['js/toggle-area.js']
      res.render(name, {
        ...routeUtils.getViewData(req, {
          otherLanguage: `_${otherLanguage}`,
          language: `_${language}`,
        }),
        jsFiles,
      })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
