const NotifyClient = require('notifications-node-client').NotifyClient

const key = process.env.API_KEY
const baseUrl = process.env.API_BASE_URL

const notifyClient =
  process.env.NODE_ENV !== 'test' ? new NotifyClient(baseUrl, key) : false

const sendNotification = async (params = { email, templateId, options }) => {
  const { templateId, email, options } = params

  if (!templateId || !email) {
    console.log('no template ID or email was passed')
    return false
  }

  console.log(` sending notification to: ${email}`)
  console.log({ options })

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
