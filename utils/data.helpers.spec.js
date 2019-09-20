const { getViewData } = require('./data.helpers')

test('populates data from session', () => {
  const req = {
    body: {},
    session: { formdata: { code: '123' } },
    headers: { host: 'localhost' },
  }

  const obj = getViewData(req)
  expect(obj.data.code).toEqual('123')
})

test('populates session and includes errors', () => {
  const req = {
    body: {},
    session: { formdata: { code: '123' }, flashmessage: 'the error' },
    headers: { host: 'localhost' },
  }

  const obj = getViewData(req)
  expect(obj.data.code).toEqual('123')
  expect(obj.errors).toEqual('the error')
})