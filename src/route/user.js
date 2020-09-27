const express = require('express')
const route = express.Router()
const { register, verify, login, updateUser, getUser } = require('../controller/user')
const { userValidator, validationUser } = require('../helper/validator')
const upload = require ('../helper/upload')

route.post('/register', userValidator(), validationUser, register)
route.post('/login', login)
route.get('/verification/:token', verify)
route.patch('/edit/:id', updateUser)
route.get('/getOne/:id', getUser)

module.exports = route