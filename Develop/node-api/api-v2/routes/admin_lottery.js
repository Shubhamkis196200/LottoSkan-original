const express = require('express')
const router = express.Router()
const multer = require('multer')
const adminCheckAuth = require('../middleware/admin-check-auth')
const Helper = require('../helper/index')
const LotteryController = require('../controllers/admin_lottery')
const makeRequest = require('../middleware/make-request')
const storage = multer.diskStorage({
  destination: './uploads/lottery',
  filename: function (req, file, cb) {
    cb(null, Helper.generateRandomString(5) + '-' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  // Reject file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
})

router.post(
  '/',
  makeRequest,
  adminCheckAuth,
  upload.single('image'),

  LotteryController.add
)
router.get('/', makeRequest, adminCheckAuth, LotteryController.get)
router.put(
  '/change-status/:id',
  makeRequest,
  adminCheckAuth,
  LotteryController.changeStatus
)

module.exports = router
