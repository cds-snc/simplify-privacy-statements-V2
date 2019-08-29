const path = require("path");
const {
  validateRouteData,
  getSessionData,
  getRouteByName,
  addViewPath
} = require("../../utils/index");

module.exports = app => {
  const name = "confirmation";
  const route = getRouteByName(name);

  addViewPath(app, path.join(__dirname, "./"));

  app.get(route.path, async (req, res) => {
    // validate data from previous step to see if we should be allowed to reach this step
    const result = await validateRouteData(req, "personal");
    console.log("result", result);
    res.render(name, { data: getSessionData(req) });
  });
};
