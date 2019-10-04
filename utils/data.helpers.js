const { getSessionData } = require('./session.helpers')
const { getFlashMessage } = require('./flash.message.helpers')

const getViewData = (req, optionalParams = {}) => {
  const params = {
    data: { ...getSessionData(req) },
  }

  const errors = getFlashMessage(req)

  if (errors) {
    params.errors = errors
  }

  const data = optionalParams.data
    ? { ...params.data, ...optionalParams.data }
    : params.data

  return { ...params, ...optionalParams, data }
}

module.exports = {
  getViewData,
}
