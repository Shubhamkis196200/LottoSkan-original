const express = require('express')
const makeRequest = require('../middleware/make-request')
const router = express.Router()
const controllerReport = require('../controllers/admin_report')

router.get('/', makeRequest, controllerReport.get)

module.exports = router
