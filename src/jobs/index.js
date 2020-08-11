const RegistationMail = require('./RegistationMail')
const ResetPasswordMail = require('./ResetPasswordMail')
const FirstStepLoginMail = require('./FirstStepLoginMail')
const FirstStepLoginSms = require('./FirstStepLoginSms')
const SendSecondStepCodeMail = require('./SendSecondStepCodeMail')
const SendSecondStepCodeSms = require('./SendSecondStepCodeSms')

module.exports = {
  RegistationMail,
  ResetPasswordMail,
  FirstStepLoginMail,
  FirstStepLoginSms,
  SendSecondStepCodeMail,
  SendSecondStepCodeSms,
}
