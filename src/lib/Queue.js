require('dotenv/config')
const Queue = require('bull')
const config = require('../config/index')
const jobs = require('../jobs/index')

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, {
    redis: { port: config.redis.port, host: config.redis.host, password: config.redis.pass },
  }),
  name: job.key,
  handle: job.handle,
}))

module.exports = {
  queues,
  add(name, data) {
    const newQueue = this.queues.find((queue) => queue.name === name)
    return newQueue.bull.add(data)
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle)
      queue.bull.on('failed', (job, err) => {
        console.log('job failed', job.data)
        console.log('err', err)
      })
    })
  },
}
