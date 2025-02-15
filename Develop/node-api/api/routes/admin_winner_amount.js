const express = require('express')
const router = express.Router()
const makeRequest = require('../middleware/make-request')
const adminCheckAuth = require('../middleware/admin-check-auth')
const AmountController = require('../controllers/admin_winner_amount')

//
router.post('/', makeRequest, adminCheckAuth, AmountController.add)
router.get('/:id', makeRequest, adminCheckAuth, AmountController.get)

module.exports = router
