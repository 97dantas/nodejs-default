const Hoek = require('hoek')
module.exports = ({
    requestRequired: (req, required) => {
        required.map((_, index) => {
            req.assert(required[index], required[index]).notEmpty()
        })
        return req.validationErrors()
    },

    requestOptional: (req, required, Errors) => {
        required.map((key, index) => {
            req.assert(required[index], required[index]).optional().notEmpty()
        })
        return req.validationErrors()
    },

    isAdmin: (req, res, next) =>
        (parseInt(req.user.type_user_id) === 1)
            ? next()
            : res.status(401).json([{title: 'Erro', message: 'Usuário não tem permissão para esse tipo ação!'}]),

    isTerminate: (req, res, next) =>
        (parseInt(req.user.steps) === 5)
            ? next()
            : res.status(401).json([{title: 'Error', message: 'Por favor, termine o cadastro!'}]),

    validateBody: (object, ...body) => returnObject => {
        object = Hoek.merge({}, object)
        body.map(key => {
            if (object[key] !== undefined) returnObject[key] = object[key]
            return returnObject
        })
    },
    isNumber: (number, res, next, Error) => !isNaN(parseInt(number)) ? next() : res.status(400).json([Error]),

    searchQuery: (Model, query) => Model.findOne(query),

    requestOptional: (req, required, Errors) => {
        required.map((key, index) => {
            req.assert(required[index], Errors[key]).optional().notEmpty()
        })
        return req.validationErrors()
    },

    isEmptyObject: (res, Error) => object =>
        new Promise((resolve, reject) => (object) ? resolve(object) : reject(Error)),

    isEmptyObjectNext: (res, next, Error) => object => (object) ? res.status(400).json(Error) : next(),

    isUpload: (file, avatar, next) => (helpRemoveOld) => {
        if (file) helpRemoveOld.remove(avatar)
        next()
    },

    isToken: (token, Error) => new Promise((resolve, reject) => {
        (token) ? resolve(token) : reject(Error)
    }),

    validateToken: (Error, jwt, key) => (token) =>
        new Promise((resolve, reject) => {
            try {
                const decoded = jwt.decode(token, key)
                decoded
                    ? resolve()
                    : reject(Error)
            } catch (err) {
                reject(Error)
            }
        }),
    isLogged: (req, res, next, Error) => (object) => {
        if (object) {
            req.user = object
            next()
        } else {
            res.status(401).json([Error])
        }
    }
})
