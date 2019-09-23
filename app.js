// import environment variables.
require('dotenv').config()

// import node modules.
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const sassMiddleware = require('node-sass-middleware')
const path = require('path')
const cookieSession = require('cookie-session')
const cookieSessionConfig = require('./config/cookieSession.config')
const { hasData, checkPublic, checkLangQuery } = require('./utils')
const csp = require('./config/csp.config')
const csrf = require('csurf');

// check to see if we have a custom configRoutes function
let { configRoutes, routes } = require('./config/routes.config')

/* istanbul ignore next */ // test mock sets as undefined but says line isn't covered
if (typeof configRoutes === 'undefined') { // if not use the default
  configRoutes = require('./utils/route.helpers').configRoutes
}

// initialize application.
const app = express()

// general app configuration.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.app_session_secret))
app.use(require('./config/i18n.config').init)

// CSRF setup
app.use(csrf({
  cookie: true,
  signed: true,
}))

// append csrfToken to all responses
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

// in production: use redis for sessions
// but this works for now
app.use(cookieSession(cookieSessionConfig))

// in production: precompile CSS
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'assets/scss'),
    dest: path.join(__dirname, 'public'),
    debug: false,
    indentedSyntax: false, // look for .scss files, not .sass files
    sourceMap: true,
    outputStyle: 'compressed',
  }),
)

// public assets go here (css, js, etc)
app.use(express.static(path.join(__dirname, 'public')))

// dnsPrefetchControl controls browser DNS prefetching
// frameguard to prevent clickjacking
// hidePoweredBy to remove the X-Powered-By header
// hsts for HTTP Strict Transport Security
// ieNoOpen sets X-Download-Options for IE8+
// noSniff to keep clients from sniffing the MIME type
// xssFilter adds some small XSS protections
app.use(helmet())
app.use(helmet.contentSecurityPolicy({ directives: csp }))
// gzip response body compression.
app.use(compression())

app.use(checkPublic)
app.use(checkLangQuery)

// Adding values/functions to app.locals means we can access them in our templates
app.locals.GITHUB_SHA = process.env.GITHUB_SHA || null
app.locals.hasData = hasData

// set default views path
app.locals.basedir = path.join(__dirname, "./views");
app.set("views", [path.join(__dirname, "./views")]);

configRoutes(app, routes)

// view engine setup
const nunjucks = require("nunjucks");

nunjucks.configure([...app.get("views"), 'views/macros'], {
  autoescape: true,
  express: app,
}).addGlobal('$env', process.env);

nunjucks.installJinjaCompat();

app.set('view engine', 'njk');

module.exports = app;
