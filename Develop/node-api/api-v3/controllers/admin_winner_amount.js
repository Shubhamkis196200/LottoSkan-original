const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryWinnerAmount = require('../../api/models/winning_amount')

exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    amountList: 'required',
    lottery: 'required',
    type: 'required',
    date:"required|dateFormat:YYYY-MM-DD"
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  try {
    await LotteryWinnerAmount.deleteMany({ lottery_id: req.body.lottery, type: req.body.type,date:new Date(req.body.date) })
    req.body.amountList.map((s) => {
      new LotteryWinnerAmount({
        lottery_id: req.body.lottery,
        winning_number_match: s.matched,
        winning_amount: s.amount,
        date: new Date(req.body.date),
        type: req.body.type
      }).save()
    })
    return res
      .status(200)
      .json({ message: 'Amount has been successfully updated' })
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

//
exports.get = async (req, res) => {
  const { id } = req.params
  const {type} = req.params

  const ObjValidation = new niv.Validator(req.params, {
    type: 'required|in:1,2',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Type is mandatory and must be 1 or 2.'})
  }

  try {
    let { date } = req.query
    const result = await LotteryWinnerAmount.find({ lottery_id: id, type: type,date:new Date(date) }).sort({
      winning_number_match: 1,
    })
    return res
      .status(200)
      .json({ message: 'amount has been retrieved', result: result })
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
