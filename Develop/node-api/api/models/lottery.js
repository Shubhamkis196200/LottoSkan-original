const mongoose = require('mongoose')
let aggregatePaginate = require('mongoose-aggregate-paginate-v2')
let mongoosePaginate = require('mongoose-paginate-v2')
const { Schema } = mongoose

const LotterySchema = new Schema(
  {
    lottery_name: {
      type: String,
      required: true,
    },
    lottery_image: {
      type: String,
      required: true,
    },
    lottery_number: {
      type: String,
      required: true,
    },
    flag: {
      type: Number,
      default: 1,
      enum: [1, 2], // 1 active 2 deactivate
    },
    note: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
    },
    super_btn: {
      type: Number,
      enum: [1, 2] //1=true, 2=false
    },
    scan: {
      type: Number,
      enum: [1, 2] // 1=true, 2=false
    }
  },
  { timestamps: true }
)
LotterySchema.plugin(aggregatePaginate)
LotterySchema.plugin(mongoosePaginate)

module.exports = mongoose.model('lottery', LotterySchema)
