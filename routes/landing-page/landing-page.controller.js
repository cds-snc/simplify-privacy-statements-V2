const path = require('path')
const { getNextRoute, routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'landing-page'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      var nextRoute = getNextRoute(name).path;
      if (Object.keys(req.query).indexOf("lang") > -1) {
        nextRoute += "?lang=" + req.query.lang;
      }
      res.render(name, { ...routeUtils.getViewData(req, {}), nextRoute: nextRoute })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
