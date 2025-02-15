const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryWinnerDB = require('../models/lottery_winning_number')

exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    numberList: 'required',
    lottery: 'required',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  try {
    const { numberList, lottery } = req.body
    await LotteryWinnerDB.deleteMany({ lottery_id: lottery })
    let newObj = await numberList.map((s) => {
      return {
        winning_number: s,
        lottery_id: lottery,
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
  try {
    const result = await LotteryWinnerDB.find({ lottery_id: id })
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
