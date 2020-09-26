const { promise } = require('../config/config')
const db = require('../config/config')

const user = {
    register: (data, generate) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO user_reg (fullname, email, password) VALUES('${data.fullname}', '${data.email}', '${generate}')`, (err, result) => {
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
            db.query(`UPDATE user_reg SET status= 1 WHERE email='${email}'`, (err, result) => {
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
            db.query(`SELECT * FROM user_reg WHERE email = ?`,data.email, (err, result) => {
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
    }
}

module.exports = user