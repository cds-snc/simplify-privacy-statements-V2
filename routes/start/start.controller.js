const path = require("path");
const { getNextRoute, getRouteByName } = require("../../utils/index");

module.exports = app => {
  const name = "start";
  const route = getRouteByName(name);
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  // redirect from "/" → "/start"
  app.get("/", (req, res) => res.redirect(route.path));
  app.get(route.path, async (req, res) => {
    res.render(name, { nextRoute: getNextRoute(name).path });
  });
};
