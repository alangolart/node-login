const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

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
  return app
}

module.exports = async () => {
  const app = configureExpress()
  return app
}
