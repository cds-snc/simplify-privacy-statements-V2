// docs: https://helmetjs.github.io/docs/csp/
module.exports = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  baseUri: ["'none'"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:"],
  styleSrc: ["'self'", "https://fonts.googleapis.com"]
};
