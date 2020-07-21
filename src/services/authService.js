const { findEmail } = require('../repositories/index')
const { generateLoginToken, comparePassword } = require('../helpers/index')
const Queue = require('../lib/Queue')
const authConstants = require('../constants/authConstants')

async function login(client) {
  const { email, password } = client
  const user = await findEmail(email)
  if (!user) return { status: 400, message: authConstants.emailNotRegistered }
  if (user.confirmedEmail === false) return { status: 400, message: authConstants.confirmEmail }
  const validPassword = await comparePassword(password, user.password)
  if (!validPassword) return { status: 400, message: authConstants.invalidPassword }
  const token = await generateLoginToken(user)
  const emailSubject = 'New sign-in to your account'
  const body = 'New sign-in to your account'
  await Queue.add('LoginMail', { email, emailSubject, body })
  return { status: 200, user: user.email, message: authConstants.loginSuccess, token }
}

module.exports = {
  login,
}
