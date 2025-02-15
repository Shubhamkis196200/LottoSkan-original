const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryDB = require('../../api/models/lottery')

//
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
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  }

  const matchObj = {}
  matchObj.flag = 1
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
          super_btn: 1,
          scan: 1,
          note: 1
        },
      },
    ])

    const result = await LotteryDB.aggregatePaginate(LotteryAggregate, options)
    for (let i = 0; i < result.docs.length; i++) {
      const element = result.docs[i]
      element.regex = i
      // element.lottery_image = await Helper.getImageUrl(element.lottery_image)
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
