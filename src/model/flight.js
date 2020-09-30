const { promise } = require('../config/config')
const db = require('../config/config')

const flight = {
  getAll: (sort, typesort, limit, offset) => {
    return new Promise ((resolve, reject) => {
      db.query(`SELECT *,
      (SELECT COUNT (*) FROM v_flight) AS count FROM v_flight 
      ORDER BY ${sort} ${typesort}
      LIMIT ${offset},${limit}`, (err,result)=>{
          if(err){
              reject(new Error(err))
          }else{
              resolve(result)
          }
      })
    })
  },
  getToFromDate: (origin, destination, type_flight, date, class_flight, luggage, meal, wifi, airlines,
    limit,offset) => {
      // console.log(origin, destination, type_flight, date, class_flight, luggage, meal, wifi, airlines,
      //   limit,offset)
      return new Promise ((resolve, reject) => {
        db.query(`SELECT * FROM v_flight 
          WHERE 
          (origin = "${origin}" AND destination = "${destination}" AND date = "${date}" AND class_flight = ${class_flight}) AND 
          ((luggage = ${luggage} OR meal = ${meal} OR wifi = ${wifi}) AND (airlines = ${airlines}))
          
          LIMIT ${offset},${limit}`, (err,result)=>{
            if(err){
                reject(new Error(err))
            }else{
                resolve(result)
                // console.log(result)
            }
        })
      })
  },
  getOne: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM v_flight WHERE id='${id}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  insertFlight: (data) => {
    // console.log(data)
    return new Promise ((resolve, reject) => {
      db.query (`INSERT INTO flight (
          airlines_id,
          origin_city,
          destination_city,
          code,
          type_flight,
          class_flight,
          transit,
          luggage,
          meal,
          wifi,
          date,
          departure,
          arrived,
          price,
          rating,
          total_review
        ) 
        VALUES (
        '${data.airlines_id}',
        '${data.origin_city}',
        '${data.destination_city}',
        '${data.code}',
        '${data.type_flight}',
        '${data.class_flight}',
        '${data.transit}',
        '${data.luggage}',
        '${data.meal}',
        '${data.wifi}',
        '${data.date}',
        '${data.departure}',
        '${data.arrived}',
        '${data.price}',
        '${data.rating}',
        '${data.total_review}'
        )`, (err, result) => {
        if(err){
          reject(new Error(err))
        }else{
            resolve(result)
        }
      })
    })
  },
  updateFlight: (data, id) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
      db.query(`UPDATE flight SET ? WHERE id = ?`, [data, id], (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteFlight: (id) => {
    return new Promise ((resolve, reject) => {
      db.query (`DELETE FROM flight WHERE id = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  }
}

module.exports = flight