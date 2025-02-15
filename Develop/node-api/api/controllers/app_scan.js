const niv = require('node-input-validator')
const Helper = require('../helper/index')
const LotteryWinnerNumber = require('../models/lottery_winning_number')
const LotteryWinnerAmount = require('../models/winning_amount')
const LotteryScan = require('../models/lottery_scan')
//
exports.add = async (req, res) => {
  console.log('yes i am in v1')
  const ObjValidation = new niv.Validator(req.body, {
    numberList: 'required|array',
    lottery: 'required',
  })
  const matched = await ObjValidation.check()
  if (!matched) {
    return res.status(422).json({
      message: 'Validation error',
      error: ObjValidation.errors,
    })
  }
  const { numberList, lottery } = req.body

  try {
    let finalResult = []
    let amount = ''
    for (let i = 0; i < numberList.length; i++) {
      let count = 0;
      let single_number = numberList[i]; 
      single_number = single_number.trim();
      let ele = single_number.split(" ");
      // console.log(ele)
      let numberListData = []
      for (let j = 0; j < ele.length; j++) {
        const s = parseInt(ele[j])
        let result = await LotteryWinnerNumber.findOne({
          winning_number: s,
          lottery_id: lottery,
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
      if (count > 0) {
        amount = await LotteryWinnerAmount.findOne({
          winning_number_match: count,
          lottery_id: lottery,
        })
        amount = amount.winning_amount;
      }else{
        amount = 0;
      }
      let finalData = {
        matched: count,
        numberList: numberListData,
        amount: amount,
      }
      finalResult.push(finalData)
    }
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
