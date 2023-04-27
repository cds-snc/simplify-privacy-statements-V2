// import environment variables.
require('dotenv').config()

// import node modules.
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const sessionConfig = require('./config/session.config')
const { hasData } = require('./utils')
const { addNunjucksFilters } = require('./filters')
const csrf = require('csurf')
const cloudfrontHeader = process.env.CLOUDFRONT_HEADER
const enHost = "simplify-privacy-statements.alpha.canada.ca/fr/"
const frHost = "simplification-avis-confidentialite.alpha.canada.ca/en/"

// check to see if we have a custom configRoutes function
let { configRoutes, routes, locales } = require('./config/routes.config')

if (!configRoutes) configRoutes = require('./utils/route.helpers').configRoutes
if (!locales) locales = ['en', 'fr']

// initialize application.
const app = express()

// general app configuration.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.app_session_secret))
app.use(require('./config/i18n.config').init)

// CSRF setup
app.use(
  csrf({
    cookie: true,
    signed: true,
  }),
)

// append csrfToken to all responses
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

// in production: use redis for sessions
// but this works for now
app.use(sessionConfig)

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
// gzip response body compression.
app.use(compression())

app.use(function(req, res, next){
  const headers = req.headers['x-cloudfront-header']
  if (cloudfrontHeader !== headers) {
    res.status(403).send("Direct access is not allowed")
  } else {
    next()
  }
})

app.use(function(req, res, next){
  if (req.hostname + req.path === frHost) {
    // If you have the FR domain but is set to EN locale, redirect to EN domain with EN locale
    res.redirect("https://simplify-privacy-statements.alpha.canada.ca/en/")
  } else if (req.hostname + req.path === enHost) {
    // If you have the EN domain but is set to FR locale, redirect to FR domain with FR locale
    res.redirect("https://simplification-avis-confidentialite.alpha.canada.ca/fr/")
  }
  next();
})

// Adding values/functions to app.locals means we can access them in our templates
app.locals.GITHUB_SHA = process.env.GITHUB_SHA || null
app.locals.hasData = hasData

// set default views path
app.locals.basedir = path.join(__dirname, './views')
app.set('views', [path.join(__dirname, './views')])

app.routes = configRoutes(app, routes, locales)

// view engine setup
const nunjucks = require('nunjucks')

const env = nunjucks
  .configure([...app.get('views'), 'views/macros'], {
    autoescape: true,
    express: app,
  })
  .addGlobal('$env', process.env)

addNunjucksFilters(env)

nunjucks.installJinjaCompat()

app.set('view engine', 'njk')


module.exports = app