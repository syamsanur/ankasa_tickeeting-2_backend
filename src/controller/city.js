const { success, failed, successWithMeta } = require('../helper/res')
const cityModel = require('../model/city')
const fs = require('fs')
const upload = require('../helper/upload')

const city = {
    addCity: (req, res) => {
        try {
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === `LIMIT_FIELD_VALUE`) {
                        failed(res, [], `Image size is to big`)
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const body = req.body
                    body.image = req.file == undefined ? '404.png' : req.file.filename
                    cityModel.addCity(body)
                        .then((result) => {
                            success(res, result, `Insert product success`)
                        })
                        .catch((err) => {
                            failed(res, [], err.message)
                        })
                }
            })
        } catch (error) {
            failed(res, [], error)
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
            cityModel.getAll(name, sort, typesort, limit, offset)
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
            failed(res, [], error)
        }
    },
    getOne: (req, res) => {
        try {
            const id = req.params.id
            cityModel.getOne(id)
                .then((result) => {
                    if (result.length === 0) {
                        failed(res, [], 'Data not found')
                    } else {
                        success(res, result, `Get detail success`)
                    }
                })

        } catch (error) {
            failed(res, [], error)
        }
    },
    updateCity: (req, res) => {
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
                cityModel.getOne(id)
                    .then((response) => {
                        const imageOld = response[0].image
                        body.image = !req.file ? imageOld : req.file.filename
                        if (body.image !== imageOld) {
                            if (imageOld !== '404.png') {
                                fs.unlink(`src/img/${imageOld}`, (err) => {
                                    if (err) {
                                        failed(res, [], err.message)
                                    } else {
                                        cityModel.update(body, id)
                                            .then((result) => {
                                                success(res, result, 'Update success')
                                            })
                                            .catch((err) => {
                                                failed(res, [], err.message)
                                            })
                                    }
                                })
                            } else {
                                cityModel.update(body, id)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        } else {
                            cityModel.update(body, id)
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
    },
    deleteCity: (req, res) => {
        try {
            const id = req.params.id
            cityModel.getOne(id)
                .then((result) => {
                    const dataImage = result[0].image
                    if (dataImage === '404.png') {
                        cityModel.delete(id)
                            .then((result) => {
                                success(res, result, `ID ${id} success deleted!`)
                            }).catch((err) => {
                                failed(res, [], err.message)
                            })
                    } else {
                        fs.unlink(`src/img/${dataImage}`, (err) => {
                            if (err) {
                                failed(res, [], err.message)
                            } else {
                                cityModel.delete(id)
                                    .then((result) => {
                                        success(res, result, `ID ${id} success deleted!`)
                                    }).catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        })
                    }
                })
                .catch((err) => {
                    failed(res, [], err.message)
                })

        } catch (error) {
            failed(res, [], err.message)
        }
    }
}

module.exports = city