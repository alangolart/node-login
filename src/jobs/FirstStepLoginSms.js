const { sendSms } = require('../helpers/index')

module.exports = {
  key: 'FirstStepLoginSms',
  async handle({ data }) {
    await sendSms(data.smsTo, data.body)
  },
}
