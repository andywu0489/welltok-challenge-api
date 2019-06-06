const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const userRoutes = require('./app/routes/user_routes')
const articleRoutes = require('./app/routes/article_routes')

const errorHandler = require('./lib/error_handler')

const db = require('./config/db')

const dotenv = require('dotenv')
dotenv.config()

if (process.env.TESTENV) {
  process.env.KEY = process.env.SECRET_KEY_BASE_TEST
} else if (!process.env.KEY) {
  process.env.KEY = process.env.SECRET_KEY_BASE_DEVELOPMENT
}

const auth = require('./lib/auth')

mongoose.Promise = global.Promise
mongoose.connect(db, {
  useMongoClient: true
})

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:7165' }))

const port = process.env.PORT || 4741

app.use((req, res, next) => {
  if (req.headers.authorization) {
    const auth = req.headers.authorization
    req.headers.authorization = auth.replace('Token token=', 'Bearer ')
  }
  next()
})

app.use(auth)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRoutes)
app.use(articleRoutes)

app.use(errorHandler)

app.listen(port, () => {
  console.log('listening on port ' + port)
})

module.exports = app
