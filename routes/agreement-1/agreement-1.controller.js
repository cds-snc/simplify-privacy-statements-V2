const path = require('path')
const { getNextRoute, routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
var nodePandoc = require("node-pandoc");

var callback = (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log("done conversion");
  }
};

function getRandomString() {
  return Math.random().toString().split(".")[1].slice(0,8);
}

module.exports = app => {
  const name = 'agreement-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

    app
    .get(route.path, (req, res) => {
      var randomString = getRandomString()
      var docxFilename = "agreement-" + randomString + ".docx"

      res.render(name, { 
        ...routeUtils.getViewData(req, {}), 
        nextRoute: getNextRoute(name).path,
        docxFilename: docxFilename,
      }, function(err, html) {
        if(err) {
          console.log(err)
        }
        nodePandoc(html, "-f html -t docx -o public/documents/" + docxFilename, callback)
        res.send(html);
      })
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
