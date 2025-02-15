const express = require('express')
const router = express.Router()
const multer = require('multer')
const adminCheckAuth = require('../middleware/admin-check-auth')
const AdminController = require('../controllers/admin')
const Helper = require('../helper/index')

const storage = multer.diskStorage({
  destination: './uploads/profile',
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

router.post('/signup', AdminController.signup)

router.post('/login', AdminController.login)

router.post('/auth', adminCheckAuth, AdminController.auth)

router.put(
  '/update-profile/:id',
  adminCheckAuth,
  upload.single('profile_pic'),
  AdminController.update_profile
)

router.put(
  '/change-password/:id',
  adminCheckAuth,
  AdminController.change_password
)

module.exports = router
