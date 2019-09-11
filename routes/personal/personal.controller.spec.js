const request = require('supertest')
const app = require('../../app.js')
const { getRouteByName } = require('../../utils/route.helpers')

test('Can send get request personal route ', async () => {
  const route = getRouteByName('personal')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(200)
})

// @todo test sending a form request
test('Can send post request personal route ', async () => {
  const route = getRouteByName('personal')
  const response = await request(app).post(route.path)
  expect(response.statusCode).toBe(422)
})

jest.mock('../../utils/flash.message.helpers', () => ({
  getFlashMessage: jest.fn(req => {
    return [{ param: 'testerror', msg: 'caught this error' }]
  }),
}))

test.skip('Display errors on the page', async () => {
  const route = getRouteByName('personal')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(200)
  expect(response.text).toContain('caught this error')
})
