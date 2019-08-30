const { routes: defaultRoutes, Route } = require("../config/routes.config");

/**
 * This request middleware checks if we are visiting a public path
 */
const checkPublic = function(req, res, next) {
  const publicPaths = ["/", "/clear", "/start"];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  return next();
};

/**
 * attempt to auto redirect based on the next route it the route config
 */
const doRedirect = (req, res, next) => {
  if (req.body.json) {
    return next();
  }

  const nextRoute = getNextRoute(req.body.name);

  if (!nextRoute.path) {
    throw new Error(`[POST ${req.path}] 'redirect' parameter missing`);
  }

  return res.redirect(nextRoute.path);
};

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" },
 * @returns { name: "", path: "" }
 */
const getPreviousRoute = (name, routes = defaultRoutes) => {
  const route = getRouteWithIndexByName(name, routes);
  const prevRoute =
    route.index && route.index ? routes[Number(route.index) - 1] : false;

  if (!prevRoute) {
    return Route;
  }

  return prevRoute;
};

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" }
 * @returns { name: "", path: "" }
 */
const getNextRoute = (name, routes = defaultRoutes) => {
  const route = getRouteWithIndexByName(name, routes);
  const nextRoute = routes[Number(route.index) + 1];

  if (!nextRoute) {
    return Route;
  }

  return nextRoute;
};

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" }
 * @returns { name: "", path: "" }
 */
const getRouteByName = (name, routes = defaultRoutes) => {
  return getRouteWithIndexByName(name, routes).route;
};

/**
 * @param {String} name route name
 * @param {Array} routes array of route objects { name: "start", path: "/start" }
 * @returns { index: "1", route: { name: "start", path: "/start" } }
 */
const getRouteWithIndexByName = (name, routes = defaultRoutes) => {
  const route = routes
    .map((route, index) => {
      if (route.name === name) {
        return { index, route };
      }
    })
    .filter(function(route) {
      return route != null;
    });

  if (route.length >= 1) {
    return route[0];
  }
};

module.exports = {
  checkPublic,
  doRedirect,
  getPreviousRoute,
  getNextRoute,
  getRouteByName,
  getRouteWithIndexByName
};
