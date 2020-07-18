const { findEmail, createUser, saveUser, updateConfirmedEmail } = require('../repositories/index')
const {
  hashPassword,
  generateEmailToken,
  generateResetPasswordToken,
  verifyToken,
  checkRedisInvalidToken,
  insertRedisList,
} = require('../helpers/index')
const userConstants = require('../constants/userConstants')
const Queue = require('../lib/Queue')
const config = require('../config/index')

async function register(client) {
  const { email, password, confirmPassword } = client
  const emailExists = await findEmail(email)
  if (emailExists) return { status: 400, message: userConstants.emailExists }
  if (password !== confirmPassword)
    return { status: 400, message: userConstants.passwordDoesNotMatch }
  const user = client
  user.password = await hashPassword(password)
  const savedUser = await createUser(user)
  const emailToken = await generateEmailToken(savedUser)
  const url = `${config.server.host}:${config.server.port}/user/confirmation/${emailToken}`
  const emailSubject = 'Confirm Email'
  const body = `Please click this email to confirm your email: <a href="${url}">${url}</a>`
  Queue.add('RegistationMail', { email, emailSubject, body })
  return { status: 200, message: userConstants.emailSent, token: emailToken }
}

async function registerConfirmation(token) {
  const previouslyUsedToken = await checkRedisInvalidToken('registerConfirmationTokens', token)
  if (previouslyUsedToken) return previouslyUsedToken
  const { user } = await verifyToken(token, config.emailSecret)
  await updateConfirmedEmail(user)
  await insertRedisList('registerConfirmationTokens', token)
  return { status: 200, message: userConstants.emailConfirmed }
}
async function resetPassword(client) {
  const { email } = client
  const user = await findEmail(email)
  if (!user) return { status: 400, message: userConstants.userNotFound }
  const resetToken = await generateResetPasswordToken(user)
  const resetUrl = `${config.server.host}:${config.server.port}/user/reset-password/${resetToken}`
  const emailSubject = 'Password Reset'
  const body = `
        <p>Link to reset your password</p>
        <a href="${resetUrl}">Link</a> to reset your password</<a>
        `
  Queue.add('ResetPasswordMail', { email, emailSubject, body })
  return { status: 200, message: userConstants.emailSent, token: resetToken }
}

async function newPassword(client, passwordToken) {
  if (!passwordToken) return { status: 400, message: userConstants.tokenNotFound }
  const invalidToken = await checkRedisInvalidToken('passwordTokens', passwordToken)
  if (invalidToken) return invalidToken
  const { email } = client
  const newPass = client.password
  const { confirmPassword } = client
  const resetUser = await findEmail(email)
  if (!resetUser) return { status: 400, message: userConstants.userNotFound }
  if (newPass !== confirmPassword)
    return { status: 400, message: userConstants.passwordDoesNotMatch }
  const verifiedToken = verifyToken(passwordToken, config.resetEmailSecret)
  if (!verifiedToken) return { status: 400, message: userConstants.invalidToken }
  const hashedPassword = await hashPassword(newPass)
  resetUser.password = hashedPassword
  await saveUser(resetUser)
  await insertRedisList('passwordTokens', passwordToken)
  return { status: 200, message: userConstants.passwordSaved }
}

module.exports = { register, registerConfirmation, resetPassword, newPassword }
