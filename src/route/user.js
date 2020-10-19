const express = require('express')
const route = express.Router()
const { register, verify, login, updateUser, getUser, deleteUser, refreshToken, getAll, resetPass, confirmPass } = require('../controller/user')
const { userValidator, validationUser } = require('../helper/validator')
const upload = require ('../helper/upload')
const { authentication, authorization } = require('../helper/auth')

route.post('/register', userValidator(), validationUser, register)
route.post('/login', login)
route.get('/verification/:token', verify)
route.post('/reset-pass', resetPass)
route.post('/reset-confirm', confirmPass)

route.patch('/edit/:id',authentication, authorization, updateUser)
route.get('/getOne/:id',authentication, authorization, getUser)
route.delete('/delete/:id',authentication, authorization ,deleteUser)
route.post('/refresh',authentication, authorization ,refreshToken)
route.get('/', authentication, authorization, getAll)


module.exports = route