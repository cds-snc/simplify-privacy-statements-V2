// docs: https://helmetjs.github.io/docs/csp/
module.exports = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    'cdnjs.cloudflare.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  baseUri: ["'none'"],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
  styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
}
