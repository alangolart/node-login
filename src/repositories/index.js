const User = require('../models/User')

async function findEmail(email) {
  return User.findOne({ email })
}
async function findUserSecondStep(email, sixDigitCode) {
  return User.findOne({
    email,
    secondStepCode: sixDigitCode,
    secondStepCodeExpiration: { $gt: Date.now() },
  })
}
async function findUserById(userId) {
  return User.findOne({ _id: userId })
}
async function createUser(user) {
  return User.create(user)
}
async function updateConfirmedEmail(userId) {
  return User.findOneAndUpdate({ _id: userId }, { confirmedEmail: true })
}
async function saveUser(user) {
  return user.save()
}

module.exports = {
  findEmail,
  findUserSecondStep,
  findUserById,
  createUser,
  saveUser,
  updateConfirmedEmail,
}
