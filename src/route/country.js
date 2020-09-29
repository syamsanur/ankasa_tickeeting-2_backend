const express = require('express')
const route = express.Router()
const { getAll, getOne, insertCountry, updateCountry, deleteCountry } = require('../controller/country')

route.get('/getall', getAll)
route.get('/getone/:id', getOne)
route.post('/insert', insertCountry)
route.patch('/update/:id', updateCountry)
route.delete('/delete/:id', deleteCountry)

module.exports = route

