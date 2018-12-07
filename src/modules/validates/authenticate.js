module.exports = app => {
    const Errors = require('../../errors/authenticate')
    const User = app.datasource.models.User
    const { requestRequired, searchQuery } = require('../../helpers/validate')
    return {
        authenticate: (req, res, next) => {
            const required = ['email', 'password']
            const error = requestRequired(req, required)
            error ? res.status(400).json(error) : next()
        },
        isValidate: (req, res, next) => {
            searchQuery(User, { where: { email: req.body.email, status: false }, raw: true })
                .then(model => model ? res.status(400).json([Errors.loading]) : next())
                .catch(err => next(err))
        },
        isAuthenticateActive: (req, res, next) => {
            searchQuery(User, { where: { status: true, email: req.body.email } })
                .then(model => !model ? res.status(400).json([Errors.userBlock]) : next())
                .catch(err => next(err))
        }
    }
}
