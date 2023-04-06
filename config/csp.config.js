// docs: https://helmetjs.github.io/docs/csp/

const scriptSrc = ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', '*.herokuapp.com', 'https://www.googletagmanager.com', 'https://www.google-analytics.com', 'https://edbi6zcop5ta2t5wb6hb5y6kja0rsajp.lambda-url.ca-central-1.on.aws/dist/js/questions-1.3e7d142ac08d78a0424a.js']

if (process.env.NODE_ENV === 'development') {
  scriptSrc.push("'unsafe-eval'")
}

module.exports = {
  defaultSrc: ["'self'"],
  scriptSrc: scriptSrc,
  baseUri: ["'none'"],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
  styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
  upgradeInsecureRequests: true,
}
