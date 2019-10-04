const path = require('path')
const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'landing-page'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      var questions1URL = "/questions-1"
      var questions2URL = "/questions-2"
      if (Object.keys(req.query).indexOf("lang") > -1) {
        questions1URL += "?lang=" + req.query.lang;
        questions2URL += "?lang=" + req.query.lang;
      }
      res.render(name, { ...routeUtils.getViewData(req, {}), questions1URL: questions1URL, questions2URL: questions2URL })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
