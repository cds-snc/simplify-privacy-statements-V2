const path = require('path')
const { getNextRoute, routeUtils, sendNotification } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'feedback-thanks'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      const data = routeUtils.getViewData(req, {}).data
      console.log({ data })

      try {
        sendNotification({
          email: process.env.FEEDBACK_EMAIL_ADDRESS,
          templateId: process.env.TEMPLATE_ID,
          options: {
            personalisation: {
              feedback: data.what_went_wrong,
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
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
