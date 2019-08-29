const path = require("path");
const { checkSchema } = require("express-validator");
const {
  doRedirect,
  checkErrors,
  checkNonce,
  generateNonce,
  getRouteByName,
  addViewPath,
  getSessionData
} = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = app => {
  const name = "personal";
  const route = getRouteByName(name);

  addViewPath(app, path.join(__dirname, "./"));

  app.get(route.path, (req, res) => {
    res.render(name, {
      data: getSessionData(req),
      name,
      nonce: generateNonce()
    });
  });

  app.post(
    route.path,
    checkNonce,
    checkSchema(Schema),
    checkErrors(name),
    doRedirect
  );
};
