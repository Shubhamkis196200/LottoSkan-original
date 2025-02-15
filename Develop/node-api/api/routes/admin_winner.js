const express = require('express')
const router = express.Router()
const makeRequest = require('../middleware/make-request')
const adminCheckAuth = require('../middleware/admin-check-auth')
const WinnerController = require('../controllers/admin_winner')
//
router.post('/', makeRequest, adminCheckAuth, WinnerController.add)
router.get('/:id', makeRequest, adminCheckAuth, WinnerController.get)

module.exports = router
