const request = require('supertest')
const app = require('../../app.js')
jest.mock("node-pandoc", () => () => null);


test('Can send get request agreement-1 route ', async () => {
  const route = app.routes.get('agreement-1')
  jest.fn().mockImplementation((cb) => cb((error) => {
    if (error) {
      console.log(error)
    }
    const response = request(app).get(route.path.en)
    expect(response.statusCode).toBe(200)
  }))
})