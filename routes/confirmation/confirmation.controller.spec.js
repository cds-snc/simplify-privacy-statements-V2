const request = require('supertest')
const app = require('../../app.js')
const { getRouteByName } = require('../../utils/route.helpers')

test('Confirmation page loads', async () => {
  const route = getRouteByName('confirmation')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(200)
})
