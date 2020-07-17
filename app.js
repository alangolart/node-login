const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const config = require('./src/config/index')
const database = require('./src/config/database')

const notFound = require('./src/middlewares/notFound')
const errorHandler = require('./src/middlewares/errorHandler')

const userRoute = require('./src/routes/userRoutes.js')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
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
