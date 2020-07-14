const { findEmail, createUser } = require('../repositories/index')
const { hashPassword } = require('../helpers/index')

async function register(client) {
  const { email, password, confirmPassword } = client
  const emailExists = await findEmail(email)
  if (emailExists) return { status: 400, message: 'User already exists' }
  if (password !== confirmPassword) return { status: 400, message: 'Password does not match' }
  const user = client
  user.password = await hashPassword(password)
  const savedUser = await createUser(user)
  return { status: 200, message: 'User created', savedUser }
}

module.exports = { register }
