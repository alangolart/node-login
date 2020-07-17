const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const config = require('../config/index')

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
async function verifyToken(token, tokenSecret) {
  return jwt.verify(token, tokenSecret)
}

module.exports = {
  sendEmail,
  hashPassword,
  generateEmailToken,
  verifyToken,
}
