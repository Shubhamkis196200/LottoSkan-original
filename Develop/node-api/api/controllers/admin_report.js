const LotteryScanDB = require('../models/lottery_scan')
const Helper = require('../helper/index')
const moment = require('moment')

//
exports.get = async (req, res) => {
  let { start, end } = req.query

  try {
    let matchObj = {}

    if (start && end) {
      matchObj.createdAt = { $gte: new Date(start), $lt: new Date(end) }
    }
    const result = await LotteryScanDB.aggregate([
      {
        $match: matchObj,
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },

      {
        $sort: { date: -1 },
      },
    ])

    var daysOfYear = []
    for (
      var d = new Date(start);
      d <= new Date(end);
      d.setDate(d.getDate() + 1)
    ) {
      let data = result.find((s) => s._id === moment(d).format('YYYY-MM-DD'))
      daysOfYear.push({
        _id: moment(d).format('DD-MMM-YYYY'),
        count: data ? data.count : 0,
      })
    }
    return res
      .status(200)
      .json({ message: 'Report has been retrieved', result: daysOfYear })
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
