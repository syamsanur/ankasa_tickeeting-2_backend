const { success, failed, successWithMeta } = require('../helper/res')
const bookingModels = require('../model/booking')

const booking = {
    addBooking: (req, res) => {
        try {
            const data = req.body
            bookingModels.addBook(data)
                .then((result) => {
                    success(res, result, 'Success insert booking')
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (error) {
            failed(res, [], "Server internal error")
        }
    },
    getAll: (req, res) => {
        try {
            const name = !req.query.name ? "" : req.query.name;
            const sort = !req.query.sort ? "id" : req.query.sort;
            const typesort = !req.query.typesort ? "ASC" : req.query.typesort;
            const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
            const page = !req.query.page ? 1 : parseInt(req.query.page);
            const offset = page <= 1 ? 0 : (page - 1) * limit;
            bookingModels.getAll(name, sort, typesort, limit, offset)
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
    getDetail: (req, res) => {
        try {
            const id = req.params.id
            bookingModels.getDetail(id)
                .then((result) => {
                    success(res, result, 'success get detail')
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (error) {
            failed(res, [], "Server internal error")
        }
    },
    updateBooking: (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            bookingModels.update(data, id)
                .then((result) => {
                    success(res, result, 'Update success')
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    },
    deleteBooking: (req, res) => {
        try {
            const id = req.params.id
            bookingModels.deleteBo(id)
                .then((result) => {
                    success(res, result, 'Delete success')
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (error) {
            failed(res, [], "Server internal error")
        }
    }
}

module.exports = booking