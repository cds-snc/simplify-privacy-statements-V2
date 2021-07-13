const request = require('supertest')
const app = require('../../app.js')
jest.mock("node-pandoc", () => () => null);

test('Can send get request agreement-generic route ', async () => {
  const route = app.routes.get('agreement-generic')
  const response = await request(app).get(route.path.en)
  expect(response.statusCode).toBe(200)
})

