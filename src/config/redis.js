const Redis = require('ioredis')
const config = require('./index')

const redisClient = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.pass,
})

redisClient.on('connect', () => {
  console.log(`Redis client connected to Redis host: ${config.redis.host}`)
})
redisClient.on('error', (error) => {
  console.log('Redis not connected', error)
})

module.exports = redisClient
