
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logError = new Schema({
    url: { type: String, required: true, index: true },
    method: { type: String, required: true, index: true },
    message: { type: String, required: true },
    stack: {},
    body: {}
}, {
    timestamps: true
})

module.exports = mongoose.model('LogError', logError)
