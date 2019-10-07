const NotifyClient = require('notifications-node-client').NotifyClient

if (!process.env.API_KEY || !process.env.API_BASE_URL) {
  throw new Error('MISSING API_KEY or API_BASE_URL for NotifyClient')
}

const key = process.env.API_KEY
const baseUrl = process.env.API_BASE_URL

const notifyClient =
  process.env.NODE_ENV != 'test' ? new NotifyClient(baseUrl, key) : false

const sendNotification = async (params = { email, templateId, options }) => {
  const { templateId, email, options } = params

  if (!templateId || !email) {
    console.log('no template ID or email was passed')
    return false
  }

  try {
    const response = notifyClient.sendEmail(templateId, email, options)
    return response.body
  } catch (err) {
    console.log(err.message)
    return false
  }
}

const sendSMSNotification = async (params = { phone, templateId, options }) => {
  const { templateId, phone, options } = params

  if (!templateId || !phone) {
    console.log('no template ID or phone was passed')
    return false
  }

  try {
    const response = notifyClient.sendSms(templateId, phone, options)
    return response.body
  } catch (err) {
    console.log(err.message)
    return false
  }
}

module.exports = {
  sendNotification,
  notifyClient,
  sendSMSNotification,
}
