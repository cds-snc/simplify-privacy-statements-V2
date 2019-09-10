const { getSessionData, saveSessionData } = require('./session.helpers')

test('Can get and set form data for the session', () => {
  const req = {}
  req.session = {}
  req.body = { phone: '613-111-1111' }
  expect(getSessionData(req)).toStrictEqual({})
  saveSessionData(req)
  expect(req.session.formdata).toStrictEqual(req.body)
  expect(getSessionData(req)).toStrictEqual(req.body)
})
