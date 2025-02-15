export const checkRequiredValidationWithMinMax = (
  text,
  field,
  min,
  max,
  required = true,
  regex = false
) => {
  let error = ''
  if (required === true) {
    if (text === '') {
      console.log(field)
      return (error = `${field} field is required`)
    }
  }
  if (text.length < min) {
    error = `${field} must be grater than ` + min + ' characters'
  }
  if (text.length > max) {
    error = `${field} field must be less than ` + max + ' characters'
  }
  if (regex && !text.match(/^[A-Za-z0-9_.]+$/)) {
    error = `Enter Valid ${field}`
  }
  return error
}

export const checkEmailValidation = (emailText, required = true) => {
  let error = ''

  if (required === true) {
    if (emailText === '') {
      return (error = 'This field is required')
    }
  }

  const pattern =
    /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*@[a-z0-9]+([a-z0-9]+)*(\.[a-z0-9]+([a-z0-9]+)*)*\.[a-z]{2,4}$/
  if (pattern.test(emailText)) {
    return ''
  } else {
    error = 'Bad email address: ' + emailText
  }
  return error
}

export const checkMultipleChekboxSelectionWithMinMax = (
  array,
  min = 0,
  max = 10000000
) => {
  let ids = []
  array.forEach((element, index) => {
    if (element === true) {
      ids.push(index)
    }
  })
  let response = {}
  response.error = ''
  response.data = ids
  if (ids.length < min) {
    response.error = 'Minimum ' + min + ' item selections is required'
  }

  if (ids.length > max) {
    response.error = 'Maximum item selections is ' + min
  }
  return response
}

export const checkEmptyValidation = (field, text) => {
  let error = ''

  if (field === '' || field === undefined || field === null) {
    error = `${text} field is required`
  }
  return error
}

export const checkMobileNumberValidation = (
  field,
  text,
  min,
  max,
  minNumber = false
) => {
  let error = ''

  if (field === '' || field === undefined || field === null) {
    return (error = `${text} field is required`)
  }
  let field1 = parseInt(field)
  if (!Number.isInteger(field1)) {
    return (error = `${text} field must be a number`)
  }
  if (field.length < min) {
    return (error = `${text} must be greater then ` + min + ' digit')
  }
  if (field.length > max) {
    return (error = `${text} field must be less then ` + max + ' digit')
  }
  if (minNumber && field <= 0) {
    return (error = `${text} field must be greater then 1`)
  }
  return error
}

//
export const mobileNumberWithCountrycode1 = (field, text, max) => {
  let error = ''
  if (field === null || field === undefined || field === '') {
    return (error = `${text} field is required`)
  }

  if (field.length > max) {
    return (error = `${text} field must be less than ` + max + ' digit')
  }
  const pattern = /^(\+?\d{1,3}|\d{1,4})$/gm

  if (!pattern.test(field)) {
    return 'Please enter valid code'
  } else {
    error = ''
  }
  return error
}

//
export const mobileNumberWithCountrycode = (field, text, max) => {
  let error = ''
  if (field === null || field === undefined || field === '') {
    return (error = `${text} field is required`)
  }

  if (field.length > max) {
    return (error = `${text} field must be less than ` + max + ' digit')
  }
  const pattern = /^\+[1-9]{1}[0-9]{3,14}$/

  if (!pattern.test(field)) {
    return 'Please enter valid number'
  } else {
    error = ''
  }
  return error
}
