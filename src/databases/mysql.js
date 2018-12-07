const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

let database = null

const { Logger } = require('../helpers/logger-info')

const loadModels = (sequelize) => {
    const dir = path.join(__dirname, '../modules/models')
    const models = []
    fs.readdirSync(dir).forEach((file) => {
        const modelDir = path.join(dir, file)
        const model = sequelize.import(modelDir)
        models[model.name] = model
    })

    Object.keys(models).forEach(function (object) {
        if ('associate' in models[object]) {
            models[object].associate(models)
        }
    })
    Logger.info('Loading modules database mysql')
    return models
}

module.exports = (app) => {
    if (!database) {
        const sequelize = new Sequelize(
            process.env.MYSQL_DATABASE,
            process.env.MYSQL_USER,
            process.env.MYSQL_PASSWORD,
            {
                host: process.env.MYSQL_HOST,
                dialect: 'mysql',
                logging: false,
                timezone: '-03:00',
                operatorsAliases: false,
                pool: {
                    max: 5,
                    min: 0,
                    evict: 10000,
                    acquire: 10000,
                    maxIdleTime: 30,
                    handleDisconnects: true
                },
                define: {
                    underscored: true
                },
                retry: {
                    max: 5
                }
            })
        database = {
            sequelize,
            Sequelize,
            models: {}
        }
        Logger.info('synchronize modules in database mysql')
        database.models = loadModels(sequelize)
        sequelize.sync().done(() => database)
    }
    return database
}
