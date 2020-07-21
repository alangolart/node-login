const { sendEmail } = require('../helpers/index')

module.exports = {
  key: 'LoginMail',
  async handle({ data }) {
    await sendEmail(data.email, data.emailSubject, data.body)
  },
}
