const express = require('express')
const route = express.Router()
const { addCity, getAll, getOne, updateCity, deleteCity } = require('../controller/city')
const upload = require ('../helper/upload')

route.post('/add', addCity)
route.get('/getAll', getAll)
route.get('/getOne/:id', getOne)
route.patch('/edit/:id',upload.single("image"), updateCity)
route.delete('/delete/:id', deleteCity)

module.exports = route