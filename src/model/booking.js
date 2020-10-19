const db = require('../config/config')

const booking = {
    addBook: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO booking (id_user, id_flight, title, fullname, country_id,insurance, payment_status, terminal, gate, child, adults, total, created_at) VALUES('${data.id_user}','${data.id_flight}','${data.title}', '${data.fullname}','${data.id_country}', '${data.insurance}', '${data.payment_status}', '${data.terminal}', '${data.gate}', '${data.child}','${data.adults}', '${data.total}', NOW())`, (err, result) => {
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
            db.query(`SELECT *, (SELECT COUNT (*) FROM booking) AS count FROM v_booking WHERE fullname LIKE 
            '%${name}%' ORDER BY ${sort} ${typesort} LIMIT ${offset},${limit}`, (err, result) => {
                if(err) {
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    },
    getDetail: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM v_booking WHERE booking_id = ${id}`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    },
    update: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE booking SET ? WHERE id = ?`, [data, id], (err, result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    deleteBo: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM booking WHERE id=${id}`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    getUserFlight: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM v_booking WHERE users_id = ${id}`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = booking