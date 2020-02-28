const { routeUtils, getClientJs } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'questions-2'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      const jsFiles = ['js/toggle-area.js']
      res.render(name, {
        ...routeUtils.getViewData(req, {}),
        jsFiles,
      })
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
