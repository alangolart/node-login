const config = require('../config/index')
const { findEmail, findUserById, findUserSecondStep, saveUser } = require('../repositories/index')
const {
  generateFirstStepLoginToken,
  generateLoginToken,
  verifyToken,
  comparePassword,
} = require('../helpers/index')
const Queue = require('../lib/Queue')
const { generateSixDigitCode, generateSecondStepCodeExpiration } = require('../utils/index')
const authConstants = require('../constants/authConstants')

async function firstStepLogin(client) {
  const { email, password } = client
  const user = await findEmail(email)
  if (!user) return { status: 400, message: authConstants.emailNotRegistered }
  if (user.confirmedEmail === false) return { status: 400, message: authConstants.confirmEmail }
  const validPassword = await comparePassword(password, user.password)
  if (!validPassword) return { status: 400, message: authConstants.invalidPassword }
  const { phoneNumber } = user
  if (user.twoFactorAuth === false) {
    const token = await generateLoginToken(user)
    const emailSubject = 'New sign-in to your account'
    const body = 'New sign-in to your account'
    await Queue.add('FirstStepLoginMail', { email, emailSubject, body })
    return { status: 200, user: user.email, message: authConstants.loginSuccess, token }
  }
  const token = await generateFirstStepLoginToken(user)
  const sixDigitCode = generateSixDigitCode()
  user.secondStepCode = sixDigitCode
  user.secondStepCodeExpiration = generateSecondStepCodeExpiration()
  await saveUser(user)
  const emailSubject = 'Verification Code'
  const body = `Your Verification Code: ${sixDigitCode}`
  await Queue.add('FirstStepLoginMail', { email, emailSubject, body })
  const smsTo = `+${phoneNumber}`
  await Queue.add('FirstStepLoginSms', { smsTo, body })
  return { status: 200, message: authConstants.verificationCodeSent, code: sixDigitCode, token }
}
async function secondStepLogin(body, firstStepToken) {
  const verifiedToken = await verifyToken(firstStepToken, config.firstStepToken)
  if (!verifiedToken) {
    return { status: 400, message: authConstants.invalidToken }
  }
  const { email } = verifiedToken
  const { sixDigitCode } = body
  const user = await findUserSecondStep(email, sixDigitCode)
  if (!user) {
    return { status: 400, message: authConstants.invalidVerificationCode }
  }
  const token = await generateLoginToken(user)
  return { status: 200, user: user.email, message: authConstants.loginSuccess, token }
}
async function reSendSecondStepCode(firstStepToken) {
  const verifiedToken = await verifyToken(firstStepToken, config.firstStepToken)
  const { userId } = verifiedToken
  const user = await findUserById(userId)
  const { email, phoneNumber } = user
  if (user.twoFactorAuth === false) {
    return { status: 400, message: authConstants.unableSendCode }
  }
  const sixDigitCode = generateSixDigitCode()
  user.secondStepCode = sixDigitCode
  user.secondStepCodeExpiration = generateSecondStepCodeExpiration()
  const emailSubject = 'Verification Code'
  const body = `Your Verification Code: ${sixDigitCode}`
  const smsTo = `+${phoneNumber}`
  await saveUser(user)
  Queue.add('SendSecondStepCodeMail', { email, emailSubject, body })
  Queue.add('SendSecondStepCodeSms', { smsTo, body })
  return { status: 200, message: authConstants.verificationCodeSent, sixDigitCode }
}

module.exports = {
  firstStepLogin,
  secondStepLogin,
  reSendSecondStepCode,
}
