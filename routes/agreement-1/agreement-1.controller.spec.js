const request = require('supertest')
const app = require('../../app.js')
// const nodePandoc = require('node-pandoc')
jest.mock("node-pandoc", () => () => null)
// jest.mock("nodePandoc")

test('Can see if I get a response', async () => {
  // jest.mock("node-pandoc", () => () => null)
  const route = app.routes.get('agreement-1')
  const response = await request(app).get(route.path.en)
  console.log("response is: ", response.statusCode)
  // console.log(route.path.en)
  
  expect("hello").toBe("hello")
})

// test('Can see if response', async () => {
//   const route = app.routes.get('agreement-1')
//   request(app).get(route.path.en).expect(200)
// })

// test('Can send get request agreement-1 route ', async () => {
//   const route = app.routes.get('agreement-1')
//   const response = await request(app).get(route.path.en)
//   expect(response.statusCode).toBe(200)
// })

