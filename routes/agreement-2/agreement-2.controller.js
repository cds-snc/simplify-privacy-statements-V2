const path = require('path')
const { getNextRoute, routeUtils } = require('./../../utils')
var nodePandoc = require('node-pandoc')

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

const flagHtml = `
    <img src="public/img/GOC_colour_en.png" alt="Symbol of the Government of Canada" width="300px">
`;

const wordmarkHtml = `
    <img src="public/img/Canwordmark_colour.png" alt="Government of Canada" width="150px">
`;

module.exports = app => {
  const name = 'agreement-2'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      var nextRoute = getNextRoute(name).path;
      var randomString = getRandomString()
      var docxFilename = 'agreement-' + randomString + '.docx'
      res.render(
        name + `-${i18n.getLocale(req)}`,
        { 
          ...routeUtils.getViewData(req, {}), 
          nextRoute: nextRoute,
          docxFilename: docxFilename,
        }, 
        function(err, html) {
          if(err) {
            console.log(err)
          }
        const startIndex = html.indexOf("<h1>");
        const endIndex = html.indexOf("</main>");
        const htmlDoc = flagHtml + html.slice(startIndex, endIndex) + wordmarkHtml;
        nodePandoc(htmlDoc, "-f html -t docx -o public/documents/" + docxFilename, callback)
        res.send(html);
      })

    })
}
