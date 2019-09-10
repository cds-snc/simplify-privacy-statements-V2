const { checkLangQuery, getHostProtocol, getDomain } = require('./url.helpers')

test('Can set lang based on req lang', async () => {
  const req = {
    body: {},
    query: { lang: 'fr' },
  }

  const next = jest.fn()

  const res = {
    query: {},
    headers: {},
    data: null,
    json(payload) {
      this.data = JSON.stringify(payload)
    },
    cookie(name, value, options) {
      this.headers[name] = value
    },
  }

  checkLangQuery(req, res, next)
  expect(res.headers.lang).toEqual('fr')
  expect(next.mock.calls.length).toBe(1)
})

test('Sets lang to en by default', async () => {
  const req = {
    body: {},
  }

  const next = jest.fn()

  const res = {
    query: {},
    headers: {},
    data: null,
    json(payload) {
      this.data = JSON.stringify(payload)
    },
    cookie(name, value, options) {
      this.headers[name] = value
    },
  }

  checkLangQuery(req, res, next)
  expect(res.headers.lang).toEqual('en')
  expect(next.mock.calls.length).toBe(1)
})

test('Defaults host protocol when secure param is missing', () => {
  expect(getHostProtocol()).toEqual('http')
})

test('Returns https when req has secure param', () => {
  const req = { secure: true }
  expect(getHostProtocol(req)).toEqual('https')
})

test('Can get domain', () => {
  const req = { headers: { host: 'localhost' } }
  expect(getDomain(req)).toEqual('http://localhost')
})

test('getDomain will throw an error when missing req or host param', () => {
  expect(() => {
    getDomain()
  }).toThrow()
})
