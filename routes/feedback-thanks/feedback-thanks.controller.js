const { routeUtils, sendNotification } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = (app, route) => {
  route
    .draw(app)
    .get((req, res) => {
      const data = routeUtils.getViewData(req, {}).data

      try {
        sendNotification({
          email: process.env.FEEDBACK_EMAIL_ADDRESS,
          templateId: process.env.FEEDBACK_TEMPLATE_ID,
          options: {
            personalisation: {
              feedback: data.what_went_wrong,
            },
          },
        })
      } catch (err) {
        console.log(`Error: ${err}`)
      }
      res.render(route.name, routeUtils.getViewData(req, {}))
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
