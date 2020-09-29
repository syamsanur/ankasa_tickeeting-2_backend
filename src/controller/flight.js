const { success, failed, successWithMeta } = require('../helper/res')
const flightModel = require('../model/flight')
const env = require('../helper/env')

const flight = {
  getAll: (req, res) => {
    try {
      // console.log("get")
      const sort = !req.query.sort ? "id" : req.query.sort;
      const typesort = !req.query.typesort ? "ASC" : req.query.typesort;
      const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      const page = !req.query.page ? 1 : parseInt(req.query.page);
      const offset = page <= 1 ? 0 : (page - 1) * limit;
      flightModel.getAll(sort, typesort, limit, offset)
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
  getToFromDate: (req, res) => {
    try {
      // console.log("get")
      const origin = req.query.origin
      const destination = req.query.destination
      const transit = !req.query.transit ? 0 : req.query.transit
      const type_flight = !req.query.type_flight ? 0 : req.query.type_flight
      const date = req.query.date
      const class_flight = !req.query.class_flight ? 0 : req.query.class_flight
      const luggage = !req.query.luggage ? 0 : 1
      const meal = !req.query.meal ? 0 : 1
      const wifi = !req.query.wifi ? 0 : 1
      const departurea = !req.querydeparturea ? '00:00:00' : req.query.departurea
      const departureb = !req.query.departureb ? '24:00:00' : req.query.departureb
      const arriveda = !req.query.arriveda ? '00:00:00' : req.query.arriveda
      const arrivedb = !req.query.arrivedb ? '24:00:00' : req.query.arrivedb
      const pricea = !req.query.pricea ? '000000' : req.query.pricea
      const priceb = !req.query.priceb ? '1000000' : req.query.priceb
      
      const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      const page = !req.query.page ? 1 : parseInt(req.query.page);
      const offset = page <= 1 ? 0 : (page - 1) * limit;

      flightModel.getToFromDate(
        origin, destination, transit, type_flight, date, class_flight,
        luggage, meal, wifi, departurea, departureb, arriveda, arrivedb,
        pricea, priceb,
        limit,offset)
      .then((result) => {
        const totalRows = result.length;
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
      flightModel.getOne(id)
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
  insertFlight: (req, res) => {
    try {
      const body = req.body
        flightModel.insertFlight(body)
        .then((result)=>{
            success(res, result, `Insert flight success`)
        })
        .catch((err)=>{
            failed(res, [], err.message)
        })
      
    } catch (error) {
      failed(res, [], error)
    }
  },
  updateFlight : (req,res)=>{
    try {
      const id = req.params.id
      const body = req.body
      flightModel.updateFlight(body, id)
      .then((result)=>{
          success(res, result, `Update flight with id ${id} success`)
      })
      .catch((err)=>{
          failed(res, [], err.message)
      })

    } catch (error) {
      failed(res, [], error)
    }
  },
  deleteFlight : (req,res)=>{
    try {
      const id = req.params.id
      flightModel.deleteFlight(id)
      .then((result)=>{
          success(res, result, `Delete flight with id ${id} success`)
      })
      .catch((err)=>{
          failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], error)
    }
  }
}

module.exports = flight