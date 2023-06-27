const express = require('express')
const route = express.Router()

route.use('/auth', require('./auth'))
route.use('/user', require('./user'))

module.exports = route