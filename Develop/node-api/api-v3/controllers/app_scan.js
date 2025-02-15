const niv = require("node-input-validator");
const Helper = require("../helper/index");
const LotteryWinnerNumber = require("../../api/models/lottery_winning_number");
const LotteryWinnerAmount = require("../../api/models/winning_amount");
const LotteryScan = require("../../api/models/lottery_scan");
const moment = require("moment");
const _ = require("lodash");
const mongoose = require("mongoose");

exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    numberList: "required|array",
    lottery: "required",
    from_date: "required|dateFormat:YYYY-MM-DD",
    to_date: "required|dateFormat:YYYY-MM-DD",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "Validation error",
      error: ObjValidation.errors,
    });
  }
  let { numberList, lottery, superNumberList, from_date, to_date } = req.body;

  try {
    let MasterArray = [];
    dateArrayFunction = function (from_date, to_date) {
      for (
        var a = [], d = new Date(from_date);
        d <= new Date(to_date);
        d.setDate(d.getDate() + 1)
      ) {
        a.push(new Date(d));
      }
      return a;
    };
    let dateArray = dateArrayFunction(from_date, to_date);
    for (var dateInt = 0; dateInt < dateArray.length; dateInt++) {
      var singleDate = dateArray[dateInt];
      let finalResult = {
        Numbers: [],
        superNumbers: {},
      };
      for (let i = 0; i < numberList.length; i++) {
        let count = 0;
        let single_number = numberList[i];
        single_number = single_number.trim();
        let ele = single_number.split(" ");
        // console.log(ele)
        let numberListData = [];
        for (let j = 0; j < ele.length; j++) {
          const s = parseInt(ele[j]);
          let result = await LotteryWinnerNumber.findOne({
            winning_number: s,
            lottery_id: lottery,
            type: 1,
            date: new Date(singleDate),
          });
          new LotteryScan({ lottery_id: lottery }).save();
          if (result) {
            numberListData.push({
              number: s,
              matched: true,
            });
          } else {
            numberListData.push({
              number: s,
              matched: false,
            });
          }
        }
        const checkMatched = numberListData.find((s) => s.matched === true);
        if (checkMatched) {
          for (const e of numberListData) {
            if (e.matched) {
              count++;
            }
          }
        }
        var amount = 0;
        if (count > 0) {
          let lotteryAmount = await LotteryWinnerAmount.findOne({
            winning_number_match: count,
            lottery_id: lottery,
            type: 1,
            date: new Date(singleDate),
          });
          if (lotteryAmount) {
            amount = lotteryAmount.winning_amount;
          }
        } else {
          amount = 0;
        }
        let finalData = {
          matched: count,
          type: 1,
          numberList: numberListData,
          amount: amount,
        };
        finalResult.Numbers.push(finalData);
      }
      let superFinalData = "";
      // Super
      if (superNumberList.length > 0) {
        let count = 0;
        let single_number = superNumberList[0];
        let ele = single_number.split(" ");

        let superNumberListData = [];
        for (let j = 0; j < ele.length; j++) {
          const s = parseInt(ele[j]);
          let result = await LotteryWinnerNumber.findOne({
            winning_number: s,
            lottery_id: lottery,
            type: 2,
            date: new Date(singleDate),
          });
          new LotteryScan({ lottery_id: lottery }).save();
          if (result) {
            superNumberListData.push({
              number: s,
              matched: true,
            });
          } else {
            superNumberListData.push({
              number: s,
              matched: false,
            });
          }
        }
        const checkMatched = superNumberListData.find(
          (s) => s.matched === true
        );
        if (checkMatched) {
          for (const e of superNumberListData) {
            if (e.matched) {
              count++;
            }
          }
        }
        var amount = 0;
        if (count > 0) {
          let lotteryAmount = await LotteryWinnerAmount.findOne({
            winning_number_match: count,
            lottery_id: lottery,
            type: 2,
            date: new Date(singleDate),
          });
          if (lotteryAmount) {
            amount = lotteryAmount.winning_amount;
          }
        } else {
          amount = 0;
        }
        superFinalData = {
          matched: count,
          type: 2,
          numberList: superNumberListData,
          amount: amount,
        };
      }

      finalResult.superNumbers = superFinalData;
      let tmp_obj = {};
      tmp_obj.date = singleDate;
      tmp_obj.result = finalResult;
      MasterArray.push(tmp_obj);
    }
    const id = mongoose.Types.ObjectId(lottery);
    let lotteryType;
    if (numberList.length > 0 && superNumberList.length == 0) {
      lotteryType = 1;
    } else {
      lotteryType = { $in: [1, 2] };
    }
    console.log(lotteryType);
    let result = await LotteryWinnerNumber.aggregate([
      {
        $match: {
          date: { $ne: null },
          lottery_id: id,
          type: lotteryType,
        },
      },
      {
        $group: {
          _id: { date: "$date" },
        },
      },
      {
        $project: {
          date: "$_id.date",
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);
    let data = new Array();
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      for (let j = 0; j < MasterArray.length; j++) {
        const element1 = MasterArray[j];
        if (
          new Date(element.date).getTime() == new Date(element1.date).getTime()
        ) {
          data.push(element1);
        }
      }
    }

    return res.status(200).json({
      message: "Scan list has been retrieved",
      result: data,
    });
  } catch (err) {
    console.log(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
