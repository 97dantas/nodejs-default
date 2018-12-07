module.exports = app => {
    const User = app.datasource.models.User
    const Driver = app.datasource.models.Driver
    const TypeUser = app.datasource.models.TypeUser
    const Category = app.datasource.models.Category
    const Device = app.datasource.models.Device
    const Vehicle = app.datasource.models.Vehicle
    const ScoreDriver = app.datasource.models.ScoreDriver
    const ScoreUser = app.datasource.models.ScoreUser
    const { create, listOne, update, listAllPaginated, count } = require('../../helpers/persistence')(User)
    const Business = require('../services/user')(app)
    const Validate = require('../../helpers/validate')
    return {
        countUser: async (req, res, next) => {
            try {
                count(res, next)({ where: {} })
            } catch (err) {
                next(err)
            }
        },
        create: async (req, res, next) => {
            try {
                const body = {}
                Validate.validateBody(req.body, 'name', 'email', 'password1', 'password2', 'phone')(body);
                body.password = body.password1
                body.steps = 5
                const business = await Business.create(body, null, false);
                create(res, next)(business)
            } catch (err) {
                next(err)
            }
        },
        createDriver: async (req, res, next) => {
            try {
                const body = {}
                Validate.validateBody(req.body, 'name', 'email', 'password1', 'password2', 'phone')(body)
                body.password = body.password1
                const business = await Business.create(body, null, true)
                create(res, next)(business)
            } catch (err) {
                next(err)
            }
        },
        isForgot: (_, res) => {
            res.status(200).json()
        },
        forgotUpdate: (req, res, next) => {
            update(res, next)({ where: { forgot: req.params.forgot } })({ forgot: null, password: Business.forgotUpdate(req.body).password })
        },
        forgot: async (req, res, next) => {
            try {
                const user = await User.findOne({ where: { email: req.body.email.toLowerCase() } })
                const object = Business.forgot(user)
                update(res, next)({ where: { email: req.body.email } })({ forgot: object.forgot })
            } catch (err) {
                next(err)
            }
        },
        confirmEmail: (req, res, next) => {
            update(res, next)({ where: { active: req.params.active } })({ active: '', status: true })
        },
        me: (req, res, next) => listOne(res, next)({
            where: { id: req.user.id },
            attributes: ['id', 'name', 'email', 'avatar', 'phone', 'created_at', 'type_user_id', 'steps'],
            include: [{
                model: TypeUser,
                attributes: ['id', 'name', 'alias']
            }, {
                model: Device,
                attributes: ['id', 'name', 'tokenGcm', 'serial']
            }, {
                model: Vehicle
            }, {
                model: ScoreUser,
                attributes: [[ScoreDriver.sequelize.literal('format(avg(ScoreUsers.star), 1)'), 'star']]
            }, {
                model: Driver,
                attributes: ['id', 'status', 'active', 'accept', 'location'],
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name']
                    },
                    {
                        model: ScoreDriver,
                        attributes: [[ScoreDriver.sequelize.literal('format(avg(`Driver->ScoreDrivers`.`star`), 1)'), 'driver_star']]
                    }
                ]
            }]
        }),

        update: async (req, res, next) => {
            try {
                const body = {}
                const query = { where: { id: parseInt(req.user.type_user_id) === 1 ? req.params.id : req.user.id } }
                Validate.validateBody(req.body, 'name', 'email', 'phone', 'password', 'avatar')(body)
                const business = await Business.update(body)
                update(res, next)(query)(business)
            } catch (err) {
                next(err)
            }
        },
        listAll: (req, res, next) =>
            listAllPaginated(res, next)({
                where: { status: true },
                attributes: { exclude: ['password', 'token', 'forgot', 'avatar'] },
                include: { all: true }
            }, req.query.page || 1),
        listOne: (req, res, next) => listOne(res, next)({
            where: parseInt(req.user.type_user_id) === 1
                ? { id: req.params.id }
                : { user_id: req.user.id, id: req.params.id }
        }),
        remove: (req, res, next) => update(res, next)({ where: { id: req.params.id } })({ status: false, token: '' })
    }
}
