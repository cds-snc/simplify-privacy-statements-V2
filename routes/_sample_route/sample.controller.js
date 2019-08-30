const path = require("path");
const { checkSchema } = require("express-validator");
const {
  addViewPath,
  getRouteByName,
  checkErrors,
  getSessionData,
  doRedirect
} = require("./../../utils");
const { Schema } = require("./schema.js");

module.exports = app => {
  const name = "sample";
  const route = getRouteByName(name);

  addViewPath(app, path.join(__dirname, "./"));

  app.get(route.path, (req, res) => {
    res.render(name, {
      data: getSessionData(req),
      name
    });
  });

  app.post(route.path, checkSchema(Schema), checkErrors(name), doRedirect);
};
