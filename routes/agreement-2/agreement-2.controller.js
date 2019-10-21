const path = require('path')
const { getNextRoute, routeUtils } = require('./../../utils')
const i18n = require('i18n')

module.exports = app => {
  const name = 'agreement-2'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app.get(route.path, (req, res) => {
    var nextRoute = getNextRoute(name).path

    res.render(
      name + `-${i18n.getLocale(req)}`,
      {
        ...routeUtils.getViewData(req, {}),
        nextRoute: nextRoute,
      },
      function(err, html) {
        if (err) {
          console.log(err)
        }
        res.send(html)
      },
    )
  })
}
