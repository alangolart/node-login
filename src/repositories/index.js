const User = require('../models/User')

async function findEmail(email) {
  return User.findOne({ email })
}

async function createUser(user) {
  return User.create(user)
}

module.exports = {
  findEmail,
  createUser,
}
