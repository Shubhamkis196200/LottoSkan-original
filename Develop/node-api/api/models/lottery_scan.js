const mongoose = require('mongoose')
const { Schema } = mongoose
let aggregatePaginate = require('mongoose-aggregate-paginate-v2')
let mongoosePaginate = require('mongoose-paginate-v2')

const LotteryScanSchema = new Schema(
  {
    lottery_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
)

LotteryScanSchema.plugin(aggregatePaginate)
LotteryScanSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('lottery_scan', LotteryScanSchema)
