// 1) add your route(s) here ⬇️
const routes = [
  { name: 'landing-page', path: '/' },
  { name: 'participant-consent-form', path: '/participant-consent-form' },
  { name: 'agreement_1', path: '/agreement_1' },
  { name: 'confirmation', path: '/confirmation' },
]

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
}
