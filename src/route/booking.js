const express = require('express')
const route = express.Router()
const { addBooking, getAll, getDetail, updateBooking, deleteBooking } = require('../controller/booking')
const { authentication, authorization, admin } = require('../helper/auth')

route.post('/add', authentication, authorization, addBooking)
route.get('/getAll',authentication, authorization, getAll)
route.get('/detail/:id', authentication, authorization,  getDetail)
route.patch('/edit/:id',authentication, authorization,  updateBooking)
route.delete('/delete/:id',authentication, authorization, deleteBooking)

module.exports = route