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
}

module.exports = user