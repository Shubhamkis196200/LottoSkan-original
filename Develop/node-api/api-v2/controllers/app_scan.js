const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryWinnerNumber = require('../../api/models/lottery_winning_number')
const LotteryWinnerAmount = require('../../api/models/winning_amount')
const LotteryScan = require('../../api/models/lottery_scan')

exports.add = async (req, res) => {
  console.log('yes i am in v2')

  const ObjValidation = new niv.Validator(req.body, {
    numberList: 'required|array',
    lottery: 'required',
    date:"required|dateFormat:YYYY-MM-DD"
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res.status(422).json({
      message: 'Validation error',
      error: ObjValidation.errors,
    })
  }
  let { numberList, lottery, superNumberList,date } = req.body

  try {
    let finalResult = {
      Numbers: [],
      superNumbers: {},
    }
    let numberFinalResult = []
    
    for (let i = 0; i < numberList.length; i++) {
      let count = 0
      let single_number = numberList[i]
      single_number = single_number.trim()
      let ele = single_number.split(' ')
      // console.log(ele)
      let numberListData = []
      for (let j = 0; j < ele.length; j++) {
        const s = parseInt(ele[j])
        let result = await LotteryWinnerNumber.findOne({
          winning_number: s,
          lottery_id: lottery,
          type: 1,
          date:new Date(date)
        })
        new LotteryScan({ lottery_id: lottery }).save()
        if (result) {
          numberListData.push({
            number: s,
            matched: true,
          })
        } else {
          numberListData.push({
            number: s,
            matched: false,
          })
        }
      }
      const checkMatched = numberListData.find((s) => s.matched === true)
      if (checkMatched) {
        for (const e of numberListData) {
          if (e.matched) {
            count++
          }
        }
      }
      var amount = 0
      if (count > 0) {
        let lotteryAmount = await LotteryWinnerAmount.findOne({
          winning_number_match: count,
          lottery_id: lottery,
          type: 1,
          date:new Date(date),
        })
        if(lotteryAmount){
          amount = lotteryAmount.winning_amount
        }
      } else {
        amount = 0
      }
      let finalData = {
        matched: count,
        type: 1,
        numberList: numberListData,
        amount: amount,
      }
      finalResult.Numbers.push(finalData)
    }
    let superFinalData = ''
    // Super
    if (superNumberList) {
      let count = 0
      let single_number = superNumberList[0]
      let ele = single_number.split(' ')

      let superNumberListData = []
      for (let j = 0; j < ele.length; j++) {
        const s = parseInt(ele[j])
        let result = await LotteryWinnerNumber.findOne({
          winning_number: s,
          lottery_id: lottery,
          type: 2,
          date:new Date(date),
        })
        new LotteryScan({ lottery_id: lottery }).save()
        if (result) {
          superNumberListData.push({
            number: s,
            matched: true,
          })
        } else {
          superNumberListData.push({
            number: s,
            matched: false,
          })
        }
      }
      const checkMatched = superNumberListData.find((s) => s.matched === true)
      if (checkMatched) {
        for (const e of superNumberListData) {
          if (e.matched) {
            count++
          }
        }
      }
      var amount = 0
      if (count > 0) {
        let lotteryAmount = await LotteryWinnerAmount.findOne({
          winning_number_match: count,
          lottery_id: lottery,
          type: 2,
          date:new Date(date),
        })
        if(lotteryAmount){
          amount = lotteryAmount.winning_amount
        }
      } else {
        amount = 0
      }
      superFinalData = {
        matched: count,
        type: 2,
        numberList: superNumberListData,
        amount: amount,
      }
    }

    finalResult.superNumbers = superFinalData

    return res.status(200).json({
      message: 'Scan list has been retrieved',
      result: finalResult,
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
