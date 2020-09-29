const express = require('express')
const route = express.Router()
const { register, verify, login, updateUser, getUser, deleteUser, refreshToken, getAll, resetPass, confirmPass } = require('../controller/user')
const { userValidator, validationUser } = require('../helper/validator')
const upload = require ('../helper/upload')

route.post('/register', userValidator(), validationUser, register)
route.post('/login', login)
route.get('/verification/:token', verify)
route.patch('/edit/:id', upload.single("image"), updateUser)
route.get('/getOne/:id', getUser)
route.delete('/delete/:id', deleteUser)
route.post('/refresh', refreshToken)
route.get('/', getAll),
route.post('/reset-pass', resetPass)
route.post('/reset-confirm', confirmPass)

module.exports = route