module.exports = app => {
    const Errors = require('../../errors/system')
    const Validate = require('../../helpers/validate')
    const Help = require('../../helpers/authenticate')
    const User = app.datasource.models.User
    const { update } = require('../../helpers/persistence')(User)
    const Business = require('../services/authenticate')(app)
    return {
        authenticate: Help.authenticate(User, Validate, Business, Errors),
        logout: (req, res, next) => update(res, next)({ where: { id: req.user.id, email: req.user.email } })({ token: null })
    }
}
