module.exports = app => {
    const url = `${process.env.API_VERSION}/authenticate`
    const { authenticate, logout } = require('../controllers/authenticate')(app)
    const { authenticate: validateAuthenticate } = require('../validates/authenticate')(app)

    const { isTerminate, isAdmin } = require('../../helpers/validate')

    app.route(`${url}`)
        .post(validateAuthenticate, authenticate)

    app.route(`${url}/logout`)
        .get(app.jwt, isTerminate, isAdmin, logout)
}
