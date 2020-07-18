const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const config = require('../config/index')
const redisClient = require('../config/redis')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.sendgridToken,
    },
  })
)

async function sendEmail(emailTo, subject, body) {
  return transporter.sendMail({
    to: emailTo,
    from: config.emailFrom,
    subject,
    html: body,
  })
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}
async function generateEmailToken(savedUser) {
  return jwt.sign(
    {
      user: savedUser.id,
    },
    config.emailSecret,
    {
      expiresIn: '1d',
    }
  )
}
async function generateResetPasswordToken(user) {
  return jwt.sign(
    {
      user: user.id,
    },
    config.resetEmailSecret,
    {
      expiresIn: '1d',
    }
  )
}
async function verifyToken(token, tokenSecret) {
  return jwt.verify(token, tokenSecret)
}
async function checkRedisInvalidToken(list, token) {
  const redisList = await redisClient.lrange(list, 0, 999999999)
  if (redisList.indexOf(token) > -1) {
    return { status: 400, error: 'Invalid Token' }
  }
  return null
}
async function insertRedisList(list, token) {
  return redisClient.lpush(list, token)
}

module.exports = {
  sendEmail,
  hashPassword,
  generateEmailToken,
  generateResetPasswordToken,
  verifyToken,
  checkRedisInvalidToken,
  insertRedisList,
}
