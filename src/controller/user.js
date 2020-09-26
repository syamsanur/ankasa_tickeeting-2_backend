const { success, failed, failedReg, failedLog, loginSuccess } = require('../helper/res')
const bcrypt = require('bcrypt')
const userModel = require('../model/users')
const jwt = require("jsonwebtoken");
const env = require('../helper/env')
const nodemailer = require('nodemailer')

const user = {
    register: async (req, res, next) => {
        const data = req.body
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const generate = await bcrypt.hash(password, salt)
        userModel.register(data, generate)
            .then(() => {
                success(res, [], 'please check your email')
                const token = jwt.sign({ email: data.email }, env.SECRETKEY, { expiresIn: 1440 })
                const output = `
                <center><h1>HELLO ${req.body.email}</h1>
                <h3>Thank you for registration</h3>
                <p>You can confirm your email by clicking the link below <br> <a href="${env.HOSTURL}${token}">Activation</a></hp></center>
                `
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: env.USEREMAIL,
                        pass: env.USERPASS
                    }
                });

                let Mail = {
                    from: '"maxmukiper.com" <maxmukiper.com>',
                    to: req.body.email,
                    subject: "Verification Email",
                    text: "Plaintext version of the message",
                    html: output
                };
                transporter.sendMail(Mail)
            }).catch((err) => {
                if (err.message = 'Duplicate entry') {
                    failedReg(res, [], 'User Already Exist')
                }
            })
    },
    verify: (req, res) => {
        const token = req.params.token
        jwt.verify(token, env.SECRETKEY, (err, decode) => {
            if (err) {
                failed(res, [], err.message)
            } else {
                const data = jwt.decode(token)
                const email = data.email
                userModel.update(email).then((result) => {
                    res.render('index', { email })
                }).catch(err => {
                    failed(res, [], err.message)
                })
            }
        })
    },
    login: (req, res) => {
        const body = req.body
        userModel.login(body)
            .then(async (result) => {
                if (!result[0]) {
                    failedLog(res, [], "Email invalid")
                } else {
                    const data = result[0]
                    const pass = data.password
                    const password = req.body.password
                    const isMatch = await bcrypt.compare(password, pass)
                    if (!isMatch) {
                        failedLog(res, [], "Password invalid")
                    } else {
                        const id = result[0].id_user
                        const token_user = result[0].refreshToken
                        const token = jwt.sign({id : id}, env.SECRETKEY, {expiresIn: 3600})
                        const refresh = jwt.sign({id : id}, env.SECRETKEY)
                        if(!token_user){
                            userModel.loginToken(refresh, id)
                                .then((result) => {
                                    loginSuccess(res, token, refreshToken, 'success login')
                                })
                        }else {
                            loginSuccess(res, token, token_user, 'success login')
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
    }
}

module.exports = user