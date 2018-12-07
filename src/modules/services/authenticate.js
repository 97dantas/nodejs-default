module.exports = app => {
    const { token } = require('../../helpers/generator')(app)
    const Errors = require('../../errors/system')
    const Users = app.datasource.models.User

    const isUpdate = (tokenGenerator, res) => (object) => (object[0])
        ? res.status(200).json(tokenGenerator)
        : res.status(401).json([Errors.dataProcessing])

    return {
        authenticate: (res) => async (object) => {
            try {
                const payload = { id: object.id, name: object.name, master: object.master }
                const tokenGenerator = {
                    token: token(payload),
                    steps: object.steps
                }
                const query = {where: {id: object.id}}
                const mod = {token: tokenGenerator.token}
                const update = await Users.update(mod, query)
                isUpdate(tokenGenerator, res)(update)
            } catch (err) {
                console.log('err', err)
                res.status(401).json([Errors.dataProcessing])
            }
        }
    }
}
