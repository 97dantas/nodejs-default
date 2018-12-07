module.exports = (app) => {
    const jwt = require('jsonwebtoken')
    const key = process.env.TOKEN_SECRET
    const Errors = require('../errors/system')
    const { isToken, searchQuery, isLogged, validateToken } = require('./validate')
    const User = app.datasource.models.User
    return {
        validate: (req, res, next) => {
            const token = req.headers['token']
            const query = {
                where: {
                    token: token
                },
                raw: true
            }
            isToken(token, Errors.tokenRequired)
                .then(validateToken(Errors.tokenUser, jwt, key, isToken))
                .then(() => searchQuery(User, query))
                .then(isLogged(req, res, next, Errors.tokenUser))
                .catch(err => res.status(401).json([err]))
        }
    }
}
