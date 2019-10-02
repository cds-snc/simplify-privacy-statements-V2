const path = require('path')
const { routeUtils } = require('./../../utils')

module.exports = app => {
  const name = 'translations-1'
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
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: {}, name: name }),
    ])
}
