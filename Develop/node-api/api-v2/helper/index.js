const moment = require('moment')
const fs = require('fs')

exports.generateRandomString = (length, isNumber = false) => {
  var result = ''
  if (isNumber) {
    var characters = '0123456789'
  } else {
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
  z
}

exports.getCategoryType = (type) => {
  if (type === 1) {
    return 'Event'
  } else if (type === 2) {
    return 'Business'
  }
  return ''
}

exports.getNotificationText = async (type) => {
  let text = ''
  if (type === 1) {
    text = 'Sent you a friend request'
  } else if (type === 2) {
    text = 'Started follow you'
  } else if (type === 3) {
    text = 'accepted your friend request'
  }
  return text
}

exports.uploadFileInS3 = async (folderName, file) => {
  // console.log(file);
  return new Promise(async function (resolve, reject) {
    const s3Client = s3.s3Client
    const params = s3.uploadParams

    params.Key =
      folderName + exports.generateRandomString(6) + '_' + file.originalname
    params.Body = file.buffer
    await s3Client.upload(params, async (err, data) => {
      if (err) {
        // return false;
        reject(err)
      } else {
        resolve(data)
      }
      // return true;
    })
  })
}

exports.getValidImageUrl = async (filename, name = 'SH') => {
  if (filename === '' || filename === undefined || filename === null) {
    filename =
      'https://ui-avatars.com/api/?name=' +
      name +
      '&rounded=true&background=c39a56&color=fff'
  } else {
    filename = process.env.URL + 'uploads/' + filename
  }
  return filename
}

exports.getImageUrl = async (filename, name = 'SH') => {
  if (filename === '' || filename === undefined || filename === null) {
    filename =
      'https://ui-avatars.com/api/?name=' +
      name +
      '&rounded=true&background=c39a56&color=fff'
  } else {
    filename = process.env.URL + filename
  }
  return filename
}

exports.writeErrorLog = async (req, error) => {
  const requestURL = req.protocol + '://' + req.get('host') + req.originalUrl
  const requestBody = JSON.stringify(req.body)
  const date = moment().format('MMMM Do YYYY, h:mm:ss a')
  fs.appendFileSync(
    'errorLog.log',
    'REQUEST DATE : ' +
      date +
      '\n' +
      'API URL : ' +
      requestURL +
      '\n' +
      'API PARAMETER : ' +
      requestBody +
      '\n' +
      'Error : ' +
      error +
      '\n\n'
  )
}

exports.getSlugName = (title) => {
  const titleLOwerCase = title.toLowerCase()
  const slug = titleLOwerCase.replace(' ', '-')
  return slug
}

//
exports.businessStatus = async (data) => {
  let result = 'close'
  if (parseInt(data) === 1) {
    result = 'open'
  }
  return result
}
exports.replaceCountryCode = async (mobile_number) => {
  if (mobile_number.includes('+')) {
    return mobile_number.replace(/[|&;$%@"<>()+,]/g, '')
  }
  // if (pattern.test(mobile_number)) {
  //   return mobile_number.replace(/[|&;$%@"<>()+,]/g, '')
  // }
}

//
exports.getValidImageUrl = async (filename, name = 'SH') => {
  filename = process.env.URL + filename
  return filename.replace(/\\/g, '/')
}
