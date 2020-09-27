const { promise } = require('../config/config')
const db = require('../config/config')

const airlines = {
  getAll: (name, sort, typesort, limit, offset) => {
      return new Promise ((resolve, reject) => {
        db.query(`SELECT *,
        (SELECT COUNT (*) FROM airlines) AS count FROM airlines 
        WHERE name LIKE '%${name}%' 
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
      db.query(`SELECT * FROM airlines WHERE id='${id}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  insert: (data) => {
    // console.log(data.name)
    // console.log(data.image)
    return new Promise ((resolve, reject) => {
      db.query (`INSERT INTO airlines (name, image) 
      VALUES (
        '${data.name}',
        '${data.image}'
        )`, (err, result) => {
        if(err){
          reject(new Error(err))
        }else{
            resolve(result)
        }
      })
    })
  },
  update: (data, id) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
      db.query(`UPDATE airlines SET ? WHERE id = ?`, [data, id], (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  delete: (id) => {
    return new Promise ((resolve, reject) => {
      db.query (`DELETE FROM airlines WHERE id = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  }
}

module.exports = airlines