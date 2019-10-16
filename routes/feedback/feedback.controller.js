const path = require('path')
const { getNextRoute, routeUtils, notifySetup } = require('./../../utils')

module.exports = app => {
  const name = 'feedback'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      res.render(name, {
        ...routeUtils.getViewData(req, { notifySetup }),
        nextRoute: getNextRoute(name).path,
      })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: {}, name: name }),
    ])
}
