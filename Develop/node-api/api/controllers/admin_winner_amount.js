const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryWinnerAmount = require('../models/winning_amount')

exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    amountList: 'required',
    lottery: 'required',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  try {
    await LotteryWinnerAmount.deleteMany({ lottery_id: req.body.lottery })

    req.body.amountList.map((s) => {
      new LotteryWinnerAmount({
        lottery_id: req.body.lottery,
        winning_number_match: s.matched,
        winning_amount: s.amount,
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
  const id = req.params.id
  try {
    const result = await LotteryWinnerAmount.find({ lottery_id: id }).sort({
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
