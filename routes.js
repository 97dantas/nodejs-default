const PATH = './src/modules/routes'
const fs = require('fs')

const { Logger } = require('./src/helpers/logger-info')
module.exports = app => {
    Logger.info('Loading modules routes express.')
    fs.readdirSync(PATH)
        .filter(f => !f.startsWith('.'))
        .map(el => require(`${PATH}/${el}`)(app))
}
