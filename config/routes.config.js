// 1) add your route(s) here ⬇️
const routes = [
  { name: 'landing-page', path: '/' },
  { name: 'questions-1', path: '/questions-1' },
  { name: 'questions-1b', path: '/questions-1b' },
  { name: 'agreement-1', path: '/agreement-1' },
  { name: 'questions-2', path: '/questions-2' },
  { name: 'agreement-2', path: '/agreement-2' },
]

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
}
