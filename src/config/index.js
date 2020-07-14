require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

module.exports = {
  secret: process.env.APP_SECRET,
  env: process.env.NODE_ENV,
  server: {
    host: process.env.HOST,
    port: process.env.SERVER_PORT,
  },
  firstStepToken: process.env.FIRST_STEP_SECRET,
  token: process.env.JWT_SECRET,
  db: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASS,
  },
  salt: process.env.SALT_ROUNDS,
  databaseURL: process.env.DATABASE_URI,
  emailSecret: process.env.EMAIL_SECRET,
  emailFrom: process.env.EMAIL_FROM,
  resetEmailSecret: process.env.RESETEMAIL_SECRET,
  sendgridToken: process.env.SENDGRID_API_KEY,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    number: process.env.TWILIO_NUMBER,
    token: process.env.TWILIO_TOKEN,
  },
}
