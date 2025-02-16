const moment = require('moment')
const fs = require('fs')

exports.generateRandomString = async (length = 6, isNumber) => {
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

exports.writeErrorLog = async (req, error) => {
  const requestURL = req.protocol + '://' + req.get('host') + req.originalUrl
  const requestBody = JSON.stringify(req.body)
  const requestHeaders = JSON.stringify(req.headers)
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
      'API Headers : ' +
      requestHeaders +
      '\n' +
      'Error : ' +
      error +
      '\n\n'
  )
}
