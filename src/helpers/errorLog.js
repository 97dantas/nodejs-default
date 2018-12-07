
const LogError = require('../modules/schema/logError')

module.exports.RegisterError = async (err, req, res, next) => {
    try {
        await LogError.create({
            url: req.url,
            method: req.method,
            message: err.message,
            stack: new Error(err).stack,
            body: req.body,
            user: req.user || {}
        })
        res.status(500).json([{ title: 'Internal Error', message: err.message }])
    } catch (err) {
        res.status(500).json([{ title: 'Internal Error', message: 'Internal Error' }])
    }
}
