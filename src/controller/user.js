const { success, failed, failedReg, failedLog, loginSuccess, successWithMeta } = require('../helper/res')
const bcrypt = require('bcrypt')
const userModel = require('../model/users')
const jwt = require("jsonwebtoken");
const env = require('../helper/env')
const nodemailer = require('nodemailer')
const upload = require('../helper/upload')
const fs = require('fs');
const sendMail = require('../helper/Mail')

const user = {
    register: async (req, res, next) => {
        try {
            const data = req.body
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const generate = await bcrypt.hash(password, salt)
            const img = "404P.png"
            userModel.register(data, generate, img)
                .then(() => {
                    const email = data.email
                    success(res, [], 'Please check your email to activation')
                    const token = jwt.sign({ email: data.email }, env.SECRETKEY)
                    sendMail(email, token)
                }).catch((err) => {
                    if (err.message = 'Duplicate entry') {
                        failedReg(res, [], 'User Already Exist')
                    }
                })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    verify: (req, res) => {
        try {
            const token = req.params.token
            jwt.verify(token, env.SECRETKEY, (err, decode) => {
                if (err) {
                    res.render('404')
                } else {
                    const data = jwt.decode(token)
                    const email = data.email
                    userModel.update(email).then((result) => {
                        res.render('index', { email })
                    }).catch(err => {
                        res.render('404')
                    })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    login: (req, res) => {
        try {
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
                        if (data.status === 0) {
                            failedLog(res, [], "Please check your email to activation")
                        } else {
                            if (!isMatch) {
                                failedLog(res, [], "Password invalid")
                            } else {
                                const id = result[0].id_user
                                const token_user = result[0].refreshToken
                                const token = jwt.sign({ id: id }, env.SECRETKEY, { expiresIn: 3600 })
                                const refresh = jwt.sign({ id: id }, env.SECRETKEY)
                                if (!token_user) {
                                    userModel.loginToken(refresh, id)
                                        .then((result) => {
                                            loginSuccess(res, id, token, refresh, 'success login')
                                        })
                                } else {
                                    loginSuccess(res, id, token, token_user, 'success login')
                                }
                            }
                        }
                    }
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    updateUser: (req, res) => {
        try {
            const body = req.body
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === `LIMIT_FIELD_VALUE`) {
                        failed(res, [], `Image size is to big`)
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const id = req.params.id
                    userModel.getOne(id)
                        .then((response) => {
                            const imageOld = response[0].image
                            body.image = !req.file ? imageOld : req.file.filename
                            if (body.image !== imageOld) {
                                if (imageOld !== '404P.png') {
                                    fs.unlink(`src/img/${imageOld}`, (err) => {
                                        if (err) {
                                            failed(res, [], err.message)
                                        } else {
                                            userModel.updateUser(body, id)
                                                .then((result) => {
                                                    success(res, result, 'Update success')
                                                })
                                                .catch((err) => {
                                                    failed(res, [], err.message)
                                                })
                                        }
                                    })
                                } else {
                                    userModel.updateUser(body, id)
                                        .then((result) => {
                                            success(res, result, 'Update success')
                                        })
                                        .catch((err) => {
                                            failed(res, [], err.message)
                                        })
                                }
                            } else {
                                userModel.updateUser(body, id)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    getUser: (req, res) => {
        try {
            const id = req.params.id
            userModel.getOne(id)
                .then((result) => {
                    success(res, result, 'success get user')
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    },
    deleteUser: (req, res) => {
        try {
            const id = req.params.id
            userModel.getOne(id)
                .then((result) => {
                    const img = result[0].image
                    if (img === '404P.png') {
                        userModel.deleteUser(id)
                            .then((result) => {
                                success(res, result, 'success delete user')
                            }).catch((err) => {
                                failed(res, [], err.message)
                            })
                    } else {
                        fs.unlink(`src/img/${img}`, (err) => {
                            if (err) {
                                failed(res, [], err.message)
                            } else {
                                userModel.deleteUser(id)
                                    .then((result) => {
                                        success(res, result, 'success delete user')
                                    }).catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        })
                    }
                })
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    },
    refreshToken: (req, res) => {
        try {
            const token = req.body.refreshToken
            const id = jwt.decode(token)
            if (id === null) {
                failed(res, [], "invalid refresh token")
            } else {
                jwt.sign({ id: id }, env.SECRETKEY, { expiresIn: 10800 }, (err, token) => {
                    if (err) {
                        failed(res, [], err.message)
                    } else {
                        success(res, { newToken: token }, 'success refresh token')
                    }
                })
            }
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    },
    getAll: (req, res) => {
        try {
            const name = !req.query.name ? "" : req.query.name;
            const sort = !req.query.sort ? "id_user" : req.query.sort;
            const typesort = !req.query.typesort ? "ASC" : req.query.typesort;
            const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
            const page = !req.query.page ? 1 : parseInt(req.query.page);
            const offset = page <= 1 ? 0 : (page - 1) * limit;
            userModel.getAll(name, sort, typesort, limit, offset)
                .then((result) => {
                    const totalRows = result[0].count;
                    const meta = {
                        total: totalRows,
                        totalPage: Math.ceil(totalRows / limit),
                        page: page,
                    }
                    successWithMeta(res, result, meta, "Get all data success");
                })
                .catch((err) => {
                    failed(res, [], err.message);
                })
        } catch (error) {
            failed(res, [], "Server internal error")
        }
    },
    resetPass: (req, res) => {
        try {
            const email = req.body.email
            userModel.searchEmail(email)
                .then((result) => {
                    if (!result[0]) {
                        failed(res, [], 'Email invalid')
                    } else {
                        const key = Math.floor(Math.random(111999777) * Math.floor(222999777))
                        userModel.updateKey(key, email)
                            .then((result) => {
                                success(res, result, 'Check your email to reset password')
                                const output = `
                <h4>Reset Password</h4>
                <p>You can confirm your email by clicking the link below <br> <a href="http://localhost:8080/reset-pwd?key=${key}">Reset Password</a></hp></center>
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
                                    from: '"Ankasa" <maxmukiper.com>',
                                    to: req.body.email,
                                    subject: "Reset Password",
                                    text: "Plaintext version of the message",
                                    html: output
                                };
                                transporter.sendMail(Mail)
                            }).catch((err) => {
                                failed(res, [], err.message)
                            })
                    }
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    },
    confirmPass: async (req, res) => {
        try {
            const data = req.body
            const key = req.body.key
            if (data.password !== data.confirmpwd) {
                failed(res, [], "Your password and confirmation password do not match")
            } else {
                if (!key) {
                    failed(res, [], "Key not found")
                } else {
                    const pass = data.password
                    const salt = await bcrypt.genSalt(10)
                    const generate = await bcrypt.hash(pass, salt)
                    userModel.setPass(generate, key)
                        .then((result) => {
                            success(res, result, 'success reset password')
                        }).catch((err) => {
                            failed(res, [], err.message)
                        })
                }
            }
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    }
}

module.exports = user