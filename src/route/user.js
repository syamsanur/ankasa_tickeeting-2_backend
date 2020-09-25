const express = require('express')
const route = express.Router()
const { register, verify } = require('../controller/user')
const { userValidator, validationUser } = require('../helper/validator')

route.post('/register', userValidator(), validationUser, register)
route.get('/verification/:token', verify)

module.exports = route