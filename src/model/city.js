const db = require('../config/config')

const city = {
    addCity: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO city (name, image, country_id) VALUES ('${data.name}','${data.image}', '${data.country_id}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll: (name, sort, typesort, limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT *, (SELECT COUNT (*) FROM city) AS count FROM city WHERE name LIKE '%${name}%' ORDER BY ${sort} ${typesort} LIMIT ${offset},${limit}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getOne: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM city WHERE id='${id}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE city SET ? WHERE id = ?`, [data, id], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM city WHERE id = ${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = city