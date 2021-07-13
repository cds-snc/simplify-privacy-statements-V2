const { routeUtils } = require('./../../utils')
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

const startHtml = `<div style="display: none">start of agreement</div>`

// make first letter lowercase and delete trailing periods
const lowerCaseFirstLetter = s =>
  s && s.length > 0 ? s[0].toLowerCase() + s.slice(1) : s

const stripTrailingPeriods = s =>
  s && s.length > 0 ? s.replace(/\.*\s*$/, '') : s

const changeToPhrase = key =>
  !key.includes('partner_department') && !key.includes('researcher')

module.exports = (app, route) => {
  const name = 'agreement-generic'

  route
    .draw(app)
    .get((req, res) => {
    var randomString = getRandomString()
    var docxFilename = 'agreement-' + randomString + '.docx'

    const data = routeUtils.getViewData(req, {}).data
    var queryParams = {}
    Object.keys(data)
      .filter(key => key !== '_csrf' && data[`${key}`] !== '')
      .forEach(key => {
        if (changeToPhrase(key)) {
          data[`${key}`] = lowerCaseFirstLetter(
            stripTrailingPeriods(data[`${key}`]),
          )
        } else if (key.includes('partner_department')) {
          data[`${key}`] = stripTrailingPeriods(data[`${key}`])
        }
        queryParams[`${key}`] = data[`${key}`]
      })

    res.render(
      name + `-${i18n.getLocale(req)}`,
      {
        data,
        docxFilename: docxFilename,
      },
      function(err, html) {
        if (err) {
          console.log(err)
        }
        const startIndex = html.indexOf(startHtml) + startHtml.length
        const endIndex = html.indexOf('</main>')
        const htmlDoc = html.slice(startIndex, endIndex)
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
