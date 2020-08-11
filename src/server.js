const setupApp = require('./app')
const config = require('./config/index')

async function startServer() {
  try {
    const app = await setupApp()
    const server = app.listen(config.server.port || 3030)
    console.log(`🚀 Listening on port ${config.server.port}`)
    const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT']
    exitSignals.map((sig) =>
      process.on(sig, () =>
        server.close((err) => {
          if (err) {
            console.error(err)
            process.exit(1)
          }
          app.database.connection.close(function () {
            console.info('Database connection closed!')
            process.exit(0)
          })
        })
      )
    )
  } catch (error) {
    console.error(error)
  }
}
startServer()
