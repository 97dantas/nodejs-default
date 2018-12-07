module.exports = app => {
    const url = `${process.env.API_VERSION}/users`
    const { isAdmin } = require('../../helpers/validate')
    const Controller = require('../controllers/user')(app)
    const Validate = require('../validates/user')(app)

    const { isTerminate } = require('../../helpers/validate')

    app.route(`${url}/count`)
        .get(app.jwt, isAdmin, isTerminate, Controller.countUser)

    app.route(`${url}/driver`)
        .post(Validate.create, Validate.isPasswordEqual, Validate.emailIsExist, Controller.createDriver)

    app.route(`${process.env.API_VERSION}/me`)
        .get(app.jwt, Controller.me)

    app.route(url)
        .get(app.jwt, isAdmin, isTerminate, Controller.listAll)
        .post(Validate.create, Validate.emailIsExist, Validate.isPasswordEqual, Controller.create)

    app.route(`${url}/forgot`)
        .post(Validate.isEmail, Validate.forgot, Controller.forgot)

    app.route(`${url}/confirm/email/:active`)
        .get(Validate.isCode, Validate.isCodeValide, Controller.confirmEmail)

    app.route(`${url}/forgot/:forgot`)
        .get(Validate.isForgot, Validate.isForgot)
        .post(Validate.isForgot, Validate.isPasswords, Validate.isPasswordEqual, Controller.forgotUpdate)

    app.route(`${url}/:id`)
        .get(app.jwt, isTerminate, Controller.listOne)
        .put(app.jwt, isTerminate, Validate.update, Controller.update)
        .delete(app.jwt, isTerminate, Validate.isId, isAdmin, Controller.remove)
}

