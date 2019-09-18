const path = require('path')
const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

module.exports = app => {
  const name = 'personal'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, csrfProtection, (req, res) => {
      const jsFiles = ['js/file-input.js']
      res.render(name, { ...routeUtils.getViewData(req), jsFiles })
    })
    .post(route.path, csrfProtection, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
