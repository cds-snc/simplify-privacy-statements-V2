const path = require("path");
const { validateRouteData, getSessionData } = require("../../utils/index");

module.exports = app => {
  // add this dir to the views path
  app.set("views", [...app.get("views"), path.join(__dirname, "./")]);

  app.get("/confirmation", async (req, res) => {
    // validate data from previous step to see if we should be allowed to reach this step

    const result = await validateRouteData(req, "personal");
    console.log("result", result);

    res.render("confirmation", { data: getSessionData(req) });
  });
};
