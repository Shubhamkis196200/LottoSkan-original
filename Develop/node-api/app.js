const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dbConfig = require('./api/config/db')

/*Old Version API Routes Start Here*/
const adminRoutes = require('./api/routes/admin')
const adminLotteryRoutes = require('./api/routes/admin_lottery')
const adminWinnerLotteryRoutes = require('./api/routes/admin_winner')
const adminWinnerAmount = require('./api/routes/admin_winner_amount')
const adminReport = require('./api/routes/admin_report')
const appLotteryRoutes = require('./api/routes/app_lottery')
const appScanRoutes = require('./api/routes/app_scan')
/*Old Version API Routes End Here*/

/*v2 Version API Routes Start Here*/
const adminRoutesV2 = require('./api-v2/routes/admin')
const adminLotteryRoutesV2 = require('./api-v2/routes/admin_lottery')
const adminWinnerLotteryRoutesV2 = require('./api-v2/routes/admin_winner')
const adminWinnerAmountV2 = require('./api-v2/routes/admin_winner_amount')
const adminReportV2 = require('./api-v2/routes/admin_report')
const appLotteryRoutesV2 = require('./api-v2/routes/app_lottery')
const appScanRoutesV2 = require('./api-v2/routes/app_scan')
/*v2 Version API Routes End Here*/

/*v3 Version API Routes Start Here*/
const adminRoutesV3 = require('./api-v3/routes/admin')
const adminLotteryRoutesV3 = require('./api-v3/routes/admin_lottery')
const adminWinnerLotteryRoutesV3 = require('./api-v3/routes/admin_winner')
const adminWinnerAmountV3 = require('./api-v3/routes/admin_winner_amount')
const adminReportV3 = require('./api-v3/routes/admin_report')
const appLotteryRoutesV3 = require('./api-v3/routes/app_lottery')
const appScanRoutesV3 = require('./api-v3/routes/app_scan')
/*v3 Version API Routes End Here*/


mongoose.Promise = global.Promise
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use('/reports', express.static('reports'))
app.use('/img', express.static('img'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})

/*Old Version API Routes Start Here*/
app.use('/api/admin', adminRoutes)
app.use('/api/lottery/admin', adminLotteryRoutes)
app.use('/api/winner/admin', adminWinnerLotteryRoutes)
app.use('/api/amount/admin', adminWinnerAmount)
app.use('/api/lottery/app', appLotteryRoutes)
app.use('/api/scan/app', appScanRoutes)
app.use('/api/report/admin', adminReport)
/*Old Version API Routes End Here*/

/*V2 Version API Routes Start Here*/
app.use('/api/v2/admin', adminRoutesV2)
app.use('/api/v2/lottery/admin', adminLotteryRoutesV2)
app.use('/api/v2/winner/admin', adminWinnerLotteryRoutesV2)
app.use('/api/v2/amount/admin', adminWinnerAmountV2)
app.use('/api/v2/lottery/app', appLotteryRoutesV2)
app.use('/api/v2/scan/app', appScanRoutesV2)
app.use('/api/v2/report/admin', adminReportV2)
/*V2 Version API Routes End Here*/

/*V3 Version API Routes Start Here*/
app.use('/api/v3/admin', adminRoutesV3)
app.use('/api/v3/lottery/admin', adminLotteryRoutesV3)
app.use('/api/v3/winner/admin', adminWinnerLotteryRoutesV3)
app.use('/api/v3/amount/admin', adminWinnerAmountV3)
app.use('/api/v3/lottery/app', appLotteryRoutesV3)
app.use('/api/v3/scan/app', appScanRoutesV3)
app.use('/api/v3/report/admin', adminReportV3)
/*V3 Version API Routes End Here*/

app.use('/cancel', (req, res) => {
  console.log('cancel')
  console.log(req)
})
app.use('/success', (req, res) => {
  console.log('success')
  console.log(req)
})

app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    message: error.message,
  })
})

module.exports = app
