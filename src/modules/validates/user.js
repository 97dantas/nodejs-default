module.exports = app => {
    const Errors = require('../../errors/user')
    const User = app.datasource.models.User
    const { requestRequired, searchQuery, isNumber, requestOptional } = require('../../helpers/validate')
    return {
        create: (req, res, next) => {
            const required = ['email', 'password1', 'password2', 'name', 'phone']
            const error = requestRequired(req, required)
            error ? res.status(400).json(error) : next()
        },

        emailIsExist: (req, res, next) => {
            searchQuery(User, { where: { email: req.body.email }, raw: true })
                .then(model => model === null ? next() : res.status(400).json([Errors.emailExist]))
                .catch(err => next(err))
        },
        cpfExist: (req, res, next) => {
            searchQuery(User, { where: { cpf: req.body.cpf }, raw: true })
                .then(model => model ? res.status(400).json([Errors.cpfExist]) : next())
                .catch(err => next(err))
        },
        isCodeValide: (req, res, next) => {
            searchQuery(User, { where: { active: req.params.active } })
                .then(model => !model ? res.status(400).json([Errors.activeInvalid]) : next())
                .catch(err => next(err))
        },
        isEmail: (req, res, next) => {
            const required = ['email']
            const error = requestRequired(req, required)
            error ? res.status(400).json(error) : next()
        },
        isPasswords: (req, res, next) => {
            const required = ['password1', 'password2']
            const error = requestRequired(req, required)
            error ? res.status(400).json(error) : next()
        },
        isPasswordEqual: (req, res, next) => {
            (req.body.password1 === req.body.password2)
                ? next() : res.status(400).json([Errors.notPasswordEqual])
        },
        isForgot: (req, res, next) => {
            searchQuery(User, { where: { forgot: req.params.forgot }, raw: true })
                .then(model => model == null ? res.status(400).json([Errors.forgotNotExist]) : next())
                .catch(err => next(err))
        },
        forgot: (req, res, next) => {
            searchQuery(User, { where: { email: req.body.email.toLowerCase() }, raw: true })
                .then(model => model == null ? res.status(400).json([Errors.emailNotExist]) : next())
                .catch(err => next(err))
        },
        update: (req, res, next) => {
            const required = ['password', 'name', 'phone', 'avatar']
            const error = requestOptional(req, required)
            error ? res.status(400).json(error) : next()
        },
        isCode: (req, res, next) => isNumber(parseInt(req.params.active), res, next, Errors.activee),
        isId: (req, res, next) => isNumber(req.params.id, res, next, Errors.idNotValid)
    }
}
