const express = require('express')
const route = express.Router()
const { getAll, insertFlight, getOne, getToFromDate, updateFlight, deleteFlight } = require('../controller/flight')
const upload = require ('../helper/upload')

route.get('/getall', getAll)
route.get('/getflight', getToFromDate)
route.get('/getone/:id', getOne)
route.post('/insert', insertFlight)
route.patch('/update/:id', updateFlight)
route.delete('/delete/:id', deleteFlight)

module.exports = route

