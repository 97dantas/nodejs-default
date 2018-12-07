module.exports = app => {
    const Generator = require('../../helpers/generator')(app)
    const Driver = app.datasource.models.Driver
    const Device = app.datasource.models.Device
    const randtoken = require('rand-token')
    const errorSistem = require('../../errors/system')
    const { send } = require('../../helpers/emailAws')
    const { md5 } = require('../../helpers/crypto')

    const cryptoPassword = password => md5(password)
    const isPassword = object => object.password ? cryptoPassword(object.password) : null

    const isPicture = object => object.avatar ? object.file.filename : null

    return {
        create: async (object, type, options) => {
            try {
                object.active = !type ? Generator.active() : ''
                object.type_user_id = type || 2
                object.password = isPassword(object)
                const device = await Device.create({ name: 'init', tokenGcm: 'init', serial: 'init' }, { raw: true })
                object.device_id = device.id
                if (options) {
                    const driver = await Driver.create({ ocuped: false, active: false, accept: false, status: false }, { raw: true })
                    object.driver_id = driver.id
                }
                return Promise.resolve(object)
            } catch (err) {
                console.log('err', err)
                return Promise.reject(errorSistem.dataProcessing)
            }
        },
        forgot: (object) => {
            const Template = require('../../templates/forgot-html')
            object.forgot = randtoken.generate(30)
            const description = 'Esqueci Minha Senha'
            send(object, Template, description)
            return object
        },
        forgotUpdate: (object) => {
            object.password = isPassword({ password: object.password1 })
            return object
        },
        update: (object) => {
            try {
                const validatePassword = isPassword(object)
                if (validatePassword !== null) object.password = validatePassword
                const validatePicture = isPicture(object)
                if (validatePicture !== null) object.avatar = validatePicture
                return Promise.resolve(object)
            } catch (err) {
                return Promise.reject(errorSistem.tratmentUpdateUser)
            }
        }
    }
}
