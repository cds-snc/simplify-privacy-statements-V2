const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

const getData = (req, name) => {
  const data = routeUtils.getViewData(req, {
    jsFiles: ['js/toggle-area.js'],
    data: req.query,
  })
  return data
}

module.exports = (app, route) => {
  route
    .draw(app)
    .get((req, res) => {
      global.getData = getData
      res.render(route.name, getData(req, route.name))
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
