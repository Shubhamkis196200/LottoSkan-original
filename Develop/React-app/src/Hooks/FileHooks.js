import { useState } from 'react'

const FileHook = ({ validation, rule, size, ifId }) => {
  const [error, setError] = useState('')
  const [file, setFile] = useState('')
  const [imagePreview, setImagePreview] = useState([])

  const onChange = async (e) => {
    let files = e.target.files
    const checkFileSize = await calculateSize(files, size)

    if (!checkFileSize) {
      setError(`Please select less then ${size} md image`)
      setFile([])
      setImagePreview([])
    } else {
      const [checkValidation, preview] = await getFileExtension(
        files,
        validation
      )
      if (!checkValidation) {
        setError('Please select valid image')
        setImagePreview([])
      } else {
        setError('')
        setImagePreview(preview)
        setFile(files)
      }
    }
  }
  const FileSubmit = (id) => {
    let validation = true

    if (!id) {
      if (rule === 'required') {
        if (error) {
          validation = false
          return
        }
        if (!file) {
          validation = false
          setError('Please select image')
        }
      }
    }
    if (error) {
      validation = false
    }

    return validation
  }

  const defaultError = () => {
    setError('')
    setFile('')
  }
  const defaultFile = (data) => {
    let image = []
    for (const i of data) {
      image.push(i.image)
    }
    setImagePreview(image)
  }
  //    file : this is an actual file
  //    onChange: Change File
  //    error return error when getting any kind of error
  return [
    file,
    onChange,
    imagePreview,
    error,
    FileSubmit,
    defaultError,
    defaultFile,
  ]
}

export default FileHook

// return file extension

const getFileExtension = (files, validation) => {
  let result = true
  let previewFile = []
  let imageFile = []
  for (const file of files) {
    const [extension] = file.name.split('.').reverse()
    if (!validation.includes(extension.toLowerCase())) {
      result = false
    }
    previewFile.push(URL.createObjectURL(file))
    imageFile.push(file)
  }
  return [result, previewFile, imageFile]
}

const calculateSize = (files, validation) => {
  let result = true
  for (const file of files) {
    if (file.size / 1024 / 1024 > validation) {
      result = false
      break
    }
  }
  return result
}
