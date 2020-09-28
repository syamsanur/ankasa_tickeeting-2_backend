const express = require('express')
const route = express.Router()
const { addBooking, getAll, getDetail, updateBooking, deleteBooking } = require('../controller/booking')

route.post('/add', addBooking)
route.get('/getAll', getAll)
route.get('/detail/:id', getDetail)
route.patch('/edit/:id', updateBooking)
route.delete('/delete/:id', deleteBooking)

module.exports = route