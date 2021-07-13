const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  const name = route.name
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route
    .draw(app)
    .get((req, res) => {
      res.render(name, { ...routeUtils.getViewData(req, {}), questionUrls: {
        cds: "questions-1",
        generic: "questions-generic",
      } })
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
