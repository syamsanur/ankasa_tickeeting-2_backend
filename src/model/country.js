const { promise } = require('../config/config')
const db = require('../config/config')

const country = {
  getAll: (sort, typesort, limit, offset) => {
    return new Promise ((resolve, reject) => {
      db.query(`SELECT *,
      (SELECT COUNT (*) FROM country) AS count FROM country 
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
  getOne: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM country WHERE id='${id}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  insertCountry: (data) => {
    // console.log(data)
    return new Promise ((resolve, reject) => {
      db.query (`INSERT INTO country (
          name
        ) 
        VALUES (
        '${data.name}'
        )`, (err, result) => {
        if(err){
          reject(new Error(err))
        }else{
            resolve(result)
        }
      })
    })
  },
  updateCountry: (data, id) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
      db.query(`UPDATE country SET ? WHERE id = ?`, [data, id], (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteCountry: (id) => {
    return new Promise ((resolve, reject) => {
      db.query (`DELETE FROM country WHERE id = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  }
}

module.exports = country