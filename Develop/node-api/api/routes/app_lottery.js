const express = require('express')
const router = express.Router()
const makeRequest = require('../middleware/make-request')
const ControllerLottery = require('../controllers/app_lottery')
router.get('/', makeRequest, ControllerLottery.get)

module.exports = router
