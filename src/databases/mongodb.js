const mongoose = require('mongoose')
const promiseLibrary = require('bluebird')

const { Logger } = require('../helpers/logger-info')

const url = process.env.MONGODB_HOST

mongoose.connection.on('connected', () => {
    Logger.info('Mongoose connected = )')
})

mongoose.connection.on('error', (err) => {
    Logger.warn(`Error connecting to database: ${err}`)
})

mongoose.connection.on('disconnected', () => {
    Logger.info('Disconnecting from database')
})

// Connecting to mongoose
mongoose.connect(url, {
    poolSize: 36,
    bufferMaxEntries: 0,
    bufferCommands: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    promiseLibrary
})
