const path = require('path')
const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const i18n = require('i18n')

const getData = (req, name) => {
  const jsFiles = ['js/toggle-area.js']

  const data = routeUtils.getViewData(req, {
    jsFiles: jsFiles,
    language: `_${i18n.getLocale(req)}`,
  })
  return data
}

module.exports = app => {
  const name = 'questions-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      global.getData = getData
      res.render(name, getData(req, name))
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
