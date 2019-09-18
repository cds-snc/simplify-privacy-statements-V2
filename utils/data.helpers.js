const { getSessionData } = require('./session.helpers')
const { getFlashMessage } = require('./flash.message.helpers')

const getViewData = (req, optionalParams = {}) => {
  const params = {
    data: { ...getSessionData(req), ...optionalParams },
  }

  const errors = getFlashMessage(req)

  if (errors) {
    params.errors = errors
  }

  return params
}

module.exports = {
  getViewData,
}
