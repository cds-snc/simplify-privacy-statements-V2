const url = require('url')
const { routeUtils, sendNotification } = require('./../../utils')
const i18n = require('i18n')

module.exports = (app, route) => {
  route
    .draw(app)
    .get((req, res) => {
      const data = routeUtils.getViewData(req, {}).data
      const queryParams = { lang: i18n.getLocale(req) }
      Object.keys(data)
        .filter(
          key =>
            !['_csrf', 'what_went_wrong'].includes(key) &&
            data[`${key}`] !== '',
        )
        .forEach(key => {
          queryParams[`${key}`] = data[`${key}`]
        })
      const link = url
        .format({
          protocol: req.protocol,
          host: req.get('Host'),
          pathname: routeUtils.getRouteByName('questions-1').path,
          query: queryParams,
        })
        .replace('(', '%28') // otherwise our Notify template gets messed up :(
        .replace(')', '%29') // still works with form though
      data.link = link
      console.log(`length of link: ${link.length}`)
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
      res.render(route.name, {
        data,
      })
    })

}
