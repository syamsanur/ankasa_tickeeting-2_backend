const jwt = require('jsonwebtoken')
const { tokenExpired, tokenError, admErrToken } = require('../helper/res')
const { SECRETKEY } = require('../helper/env')

const authku = {
    authentication: (req, res, next) => {
        const token = req.headers.token
        if (token === undefined || token === '') {
            tokenError(res, [], 'Token required')
        } else {
            next()
        }
    },
    authorization: (req, res, next) => {
        const token = req.headers.token
        jwt.verify(token, SECRETKEY, (err) => {
            if (err && err.name === 'TokenExpiredError') {
                tokenExpired(res, [], 'Token expired')
            } else if (err && err.name === 'JsonWebTokenError') {
                tokenError(res, [], 'Token invalid')
            } else {
                next()
            }
        })
    },
    admin: (req, res, next) => {
        const token = req.headers.token
        jwt.verify(token, SECRETKEY, (err, decode) => {
            if (err && err.name === 'JsonWebTokenError') {
                tokenError(res, [], "Authentification failed !");
            } else if (err && err.name === 'TokenExpiredError') {
                tokenError(res, [], "Token Expired !");
            }
            else {
                if (decode.level === 1) {
                    next()
                } else {
                    forbidden(res, 'Dont have permission!')
                }
            }
        })
    }
}

module.exports = authku