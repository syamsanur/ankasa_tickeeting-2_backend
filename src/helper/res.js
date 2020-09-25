const response = {
    success: (res, data, message) => {
        const result = {
            code: 200,
            status: true,
            message: message,
            data: data
        }
        res.json(result)
    },
    failed: (res, data, message) => {
        const result = {
            code: 500,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    failedReg: (res, data, message) => {
        const result = {
            code: 402,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    }
}

module.exports = response