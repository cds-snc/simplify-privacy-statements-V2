const path = require('path')
const url = require('url')
const { getNextRoute, routeUtils, sendNotification } = require('./../../utils')

module.exports = app => {
  const name = 'email-link'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      const data = routeUtils.getViewData(req, {}).data
      var queryParams = {}
      Object.keys(data)
        .filter(key => key !== '_csrf' && data[`${key}`] !== '')
        .forEach(key => {
          queryParams[`${key}`] = data[`${key}`]
        })
      const link = url.format({
        protocol: req.protocol,
        host: req.get('Host'),
        pathname: routeUtils.getRouteByName('questions-1').path,
        query: queryParams,
      })
      try {
        sendNotification({
          email: data.researcher_email,
          templateId: process.env.LINK_TEMPLATE_ID,
          options: {
            personalisation: {
              link,
            },
          },
        })
      } catch (err) {
        console.log(`Error: ${err}`)
      }
      res.render(name, {
        ...routeUtils.getViewData(req, {}),
        nextRoute: getNextRoute(name).path,
      })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: {}, name: name }),
    ])
}
