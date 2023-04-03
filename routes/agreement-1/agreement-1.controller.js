const { routeUtils } = require('./../../utils')
const nodePandoc = require('node-pandoc')
const i18n = require('i18n')

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
  const name = 'agreement-1'

  app.get('/access/:fileName', function(req, res) {
    const fileName = req.params.fileName
    if (/^agreement-[0-9]{8}.docx$/.test(fileName)) {
      res.download(`/mnt/access/${fileName}`)
    } else {
      throw new Error(
        `Filename download does not match allowed pattern: ${fileName}`,
      )
    }
  })

  route.draw(app).get((req, res) => {
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
      function (err, html) {
        if (err) {
          console.log(err)
        }
        const startIndex = html.indexOf(startHtml) + startHtml.length
        const endIndex = html.indexOf('</main>')
        const htmlDoc = html.slice(startIndex, endIndex)

        // Send the HTML response in the nodePandoc callback to give pandoc time to generate the docx file
        // as the Lambda function will be terminated once it sends the response.
        // nodePandoc(htmlDoc, '-f html -t docx -o /mnt/access/' + docxFilename, (err) => {
        //   if(err){
        //     console.error(`Error from pandoc: ${err}`);
        //   }
        //   res.send(html)
        // })

        res.send(html)
                
      },
    )
  })
}