const { sendEmail } = require('../helpers/index')

module.exports = {
  key: 'SendSecondStepCodeMail',
  async handle({ data }) {
    await sendEmail(data.email, data.emailSubject, data.body)
  },
}
