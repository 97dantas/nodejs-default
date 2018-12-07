require('dotenv').load()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const validator = require('express-validator')
require('./src/databases/mongodb')

const { Logger } = require('./src/helpers/logger-info')

const validateFormat = require('./src/errors/validate')

const { RegisterError } = require('./src/helpers/errorLog')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ limit: '3mb' }))
app.use(cors())
app.use(validator(validateFormat))
app.use(morgan('combined'))
app.use(compression())
app.use(helmet())
app.disable('x-powered-by')

const datasource = require('./src/databases/mysql')
app.datasource = datasource(app)
app.jwt = require('./src/helpers/jwt')(app).validate

const port = process.env.PORT || 3000

require('./routes')(app)

app.use(RegisterError)

app.listen(port, () => Logger.info(`Server start in port: http://localhost:${port}`))
