const setupApp = require('./app')
const config = require('./src/config/index')

async function startServer() {
  try {
    const app = await setupApp()
    app.listen(config.server.port || 3039)
    console.log(`🚀 Listening on port ${config.server.port}`)
  } catch (error) {
    console.error(error)
  }
}
startServer()
