const { findEmail, createUser, updateConfirmedEmail } = require('../repositories/index')
const { hashPassword, generateEmailToken, verifyToken, sendEmail } = require('../helpers/index')
const config = require('../config/index')

async function register(client) {
  const { email, password, confirmPassword } = client
  const emailExists = await findEmail(email)
  if (emailExists) return { status: 400, message: 'User already exists' }
  if (password !== confirmPassword) return { status: 400, message: 'Password does not match' }
  const user = client
  user.password = await hashPassword(password)
  const savedUser = await createUser(user)
  const emailToken = await generateEmailToken(savedUser)
  const url = `${config.server.host}:${config.server.port}/user/confirmation/${emailToken}`
  const emailSubject = 'Confirm Email'
  const body = `Please click this email to confirm your email: <a href="${url}">${url}</a>`
  await sendEmail(email, emailSubject, body)
  return { status: 200, message: 'Confirmation email sent', token: emailToken }
}

async function registerConfirmation(token) {
  const { user } = await verifyToken(token, config.emailSecret)
  await updateConfirmedEmail(user)
  return { status: 200, message: 'Email confirmed' }
}

module.exports = { register, registerConfirmation }
