import { useEffect, useState } from 'react'

const FormHooks = (validation) => {
  const [state, setState] = useState({})
  const [error, setError] = useState({})

  //  //
  useEffect(() => {
    let keysObj = {}

    for (const key in validation) {
      if (Object.hasOwnProperty.call(validation, key)) {
        keysObj[key] = ''
      }
    }

    setState(keysObj)
    setError(keysObj)
  }, [])
  //
  const onChange = (e) => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value,
    })
  }

  const setDefaultValue = (data) => {
    let newObj = {}
    for (const iterator of data) {
      for (const key in iterator) {
        if (Object.hasOwnProperty.call(iterator, key)) {
          const element = iterator[key]
          newObj[key] = element
        }
      }
    }
    setState(newObj)
  }

  //
  const OnSubmit = () => {
    let ValidationFlag = true
    let keysObj = {}
    // console.log(validation)
    for (const key in validation) {
      if (Object.hasOwnProperty.call(validation, key)) {
        let validationCheck = validation[key].rule.split('|')

        for (let i = 0; i < validationCheck.length; i++) {
          const element = validationCheck[i]
          if (element === 'required') {
            if ([undefined, null, ' ', ''].includes(state[key])) {
              ValidationFlag = false

              keysObj[key] = `${validation[key].field} field is required`
              break
            } else {
              keysObj[key] = ''
            }
          }
          if (element === 'email') {
            let regex =
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            if (!regex.test(state[key])) {
              ValidationFlag = false
              keysObj[key] = `Please enter valid ${validation[
                key
              ].field.toLowerCase()}`
              break
            } else {
              keysObj[key] = ''
            }
          }
          if (element === "number") {
            let field1 = parseInt(state[key]);
            if (!Number.isInteger(field1)) {
              ValidationFlag = false;
              keysObj[key] = `Please enter valid ${validation[key].field}`;
              break;
            } else {
              keysObj[key] = "";
            }
          }
          if (element.search('min') === 0) {
            // console.log(typeof element.split(':')[1])
            if (parseInt(element.split(':')[1]) > state[key].length) {
              ValidationFlag = false
              keysObj[key] = `${validation[key].field} field is min ${
                element.split(':')[1]
              }`
              break
            } else {
              keysObj[key] = ''
            }
          }

          if (element.search('max') === 0) {
            if (state[key]) {
              if (parseInt(element.split(':')[1]) < state[key].length) {
                ValidationFlag = false
                keysObj[key] = `${
                  validation[key].field
                } field must be less than ${element.split(':')[1]} characters`
                break
              } else {
                keysObj[key] = ''
              }
            } else {
              keysObj[key] = ''
            }
          }
          if (element === 'url') {
            if (state[key]) {
              let regex =
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
              if (!state[key].match(regex)) {
                keysObj[key] = `Please enter valid url`
              } else {
                keysObj[key] = ''
              }
            } else {
              keysObj[key] = ''
            }
          }
        }
      }
    }
    setError(keysObj)

    return ValidationFlag
  }

  const DefaultError = (data) => {
    let newObj = {}
    for (const iterator of data) {
      for (const key in iterator) {
        if (Object.hasOwnProperty.call(iterator, key)) {
          const element = iterator[key]
          newObj[key] = element
        }
      }
    }
    setError(newObj)
  }
  return [state, onChange, OnSubmit, setDefaultValue, error, DefaultError]
}

FormHooks.propTypes = {}

export default FormHooks
