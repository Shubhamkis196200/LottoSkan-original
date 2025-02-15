const mongoose = require('mongoose')

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_UR}:${process.env.MONGO_PWD}@trudies.ycpdm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log('Connect DB...')
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

exports.mongoose
