const mongoose = require('mongoose')
const { Schema } = mongoose
let aggregatePaginate = require('mongoose-aggregate-paginate-v2')
let mongoosePaginate = require('mongoose-paginate-v2')

const LotteryWinningNumber = new Schema(
  {
    lottery_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    date:{
      type:Date,
      default:new Date()
    },
    winning_number: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 2], //1=normal 2=super
      required: true,
      default: 1
    }
  },
  { timestamps: true }
)
LotteryWinningNumber.plugin(aggregatePaginate)
LotteryWinningNumber.plugin(mongoosePaginate)
module.exports = mongoose.model('lottery_winning_number', LotteryWinningNumber)
