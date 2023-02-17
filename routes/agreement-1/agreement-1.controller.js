const { routeUtils } = require('./../../utils')
const nodePandoc = require('node-pandoc')
const i18n = require('i18n')
const path = require('path')
const fs = require('fs');

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
  const name = 'agreement-1'
  var randomString = getRandomString()
  var docxFilename = 'agreement-' + randomString + '.docx'

  const src = '<h1>Hello</h1><p>It&rsquo;s a test</p>'
  app.get('/download/:fileName', function(req, res) {
    nodePandoc(src, '-f html -t docx -o /tmp/' + docxFilename, callback)
    const fileName = req.params.fileName
    if (/^agreement-[0-9]{8}.docx$/.test(fileName)) {
      res.download(`/tmp/${fileName}`)
    } else {
      throw new Error(
        `Filename download does not match allowed pattern: ${fileName}`,
      )
    }
  })

//   let data = "This is a file containing a collection of books.";
//   fs.writeFile("/tmp/books.txt", data, (err) => {
//       if (err)
//         console.log(err);
//       else {
//         console.log("File written successfully\n");
//         console.log("The written has the following contents:");
//         // console.log(fs.readFileSync("/tmp/books.txt", "utf8"));
//       }
//     });

//   fs.readdir('/tmp', (err, files) => {
//     if (err) {
//         console.error(err)
//         return;
//     }
//     console.log('files in tmp directory', files);
// })

  route.draw(app).get((req, res) => {
    // var randomString = getRandomString()
    // var docxFilename = 'agreement-' + randomString + '.docx'

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
        // nodePandoc(htmlDoc, '-f html -t docx -o /tmp/' + docxFilename, callback)
        res.send(html)
      },
    )
  })
}