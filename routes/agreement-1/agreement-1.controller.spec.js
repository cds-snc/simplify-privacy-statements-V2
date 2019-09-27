const request = require('supertest')
const app = require('../../app.js')
const { getRouteByName } = require('../../utils/route.helpers')
jest.mock("node-pandoc", () => () => null);

test('Can send get request agreement-1 route ', async () => {
  const route = getRouteByName('agreement-1')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(200)
})

