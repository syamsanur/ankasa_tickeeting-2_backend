const { success, failed, successWithMeta } = require('../helper/res')
const countryModel = require('../model/country')
const env = require('../helper/env')

const country = {
  getAll: (req, res) => {
    try {
      // console.log("get")
      const sort = !req.query.sort ? "id" : req.query.sort;
      const typesort = !req.query.typesort ? "ASC" : req.query.typesort;
      const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      const page = !req.query.page ? 1 : parseInt(req.query.page);
      const offset = page <= 1 ? 0 : (page - 1) * limit;
      countryModel.getAll(sort, typesort, limit, offset)
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
      countryModel.getOne(id)
      .then((result) => {
         if (result.length === 0) {
          failed(res, [], 'Data not found')
        } else {
          success(res, result, `Get data with id ${id} success`)
        }
      }) 

    } catch (error) {
      failed(res, [], error)
    }
  },
  insertCountry: (req, res) => {
    try {
      const body = req.body
        countryModel.insertCountry(body)
        .then((result)=>{
            success(res, result, `Insert country success`)
        })
        .catch((err)=>{
            failed(res, [], err.message)
        })
      
    } catch (error) {
      failed(res, [], error)
    }
  },
  updateCountry : (req,res)=>{
    try {
      const id = req.params.id
      const body = req.body
      countryModel.updateCountry(body, id)
      .then((result)=>{
          success(res, result, `Update country with id ${id} success`)
      })
      .catch((err)=>{
          failed(res, [], err.message)
      })

    } catch (error) {
      failed(res, [], error)
    }
  },
  deleteCountry : (req,res)=>{
    try {
      const id = req.params.id
      countryModel.deleteCountry(id)
      .then((result)=>{
          success(res, result, `Delete country with id ${id} success`)
      })
      .catch((err)=>{
          failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], error)
    }
  }
}

module.exports = country