let { routes } = require('./config/routes.config')
const request = require('supertest')
const app = require('./app.js')

test('Server can request first route and receive 200 response', async () => {
  const response = await request(app).get(routes[0].path)
  expect(response.statusCode).toBe(200)
})
