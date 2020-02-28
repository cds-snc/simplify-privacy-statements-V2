const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  const name = route.name
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route
    .draw(app)
    .get((req, res) => {
      var questionsURL = "questions-1"
      res.render(name, { ...routeUtils.getViewData(req, {}), questionsURL: questionsURL })
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
