const express = require('express')
const route = express.Router()
const { getAll, insertAirlines, updateAirlines, getOne, deleteAirlines } = require('../controller/airlines')
const upload = require ('../helper/upload')

route.get('/getall', getAll)
route.get('/getone/:id', getOne)
route.post('/insert', insertAirlines)
route.patch('/update/:id', upload.single("image"), updateAirlines)
route.delete('/delete/:id', deleteAirlines)

module.exports = route

