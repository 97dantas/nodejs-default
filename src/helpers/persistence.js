const returnObject = require('./returnObject')

module.exports = Model => ({
    create: (res, next) => (data) =>
        Model.create(data)
            .then(returnObject.sucessCreate(res))
            .catch(returnObject.error(next)),

    count: (res, next) => (data) =>
        Model.count(data)
            .then(returnObject.sucessCreate(res))
            .catch(returnObject.error(next)),

    update: (res, next) => query => mod =>
        Model.update(mod, query)
            .then(returnObject.returnUpdate(res))
            .catch(returnObject.error(next)),

    listOne: (res, next) => (query) =>
        Model.findOne(query)
            .then(returnObject.findSuccess(res))
            .catch(returnObject.error(next)),

    listAll: (res, next) => (query) =>
        Model.findAll(query)
            .then(returnObject.findAllSuccess(res))
            .catch(returnObject.error(next)),

    increment: (res, next) => query => option => mod =>
        Model.increment([option], { by: mod, where: query })
            .then(returnObject.returnTransaction(res))
            .catch(returnObject.error(next)),

    removeMongo: (res, next) => (query) =>
        Model.remove(query)
            .then(returnObject.deleteSucess(res))
            .catch(returnObject.error(next)),

    remove: (res, next) => (query) =>
        Model.destroy(query)
            .then(returnObject.deleteSucess(res))
            .catch(returnObject.error(next)),

    listAllPaginated: (res, next) => (query, pages) => {
        const HelperPaginate = require('./paginate')(Model)
        HelperPaginate.countAll(pages, query)
            .then(HelperPaginate.listAll(query))
            .then(returnObject.findAllSuccess(res))
            .catch(returnObject.error(next))
    }
})
