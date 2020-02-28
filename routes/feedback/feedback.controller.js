const { routeUtils, notifySetup } = require('./../../utils')

module.exports = (app, route) => {
  route
    .draw(app)
    .get((req, res) => {
      res.render(route.name, routeUtils.getViewData(req, { notifySetup }))
    })
    .post(route.doRedirect())
}
