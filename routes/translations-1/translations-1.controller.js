const path = require('path')
const { routeUtils } = require('./../../utils')
const i18n = require('i18n')

module.exports = app => {
  const name = 'translations-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))
  const otherLanguageDict = {en: "fr", fr: "en"}
  app
    .get(route.path, (req, res) => {
      const language = i18n.getLocale(req)
      const jsFiles = ['js/toggle-area.js']
      res.render(name, {
        ...routeUtils.getViewData(req, {otherLanguage: "_fr", language: "_en"}),
        ...routeUtils.getViewData(req, {otherLanguage: `_${otherLanguageDict[language]}`, language: `_${language}`}),
        jsFiles,
      })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: {}, name: name }),
    ])
}
