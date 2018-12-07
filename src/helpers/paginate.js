
const configPageLimit = parseInt(process.env.PAGINATE_LIMIT)

const PaginatePrepareQuery = (page, resolve) => data => {
    resolve({
        pages: Math.ceil(data / configPageLimit),
        offset: configPageLimit * ((page || 1) - 1),
        limit: configPageLimit,
        count: data
    })
}

const queryListAll = query => pages => Object.assign(query, { limit: pages.limit, offset: pages.offset, $sort: { id: 1 } })

module.exports = (Model) => ({
    countAll: (page, query) => new Promise((resolve, reject) => {
        Model.count(query)
            .then(PaginatePrepareQuery(page, resolve))
            .catch(reject)
    }),

    listAll: query => pages => new Promise((resolve, reject) =>
        Model.findAll(queryListAll(query)(pages))
            .then(model => resolve({ data: model, count: pages.count, pages: pages.pages }))
            .catch(reject))
})
