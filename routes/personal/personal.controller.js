const path = require("path");
const { checkSchema } = require("express-validator");
const {
  doRedirect,
  checkErrors,
  checkNonce,
  generateNonce,
  getRouteByName,
  getSessionData
} = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = app => {
  // add this dir to the views path
  const name = "personal";
  const route = getRouteByName(name);

  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

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
