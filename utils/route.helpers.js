const { checkSchema } = require("express-validator");
const { routes: defaultRoutes } = require("../config/routes.config");
const { checkNonce, checkErrors } = require("./validate.helpers");

const DefaultRouteObj = { name: false, path: false };

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
    throw new Error(`[POST ${req.path}] 'redirect' missing`);
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

  if (!route || (!"index" in route && process.env.NODE_ENV !== "production")) {
    throw new Error(
      "Next route error.  \n Did you miss the name input in your form? \n i.e. input(name='name', type='hidden', value=name)"
    );
  }

  const prevRoute = routes[Number(route.index) - 1]
    ? routes[Number(route.index) - 1]
    : false;

  if (!prevRoute) {
    return DefaultRouteObj;
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

  if (!route || (!"index" in route && process.env.NODE_ENV !== "production")) {
    throw new Error(
      "Next route error.  \n Did you miss the name input in your form? \n i.e. input(name='name', type='hidden', value=name)"
    );
  }

  const nextRoute = routes[Number(route.index) + 1]
    ? routes[Number(route.index) + 1]
    : false;

  if (!nextRoute) {
    return DefaultRouteObj;
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

const configRoutes = (app, routes = []) => {
  // require the controllers defined in the routes
  // dir and file name based on the route name
  routes.forEach(routeObj => {
    const routeName = routeObj.name;
    require(`../routes/${routeName}/${routeName}.controller`)(app);
  });

  require("../routes/global/global.controller")(app);
};

const getDefaultMiddleware = options => {
  return [
    checkNonce,
    checkSchema(options.schema),
    checkErrors(options.name),
    doRedirect
  ];
};

module.exports = {
  configRoutes,
  checkPublic,
  doRedirect,
  getPreviousRoute,
  getNextRoute,
  getRouteByName,
  getRouteWithIndexByName,
  getDefaultMiddleware
};
