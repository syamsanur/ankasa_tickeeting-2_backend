const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const db = require('./src/config/config')
const users = require('./src/route/user')
const airlines = require('./src/route/airlines')
const flight = require('./src/route/flight')
const booking = require('./src/route/booking')
const country = require('./src/route/country')
const path = require('path')
const ejs = require('ejs')
const cors = require('cors')

db.connect((err) => {
    if(err) throw err
    console.log(`connect database`);
})

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(cors())
app.use(express.static('src/img'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user', users)
app.use('/airlines', airlines)
app.use('/flight', flight)
app.use('/booking', booking)
app.use('/country', country)


app.listen(port,()=> {
    console.log(`Server running at port ${port}`)
})