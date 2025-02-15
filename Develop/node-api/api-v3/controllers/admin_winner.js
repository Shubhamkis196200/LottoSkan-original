const superagent = require("superagent");
const cron = require("node-cron");
const niv = require("node-input-validator");
const Helper = require("../helper/index");
const LotteryWinnerDB = require("../../api/models/lottery_winning_number");
const moment = require("moment");
const mongoose = require("mongoose");

exports.add = async (req, res) => {
  const ObjValidation = new niv.Validator(req.body, {
    numberList: "required",
    lottery: "required",
    type: "required",
    date: "required|dateFormat:YYYY-MM-DD",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res
      .status(422)
      .json({ message: "Validation error", error: ObjValidation.errors });
  }
  try {
    const { numberList, lottery, date } = req.body;
    const type = req.body.type ? req.body.type : 1;
    await LotteryWinnerDB.deleteMany({
      lottery_id: lottery,
      type: type,
      date: new Date(date),
    });
    let newObj = await numberList.map((s) => {
      return {
        winning_number: s,
        lottery_id: lottery,
        type: type,
        date: new Date(date),
      };
    });

    const result = await LotteryWinnerDB.insertMany(newObj);

    return res.status(201).json({
      message: "Winner number list has been successfully added",
      result: result,
    });
  } catch (err) {
    console.error(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
exports.get = async (req, res) => {
  const { id } = req.params;
  const { type } = req.params;
  const ObjValidation = new niv.Validator(req.params, {
    type: "required|in:1,2",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res
      .status(422)
      .json({ message: "Type is mandatory and must be 1 or 2." });
  }
  let { date } = req.query;
  try {
    date = moment(date).format("YYYY-MM-DD");
    console.log(date);
    const result = await LotteryWinnerDB.find({
      lottery_id: id,
      type: type,
      date: date,
    });
    return res.status(200).json({
      message: "Winner number list has been retrived",
      result: result,
    });
  } catch (err) {
    console.error(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
exports.getDateList = async (req, res) => {
  const ObjValidation = new niv.Validator(req.query, {
    id: "required",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res
      .status(422)
      .json({ message: "Validation error", error: ObjValidation.errors });
  }
  try {
    let { id } = req.query;
    id = mongoose.Types.ObjectId(id);
    let result = await LotteryWinnerDB.aggregate([
      {
        $match: {
          date: { $ne: null },
          lottery_id: id,
          type: 1,
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
    for (var i = 0; i < result.length; i++) {
      delete result[i]._id;
      result[i].date = await moment(result[i].date).format("YYYY-MM-DD");
    }

    return res.status(201).send({
      result: result,
    });
  } catch (err) {
    console.error(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

/* Add Winning Numbers CRON */

const NUMBERS_API_URL1 =
  "http://serwis.mobilotto.pl/mapi_v6/index.php?json=getGames";
const EKSTRA_URL =
  "https://www.lotto.pl/api/lotteries/draw-results/by-gametype?game=EkstraPremia&index=1&size=1&sort=drawDate&order=DESC";

const LOTTO_URL = "https://app.lotto.pl/wyniki/?type=dl";
const LOTTO_PLUS_URL = "https://app.lotto.pl/wyniki/?type=lp";
const SUPER_STANZA_URL = "https://app.lotto.pl/wyniki/?type=ss14";
const EUROJACKPOT_URL = "https://app.lotto.pl/wyniki/?type=ej";
const MINI_LOTTO_URL = "https://app.lotto.pl/wyniki/?type=el";

const LOTTO_ID = "61dbf483cc484f2c593b3953";
const LOTTO_PLUS_ID = "61dbf4d3cc484f2c593b3958";
const MINI_LOTTO_ID = "61dbf6a8cc484f2c593b396a";
const EUROJACKPOT_ID = "61dbf513cc484f2c593b395d";
const EKSTRA_PENSJA_ID = "61dbf75ecc484f2c593b3970";
const EKSTRA_PREMIA_ID = "61dbf7a2cc484f2c593b3973";

/* Super Numbers will be same for every lottery except EUROJACKPOT. EUROJACKPOT does not have any super number. */

const addNumbers = async () => {
  let date;
  let resultArr = [];
  let temp_date;
  let obj;
  let result = {};
  let newDate;
  let CurrentDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  // const date3 = new Date(CurrentDate);
  try {
    let lottoResult = await superagent.get(LOTTO_URL);
    if (lottoResult.statusCode == 200) {
      lottoResult = lottoResult.text;
      let newObj = [];
      resultArr = lottoResult.split("\n");
      date = new Date(resultArr[0]);
      newDate = moment(date).format("YYYY-MM-DD");
      let datas = await getData(newDate, LOTTO_ID, 1);
      if (datas <= 4) {
        resultArr.splice(0, 1);
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(LOTTO_ID),
              winning_number: parseInt(resultArr[s]),
              type: 1,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }
      result = await LotteryWinnerDB.insertMany(newObj);
      let resObj = {
        message: "Lotto Numbers Added",
        result: result,
      };

      console.log({ msg: resObj.message, res: result.length, date: date });
    }
  } catch (err) {
    console.log("Lotto numbers not inserted");
  }

  try {
    let lottoPlusResult = await superagent.get(LOTTO_PLUS_URL);
    if (lottoPlusResult.statusCode == 200) {
      lottoPlusResult = lottoPlusResult.text;
      let newObj = [];
      resultArr = lottoPlusResult.split("\n");
      date = new Date(resultArr[0]);
      newDate = moment(date).format("YYYY-MM-DD");
      let datas = await getData(newDate, LOTTO_PLUS_ID, 1);
      if (datas <= 4) {
        resultArr.splice(0, 1);
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(LOTTO_PLUS_ID),
              winning_number: parseInt(resultArr[s]),
              type: 1,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }
      result = await LotteryWinnerDB.insertMany(newObj);
      let resObj = {
        message: "Lotto Plus Numbers Added",
        result: result,
      };
      console.log({ msg: resObj.message, res: result.length, date: date });
    }
  } catch (err) {
    console.log("Lotto Plus numbers not inserted");
  }

  try {
    let miniLottoResult = await superagent.get(MINI_LOTTO_URL);
    if (miniLottoResult.statusCode == 200) {
      miniLottoResult = miniLottoResult.text;
      let newObj = [];
      resultArr = miniLottoResult.split("\n");
      date = new Date(resultArr[0]);
      newDate = moment(date).format("YYYY-MM-DD");
      let datas = await getData(newDate, MINI_LOTTO_ID, 1);
      if (datas <= 4) {
        resultArr.splice(0, 1);
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(MINI_LOTTO_ID),
              winning_number: parseInt(resultArr[s]),
              type: 1,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }
      result = await LotteryWinnerDB.insertMany(newObj);
      let resObj = {
        message: "Mini Lotto Numbers Added",
        result: result,
      };
      console.log({ msg: resObj.message, res: result.length, date: date });
    }
  } catch (err) {
    console.log("Mini Lotto numbers not inserted");
  }

  try {
    let superStanzaResult = await superagent.get(SUPER_STANZA_URL);
    if (superStanzaResult.statusCode == 200) {
      superStanzaResult = superStanzaResult.text;
      let newObj = [];
      resultArr = superStanzaResult.split("\n");
      date = new Date(resultArr[0]);
      newDate = moment(date).format("YYYY-MM-DD");
      let datas = await getData(newDate, LOTTO_ID, 2);
      if (datas <= 4) {
        resultArr.splice(0, 1);
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(LOTTO_ID),
              winning_number: parseInt(resultArr[s]),
              type: 2,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }
      let data1 = await getData(newDate, LOTTO_PLUS_ID, 2);
      if (data1 <= 4) {
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(LOTTO_PLUS_ID),
              winning_number: parseInt(resultArr[s]),
              type: 2,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }

      let data2 = await getData(newDate, MINI_LOTTO_ID, 2);
      if (data2 <= 4) {
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(MINI_LOTTO_ID),
              winning_number: parseInt(resultArr[s]),
              type: 2,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }
      result = await LotteryWinnerDB.insertMany(newObj);
      let resObj = {
        message: "Super Stanza Numbers Added",
        result: result,
      };
      console.log({ msg: resObj.message, res: result.length, date: date });
    }
  } catch (err) {
    console.log("Super Stanza numbers not inserted");
  }

  try {
    let euroResult = await superagent.get(EUROJACKPOT_URL);
    if (euroResult.statusCode == 200) {
      euroResult = euroResult.text;
      let newObj = [];
      resultArr = euroResult.split("\n");
      date = new Date(resultArr[0]);
      newDate = moment(date).format("YYYY-MM-DD");
      let datas = await getData(newDate, EUROJACKPOT_ID, 1);
      if (datas <= 4) {
        resultArr.splice(0, 1);
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(EUROJACKPOT_ID),
              winning_number: parseInt(resultArr[s]),
              type: 1,
              date: date,
            };

            newObj.push(ObjectLotery);
          }
        }
      }
      result = await LotteryWinnerDB.insertMany(newObj);
      let resObj = {
        message: "EuroJackpot Numbers Added",
        result: result,
      };
      console.log({ msg: resObj.message, res: result.length, date: date });
    }
  } catch (err) {
    console.log("EuroJackpot Numbers not inserted");
  }

  try {
    let ekstraResult = await superagent.get(EKSTRA_URL);
    if (ekstraResult.statusCode == 200) {
      ekstraResult = JSON.parse(ekstraResult.text);
      let newObj = [];
      let epObj;
      obj = ekstraResult.items[0];
      epObj = obj.results[1];

      date = moment(epObj.drawDate).utcOffset(0);
      date = date.set({ h: 0, m: 0 });
      date = new Date(date);
      let newDate2 = moment(date).format("YYYY-MM-DD");
      let datas = await getData(newDate2, EKSTRA_PENSJA_ID, 1);
      if (datas <= 4) {
        resultArr = epObj.resultsJson;
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(EKSTRA_PENSJA_ID),
              winning_number: parseInt(resultArr[s]),
              type: 1,
              date: date,
            };
            newObj.push(ObjectLotery);
          }
        }
      }
      obj = ekstraResult.items[0];
      epObj = obj.results[0];

      date = moment(epObj.drawDate).utcOffset(0);
      date = date.set({ h: 0, m: 0 });
      date = new Date(date);
      newDate2 = moment(date).format("YYYY-MM-DD");
      let data1 = await getData(newDate2, EKSTRA_PREMIA_ID, 1);
      if (data1 <= 4) {
        resultArr = epObj.resultsJson;
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(EKSTRA_PREMIA_ID),
              winning_number: parseInt(resultArr[s]),
              type: 1,
              date: date,
            };
            newObj.push(ObjectLotery);
          }
        }
      }
      obj = ekstraResult.items[0];
      epObj = obj.results[2];

      date = moment(epObj.drawDate).utcOffset(0);
      date = date.set({ h: 0, m: 0 });
      date = new Date(date);
      newDate2 = moment(date).format("YYYY-MM-DD");
      let data2 = await getData(newDate2, EKSTRA_PREMIA_ID, 2);
      if (data2 <= 4) {
        resultArr = epObj.resultsJson;
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(EKSTRA_PREMIA_ID),
              winning_number: parseInt(resultArr[s]),
              type: 2,
              date: date,
            };
            newObj.push(ObjectLotery);
          }
        }
      }

      let data3 = await getData(newDate2, EKSTRA_PENSJA_ID, 2);
      if (data3 <= 4) {
        for (s = 0; s < resultArr.length; s++) {
          if (resultArr[s] != "") {
            let ObjectLotery = {
              lottery_id: mongoose.Types.ObjectId(EKSTRA_PENSJA_ID),
              winning_number: parseInt(resultArr[s]),
              type: 2,
              date: date,
            };
            newObj.push(ObjectLotery);
          }
        }
      }
      result = await LotteryWinnerDB.insertMany(newObj);
      let resObj = {
        message: "EKSTRA Numbers Added",
        result: result,
      };
      console.log({ msg: resObj.message, res: result.length, date: date });
    }
  } catch (err) {
    console.log(err);
    console.log("Ekstra Numbers not inserted");
  }
};

new cron.schedule("0 * * * *", async function () {
  console.log("start");

  // let data = await LotteryWinnerDB.deleteMany({
  //   date: date,
  // });
  // console.log(data);
  try{
    // console.log(date);
    await addNumbers();
  } catch (err) {
    console.log(err);
  }
  console.log("completed");
});

const getData = async (date, id, type) => {
  const data = await LotteryWinnerDB.find({
    lottery_id: mongoose.Types.ObjectId(id),
    date: date,
    type: type,
  });

  return data.length;
};

// addNumbers();
