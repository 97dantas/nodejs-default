const error = require('../errors/returnErrors')

module.exports = {
    errorFormatter: (param) => {
        return error(param)
    }
}
