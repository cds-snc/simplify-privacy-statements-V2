const path = require('path')
const { getNextRoute, routeUtils } = require('./../../utils')
const nodePandoc = require('node-pandoc')
const i18n = require('i18n')

var callback = (err, result) => {
  if (err) {
    console.error(err)
  } else {
    console.log('done conversion')
  }
}

function getRandomString() {
  return Math.random()
    .toString()
    .split('.')[1]
    .slice(0, 8)
}

// make first letter lowercase and delete trailing periods
const toPhrase = s =>
  s && s.length > 0 ? (s[0].toLowerCase() + s.slice(1)).replace(/\.+$/, '') : s

const eligibleKey = key =>
  (key.includes('_en') || key.includes('_fr')) &&
  !key.includes('partner_department')

const flagHtml = `
  <div>[Put your agreement in an existing privacy form template to add the <a href="https://www.canada.ca/en/treasury-board-secretariat/services/government-communications/federal-identity-program/technical-specifications/stationery/letterhead-flag-symbol.html">Symbol of the Government of Canada</a>.]</div>
`

const wordmarkHtml = `
  <div>[Put your agreement in an existing privacy form template to add the <a href="https://www.canada.ca/en/treasury-board-secretariat/services/government-communications/federal-identity-program/technical-specifications/stationery/letterhead-flag-symbol.html">Government of Canada Wordmark</a>.]</div>
`

module.exports = app => {
  const name = 'agreement-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app.get(route.path, (req, res) => {
    var nextRoute = getNextRoute(name).path
    var randomString = getRandomString()
    var docxFilename = 'agreement-' + randomString + '.docx'

    const data = routeUtils.getViewData(req, {}).data
    var queryParams = {}
    Object.keys(data)
      .filter(key => key !== '_csrf' && data[`${key}`] !== '')
      .forEach(key => {
        if (eligibleKey(key)) {
          data[`${key}`] = toPhrase(data[`${key}`])
        }
        queryParams[`${key}`] = data[`${key}`]
      })

    res.render(
      name + `-${i18n.getLocale(req)}`,
      {
        data,
        nextRoute: nextRoute,
        docxFilename: docxFilename,
      },
      function(err, html) {
        if (err) {
          console.log(err)
        }
        const startIndex = html.indexOf('<h1>')
        const endIndex = html.indexOf('</main>')
        const htmlDoc =
          flagHtml + html.slice(startIndex, endIndex) + wordmarkHtml
        nodePandoc(
          htmlDoc,
          '-f html -t docx -o public/documents/' + docxFilename,
          callback,
        )
        res.send(html)
      },
    )
  })
}
