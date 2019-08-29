const { validationResult } = require("express-validator");
const { routes: defaultRoutes, Route } = require("../config/routes.config");
const nn = require("nonce-next");
const request = require("request");

/*
  original format is an array of error objects: https://express-validator.github.io/docs/validation-result-api.html
  convert that to an object where the key is the parameter name and value is the error object
  ie,
  [
    { param: 'name', msg: 'Cannot be empty', ... },
    { param: 'number', msg: 'Cannot be empty', ... }
  ]
  to
  {
    name: { param: 'name', msg: 'Cannot be empty', ... },
    number: { param: 'number', msg: 'Cannot be empty', ... }
  }
*/
const errorArray2ErrorObject = (errors = []) => {
  return errors.array({ onlyFirstError: true }).reduce((map, obj) => {
    map[obj.param] = obj;
    return map;
  }, {});
};

/* Middleware */
const oneHour = 1000 * 60 * 60 * 1;

const isValidDate = dateString => {
  const regEx = /^\d{4}-\d{2}$/; // YYYY-MM
  if (!dateString.match(regEx)) {
    return false; // Invalid format
  }

  var d = new Date(`${dateString}-01`);
  var dNum = d.getTime();

  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 7) === dateString;
};

/**
 * This request middleware checks for the "lang" query.
 * If it finds a query parameter "lang=fr" or "lang=en", it will set a "lang" cookie to whichever value.
 *
 * From this point onwards, all of the site's content will be in the user's preferred language.
 */
const checkLangQuery = function(req, res, next) {
  let lang = req.query.lang;

  if (lang === "en" || lang === "fr") {
    res.cookie("lang", lang, {
      httpOnly: true,
      maxAge: oneHour,
      sameSite: "strict"
    });
  }

  return next();
};

/**
 * This request middleware checks if we are visiting a public path
 * For most of the pages in our app, we expect to have user data in the session
 * If we're visiting one of the non-public paths, it will load user data into the session
 *
 * We _could_ redirect people to the "/start" page if they're on the wrong URL,
 * but since this app is for demo purposes at this point, we should just ensure
 * that a user session exists whatever page you end up on.
 */
const checkPublic = function(req, res, next) {
  const publicPaths = ["/", "/clear", "/start"];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  return next();
};

/**
 * Middleware function that runs our error validation
 *
 * Since returning our errors is looking like a lot of boilerplate code, this function:
 *
 * - checks if the request parameters match the schema
 * - checks if there are errors
 * - if no errors, "next()"
 * - if there are errors,
 *   - send back a 422 status
 *   - add the session data to the template
 *   - put the request parameters into the template (except for the redirect)
 *   - render the passed-in template string
 *
 * By including this function, we can cut down our post functions by about half
 *
 * @param string template The template string to render if errors are found (should match the one used for the GET request)
 */
const checkErrors = template => {
  return (req, res, next) => {
    // check to see if the requests should respond with JSON
    if (req.body.json) {
      return checkErrorsJSON(req, res, next);
    }

    const errors = validationResult(req);

    saveSessionData(req);

    if (!errors.isEmpty()) {
      return res.status(422).render(template, {
        data: getSessionData(req),
        nonce: generateNonce(),
        body: req.body,
        errors: errorArray2ErrorObject(errors)
      });
    }

    return next();
  };
};

const getHostProtocol = req => {
  if (req.secure) {
    return "https";
  }

  return "http";
};

const getDomain = req => {
  const protocol = getHostProtocol(req);
  const host = req.headers.host;
  return `${protocol}://${host}`;
};

const validateRouteData = async (req, routePath, formData = false) => {
  const domain = getDomain(req);
  const url = `${domain}/${routePath}`;

  const data = formData ? formData : getSessionData(req);
  data.nonce = generateNonce();
  data.json = true;

  return new Promise((resolve, reject) => {
    request.post({ url, form: data }, (err, httpResponse, body) => {
      if (err) {
        resolve(err.message);
      }

      resolve(body);
    });
  });
};

const getSessionData = req => {
  return typeof req.session.formdata === "object" ? req.session.formdata : {};
};

const saveSessionData = req => {
  // copy all posted parameters
  const body = Object.assign({}, req.body);
  req.session.formdata = { ...req.session.formdata, ...body };
};

const checkErrorsJSON = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(errorArray2ErrorObject(errors));
  }

  return next();
};

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

/* Pug filters */

/**
 * @param {Object} obj the obj we're passing, most often 'data'
 * @param {String} key the key we're trying to access, passed as a string, not including the obj ref itself
 * ex. if we're trying to get to data.personal.maritalStatus
 * pass as hasData(data, 'personal.maritalStatus')
 */
const hasData = (obj, key) => {
  return key.split(".").every(x => {
    if (
      typeof obj != "object" ||
      obj === null ||
      !obj.hasOwnProperty(x) || // eslint-disable-line no-prototype-builtins
      obj[x] === null ||
      obj[x] === ""
    ) {
      return false;
    }
    obj = obj[x];
    return true;
  });
};

const generateNonce = () => {
  return nn.generate(120000);
};

const checkNonce = (req, res, next) => {
  if (!req.body.nonce) {
    res.status(500);
    return res.send("Fail! - missing nonce");
  }

  if (!nn.compare(req.body.nonce)) {
    res.status(500);
    return res.send("Fail! - Invalid nonce");
  }

  next();
};

const getPreviousRoute = (name, routes = defaultRoutes) => {
  const route = getRouteWithIndexByName(name, routes);
  const prevRoute = routes[Number(route.index) - 1];

  if (!prevRoute) {
    return Route;
  }

  return prevRoute;
};

const getNextRoute = (name, routes = defaultRoutes) => {
  const route = getRouteWithIndexByName(name, routes);
  const nextRoute = routes[Number(route.index) + 1];

  if (!nextRoute) {
    return Route;
  }

  return nextRoute;
};

const getRouteByName = (name, routes = defaultRoutes) => {
  return getRouteWithIndexByName(name, routes).route;
};

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
  errorArray2ErrorObject,
  checkErrors,
  checkErrorsJSON,
  checkNonce,
  hasData,
  checkPublic,
  checkLangQuery,
  isValidDate,
  doRedirect,
  getRouteWithIndexByName,
  getRouteByName,
  getPreviousRoute,
  getNextRoute,
  validateRouteData,
  generateNonce,
  getSessionData
};
