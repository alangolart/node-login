const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const config = require('./config/index')
const database = require('./config/database')

const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const userRoute = require('./routes/userRoutes.js')
const authRoute = require('./routes/authRoutes.js')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
})

const configureExpress = () => {
  const app = express()
  app.use(express.json())
  app.use(morgan('common'))
  app.use(helmet())
  app.use(limiter)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  })
  app.use('/user', userRoute)
  app.use('/auth', authRoute)
  app.use(notFound)
  app.use(errorHandler)
  app.database = database
  return app
}

module.exports = async () => {
  const app = configureExpress()
  await app.database.connect()
  console.log(`Connected to DB: ${config.db.name}`)
  return app
}
