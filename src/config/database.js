const mongoose = require('mongoose')
const config = require('./index')

const MONGODB_URI = `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.name}?authSource=admin`

const connect = () =>
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

const close = () => mongoose.connection.close()

module.exports = { connect, close, connection: mongoose.connection }
