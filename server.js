const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const setupApp = require('./app')
const config = require('./src/config/index')

async function startServer() {
  try {
    const app = await setupApp()
    if (cluster.isMaster) {
      console.log(`Master ${process.pid} is running`)
      for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork()
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
      })
    } else {
      app.listen(config.server.port || 3030)
      console.log(`🚀 Listening on port ${config.server.port}`)
      console.log(`Worker ${process.pid} started`)
    }
  } catch (error) {
    console.error(error)
  }
}
startServer()
