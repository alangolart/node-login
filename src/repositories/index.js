const User = require('../models/User')

async function findEmail(email) {
  return User.findOne({ email })
}

async function createUser(user) {
  return User.create(user)
}
async function updateConfirmedEmail(userId) {
  return User.findOneAndUpdate({ _id: userId }, { confirmedEmail: true })
}

module.exports = {
  findEmail,
  createUser,
  updateConfirmedEmail,
}
