const express = require('express')
const router = express.Router()
const makeRequest = require('../middleware/make-request')
const controllerScan = require('../controllers/app_scan')

router.post('/', makeRequest, controllerScan.add)

module.exports = router
