const { sendSms } = require('../helpers/index')

module.exports = {
  key: 'SendSecondStepCodeSms',
  async handle({ data }) {
    await sendSms(data.smsTo, data.body)
  },
}
