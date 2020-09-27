const { promise } = require('../config/config')
const db = require('../config/config')

const user = {
    register: (data, generate, image) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (fullname, email, password, image) VALUES('${data.fullname}', '${data.email}', '${generate}', '${image}')`, (err, result) => {
                if(err){
                    reject(err)
                }else {
                    resolve(result)
                }
            })
        })
    },
    update: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET status= 1 WHERE email='${email}'`, (err, result) => {
               if (err) {
                  reject(new Error(err))
               } else {
                  resolve(result)
               }
            })
         })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = ?`,data.email, (err, result) => {
                if(err) {
                    reject(err)
                }else {
                    resolve(result)
                }
            })
        })
    },
    loginToken: (token,id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE user_reg SET refreshToken='${token}' WHERE id_user=${id}`, (err, result) => {
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
            db.query(`SELECT * FROM users WHERE id_user=${id}`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    },
    updateUser: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET ? WHERE id_user = ${id}`,[data, id], (err, result) => {
                if(err){
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    },
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE id_user=${id}`, (err,result) => {
                if(err){
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = user