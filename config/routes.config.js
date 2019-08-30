
// create an array of routes to allow us to
// a) easily chanage the route paths
// b) add the ability to lookup previous and next routes


// 1) add your route(s) here ⬇️
const routes = [
  { name: "sample", path: "/sample" }, // remove this
  { name: "start", path: "/start" },
  { name: "personal", path: "/personal" },
  { name: "confirmation", path: "/confirmation" }
];

// 2) Add the path to the route controller here ⬇️ ️️
const configRoutes = app => {
  app.set("appRoutes", routes);
  
  // 🔥
  require("../routes/_sample_route/sample.controller")(app); // remove this
  require("../routes/start/start.controller")(app);
  require("../routes/personal/personal.controller")(app);
  require("../routes/confirmation/confirmation.controller")(app);
  require("../routes/global/global.controller")(app);
};

module.exports = {
  configRoutes,
  routes
};
