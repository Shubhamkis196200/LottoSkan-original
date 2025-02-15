const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryDB = require('../../api/models/lottery')
//
exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    name: 'required',
    number: 'required|numeric',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  if (!req.file) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: 'Image is required' })
  }
  try {
    const { name, number } = req.body
    let newObj = {}
    newObj['lottery_name'] = name
    newObj['lottery_number'] = number
    newObj['order'] = req.body.order
    newObj['super_btn'] = req.body.super_btn
    newObj['scan'] = req.body.scan
    newObj['note'] = req.body.note
    newObj['lottery_image'] = req.file.path
    const result = new LotteryDB(newObj)
    await result.save()
    return res
      .status(201)
      .json({ message: 'Lottery has been successfully added ', result: result })
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

exports.update = async (req, res) => {
  const { id } = req.params
  const ObjValidation = new niv.Validator(req.body, {
    name: 'required',
    number: 'required|numeric',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }

  try {
    const { name, number } = req.body
    let updateObj = {}
    updateObj['lottery_name'] = name
    updateObj['lottery_number'] = number
    updateObj['note'] = req.body.note
    updateObj['lottery_image'] = req.file.path
    const result = await LotteryDB.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    )
    return res.status(202).json({
      message: 'Lottery has been successfully updated',
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
  let { limit, page, search } = req.query

  if ([null, undefined, ''].includes(page)) {
    page = 1
  }
  if ([null, undefined, ''].includes(limit)) {
    limit = 10
  }
  if ([null, undefined, ''].includes(search)) {
    search = ''
  }
  let options = { page: page, limit: limit }

  const matchObj = {}
  matchObj.flag = { $in: [1, 2] }
  if (search) {
    matchObj.lottery_name = { $regex: search, $options: 'i' }
  }

  try {
    const LotteryAggregate = LotteryDB.aggregate([
      { $sort: { order: 1 } },
      { $match: matchObj },
      {
        $project: {
          lottery_name: 1,
          lottery_number: 1,
          lottery_image: 1,
          flag: 1,
          order: 1,
          scan: 1,
          super_btn: 1
        },
      },
    ])

    const result = await LotteryDB.aggregatePaginate(LotteryAggregate, options)

    for (let i = 0; i < result.docs.length; i++) {
      const element = result.docs[i]
      element.lottery_image = await Helper.getImageUrl(element.lottery_image)
    }
    return res
      .status(200)
      .json({ message: 'Lottery has been retrieved', result: result })
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

exports.changeStatus = async (req, res) => {
  const { id } = req.params
  const ObjValidation = new niv.Validator(req.body, {
    flag: 'required|numeric|in:1,2',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res
      .status(422)
      .json({ message: 'Validation error', error: ObjValidation.errors })
  }
  try {
    let message = 'Lottery has been successfully activated'
    if (req.body.flag == 2) {
      message = 'Lottery has been successfully deactivated'
    }
    const result = await LotteryDB.findByIdAndUpdate(
      id,
      {
        $set: { flag: req.body.flag },
      },
      { new: true }
    )
    return res.status(202).json({ message: message, result: result })
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
