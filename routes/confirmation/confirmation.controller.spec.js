const request = require('supertest')
const app = require('../../app.js')
const { getRouteByName } = require('../../utils/route.helpers')

// @todo mock out validateRouteData so we can test for a 200
/*
jest.mock("../../utils/validate.helpers", () => ({
  validateRouteData: jest.fn((req, routePath, formData = {}) => {
    return true;
  }),
  checkErrors: jest.fn(() => {
    return;
  })
}));
*/

test.skip("Confirmation page should redirect because it's missing info", async () => {
  const route = getRouteByName('confirmation')
  const response = await request(app).get(route.path)
  expect(response.statusCode).toBe(302)
})
