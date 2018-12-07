const crypto = require('./crypto')

module.exports.authenticate = (User, Validate, Business, Errors) =>
    (req, res) => {
        const exclude = [
            'password',
            'created_at',
            'updated_at',
            'token',
            'forgot'
        ]
        const query = {
            attributes: {
                exclude
            },
            where: {
                email: req.body.email,
                password: crypto.md5(req.body.password)
            }
        }

        Validate.searchQuery(User, query)
            .then(Validate.isEmptyObject(res, Errors.notAuthorization))
            .then(Business.authenticate(res))
            .catch(err => res.status(401).json([err]))
    }
