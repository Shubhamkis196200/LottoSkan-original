const axios = require('axios')
const cron = require('node-cron')
const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryWinnerDB = require('../../api/models/lottery_winning_number')
const moment = require('moment')
const mongoose = require('mongoose')

exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    numberList: 'required',
    lottery: 'required',
    type: 'required',
    date: 'required|dateFormat:YYYY-MM-DD',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  try {
    const { numberList, lottery, date } = req.body
    const type = req.body.type ? req.body.type : 1
    await LotteryWinnerDB.deleteMany({
      lottery_id: lottery,
      type: type,
      date: new Date(date),
    })
    let newObj = await numberList.map((s) => {
      return {
        winning_number: s,
        lottery_id: lottery,
        type: type,
        date: new Date(date),
      }
    })

    const result = await LotteryWinnerDB.insertMany(newObj)

    return res.status(201).json({
      message: 'Winner number list has been successfully added',
      result: result,
    })
  } catch (err) {
    console.error(err)
    const request = req
    Helper.writeErrorLog(request, err)
    return res.status(500).json({
      message: 'Error occurred, Please try again later',
      error: err.message,
    })
  }
}
exports.get = async (req, res) => {
  const { id } = req.params
  const { type } = req.params
  const ObjValidation = new niv.Validator(req.params, {
    type: 'required|in:1,2',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Type is mandatory and must be 1 or 2.' })
  }
  let { date } = req.query
  try {
    date = moment(date).format('YYYY-MM-DD')
    console.log(date)
    const result = await LotteryWinnerDB.find({
      lottery_id: id,
      type: type,
      date: date,
    })
    return res
      .status(200)
      .json({ message: 'Winner number list has been retrived', result: result })
  } catch (err) {
    console.error(err)
    const request = req
    Helper.writeErrorLog(request, err)
    return res.status(500).json({
      message: 'Error occurred, Please try again later',
      error: err.message,
    })
  }
}
exports.getDateList = async (req, res) => {
  const ObjValidation = new niv.Validator(req.query, {
    id: 'required',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  try {
    let { id } = req.query
    id = mongoose.Types.ObjectId(id)
    let result = await LotteryWinnerDB.aggregate([
      {
        $match: {
          date: { $ne: null },
          lottery_id: id,
          type: 1
        },
      },
      {
        $group: {
          _id: { date: '$date' },
        },
      },
      {
        $project: {
          date: '$_id.date',
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ])
    for (var i = 0; i < result.length; i++) {
      delete result[i]._id
      result[i].date = await moment(result[i].date).format('YYYY-MM-DD')
    }
    return res.status(201).send({
      result: result,
    })
  } catch (err) {
    console.log(err)
    const request = req
    Helper.writeErrorLog(request, err)
    return res.status(500).json({
      message: 'Error occurred, Please try again later',
      error: err.message,
    })
  }
}

/* Add Winning Numbers CRON */

const NUMBERS_API_URL1 = 'http://serwis.mobilotto.pl/mapi_v6/index.php?json=getGames'
const NUMBERS_API_URL2 =
  'https://www.lotto.pl/api/lotteries/draw-results/by-gametype?game=EkstraPremia&index=1&size=1&sort=drawDate&order=DESC'
const EUROJACKPOT_URL = 'https://app.lotto.pl/wyniki/?type=ej'


const LOTTO_ID = '61dbf483cc484f2c593b3953'
const LOTTO_PLUS_ID = '61dbf4d3cc484f2c593b3958'
const MINI_LOTTO_ID = '61dbf6a8cc484f2c593b396a'
const EUROJACKPOT_ID = '61dbf513cc484f2c593b395d'
const EKSTRA_PENSJA_ID = '61dbf75ecc484f2c593b3970'
const EKSTRA_PREMIA_ID = '61dbf7a2cc484f2c593b3973'

/* Super Numbers will be same for every lottery except EUROJACKPOT. EUROJACKPOT does not have any super number. */

const addNumbers = async (URL, ID, lotteryType) => {
  let date
  let resultArr = []

  if (lotteryType == 'LOTTO') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.Lotto
    resultArr = obj.numerki.split(',')
    
    let temp_date = obj.data_losowania.split(' ')[0]
    date = new Date(temp_date)
  }
  else if (lotteryType == 'LOTTO_PLUS') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.LottoPlus
    resultArr = obj.numerki.split(',')
    
    let temp_date = obj.data_losowania.split(' ')[0]
    date = new Date(temp_date)
  }
  else if (lotteryType == 'MINI_LOTTO') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.Mini
    resultArr = obj.numerki.split(',')
    
    let temp_date = obj.data_losowania.split(' ')[0]
    date = new Date(temp_date)
  }
  else if (lotteryType == 'EUROJACKPOT') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    resultArr = urlResults.split('\n')
    date = new Date(resultArr[0])
    resultArr.splice(0, 1)
  } 
  else if (lotteryType == 'EKSTRA_PENSJA') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.items[0]
    const epObj = obj.results[1]

    date = moment(epObj.drawDate).utcOffset(0)
    date = date.set({ h: 0, m: 0 })
    date = new Date(date)
    resultArr = epObj.resultsJson
  }
  else if (lotteryType == 'EKSTRA_PREMIA') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.items[0]
    const epObj = obj.results[0]

    date = moment(epObj.drawDate).utcOffset(0)
    date = date.set({ h: 0, m: 0 })
    date = new Date(date)
    resultArr = epObj.resultsJson
  }

  try {
    await LotteryWinnerDB.deleteMany({
      lottery_id: ID,
      type: 1,
      date: date,
    })
    let newObj = []
    for (s = 0; s < resultArr.length; s++) {
      if (resultArr[s] != '' || !isNaN(parseInt(resultArr[s]))) {
        let available_res = await LotteryWinnerDB.find({
          lottery_id: mongoose.Types.ObjectId(ID), 
          winning_number : parseInt(resultArr[s]),
          type: 1,
          date: date
        })
        if( available_res.length > 0 || resultArr.indexOf(resultArr[s]) < s ) continue
        newObj.push({
          winning_number: parseInt(resultArr[s]),
          lottery_id: ID,
          type: 1,
          date: date,
        })
      } else break
    }

    // console.log(newObj)

    let result = {}
    result = await LotteryWinnerDB.insertMany(newObj)
    let resObj = {
      message: 'Winning Numbers Added',
      result: result,
    }
    console.log(resObj)
  } catch (err) {
    console.error(err)
    console.log('Error Occured')
  }
}

const addSuperNumbers = async (URL, ID, lotteryType) => {
  let date
  let resultArr = []

  if (lotteryType == 'LOTTO' || lotteryType == 'LOTTO_PLUS'|| lotteryType == 'MINI_LOTTO') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.Superszansa[0]
    resultArr = obj.numerki.split(',')
    
    let temp_date = obj.data_losowania.split(' ')[0]
    date = new Date(temp_date)
  }
  else if (lotteryType == 'EKSTRA_PENSJA' || lotteryType == 'EKSTRA_PREMIA') {
    let urlResults = await axios.get(URL)
    urlResults = urlResults.data

    const obj = urlResults.items[0]
    const epObj = obj.results[2]

    date = moment(epObj.drawDate).utcOffset(0)
    date = date.set({ h: 0, m: 0 })
    date = new Date(date)

    resultArr = epObj.resultsJson
  }

  try {
    await LotteryWinnerDB.deleteMany({
      lottery_id: ID,
      type: 2,
      date: date,
    })
    let newObj = []
    for (s = 0; s < resultArr.length; s++) {
      if (resultArr[s] != '' || !isNaN(parseInt(resultArr[s]))) {
        let available_res = await LotteryWinnerDB.find({
          lottery_id: mongoose.Types.ObjectId(ID), 
          winning_number : parseInt(resultArr[s]),
          type: 2,
          date: date
        })
        if( available_res.length > 0 || resultArr.indexOf(resultArr[s]) < s ) continue
        newObj.push({
          winning_number: parseInt(resultArr[s]),
          lottery_id: ID,
          type: 2,
          date: date,
        })
      } else break
    }

    // console.log(newObj)

    let result = {}
    result = await LotteryWinnerDB.insertMany(newObj)
    let resObj = {
      message: 'Super Numbers Added',
      result: result,
    }
    console.log(resObj)
  } catch (err) {
    console.error(err)
    console.log('Error Occured')
  }
}


// let addNumbersCron = new cron.schedule('0 1 * * *', async function () {
//     console.log('main');
//     await addNumbers(NUMBERS_API_URL1, LOTTO_ID, 'LOTTO')
//     await addNumbers(NUMBERS_API_URL1, LOTTO_PLUS_ID, 'LOTTO_PLUS')
//     await addNumbers(NUMBERS_API_URL1, MINI_LOTTO_ID, 'MINI_LOTTO')
//     await addNumbers(EUROJACKPOT_URL, EUROJACKPOT_ID, 'EUROJACKPOT')
//     await addNumbers(NUMBERS_API_URL2, EKSTRA_PENSJA_ID, 'EKSTRA_PENSJA')
//     await addNumbers(NUMBERS_API_URL2, EKSTRA_PREMIA_ID, 'EKSTRA_PREMIA')
//   })
  
//   let addSuperNumbersCron = new cron.schedule('5 1 * * *', async function () {
//     console.log('object');
//     await addSuperNumbers(NUMBERS_API_URL1, LOTTO_ID, 'LOTTO')
//     await addSuperNumbers(NUMBERS_API_URL1, LOTTO_PLUS_ID, 'LOTTO_PLUS')
//     await addSuperNumbers(NUMBERS_API_URL1, MINI_LOTTO_ID, 'MINI_LOTTO')
//     await addSuperNumbers(NUMBERS_API_URL2, EKSTRA_PENSJA_ID, 'EKSTRA_PENSJA')
//     await addSuperNumbers(NUMBERS_API_URL2, EKSTRA_PREMIA_ID, 'EKSTRA_PREMIA')
//   })

let date = moment('2022-05-18T11:50:00Z').format('YYYY-MM-DD')
    const date3 = new Date(date)
    console.log(date3)
