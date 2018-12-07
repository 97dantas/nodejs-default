const Error = require('../errors/persistence')

module.exports = ({
    sucessCreate: res => data => res.status(201).json(data),
    error: next => data => next(data),
    returnUpdate: res => _ => res.status(200).json(Error.sucessUpdate),
    findSuccess: res => data => res.status(200).json(data),
    deleteSucess: res => _ => res.status(200).json(Error.sucessDelete),
    findAllSuccess: res => data => res.status(200).json(data),
    returnTransaction: res => data => res.status(200).json(Error.transaction)
})
