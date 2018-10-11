
/**
 * Initialize file upload.
 *
 * @param {Object} { accept, type }
 * @return {Promise}
 */

export function uploadFile ({ accept, type, maxSize }) {
  if (typeof accept !== 'string') return Promise.reject('"accept" is required')
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.style.width = '0px'
    input.style.height = '0px'
    input.style.overflow = 'hidden'
    input.setAttribute('type', 'file')
    input.setAttribute('accept', accept)
    input.onchange = () => {
      input.parentNode.removeChild(input) // remove from the dom
      const file = input.files[0]
      if (!file) return reject(new UploadError('file not selected', { type: 'fileNotSelected' }))
      if (maxSize && file.size > maxSize) {
        return reject(new UploadError(`File is too big. Size limit is ${Math.round(maxSize / 1024.0)} KB`, { type: 'fileSizeLimit' }))
      }

      const fileReader = new FileReader()
      fileReader.onerror = (e) => {
        reject(e.target.error)
      }
      fileReader.onload = (e) => {
        resolve(e.target.result)
      }
      switch (type) {
        case 'text': return fileReader.readAsText(file)
        case 'dataURL': return fileReader.readAsDataURL(file)
        default: return reject(new UploadError(`invalid type: "${type}"`, { type: 'invalidType' }))
      }
    }
    document.body.appendChild(input)
    input.click()
  })
}

/**
 * Initialize `content` download.
 *
 * @param {Object} { content, name, extension }
 */

export function downloadFile ({ content, name, extension }) {
  const fullName = extension ? `${name}.${extension}` : name

  // Microsoft IE/Edge specific
  if (window.Blob && window.navigator.msSaveOrOpenBlob) {
    const blobObject = new Blob([content])
    window.navigator.msSaveOrOpenBlob(blobObject, fullName)
  } else {
    const link = document.createElement('a')
    link.setAttribute('href', encodeToDataURL(content, extension))
    link.setAttribute('download', fullName)
    document.body.appendChild(link)
    link.onclick = () => {
      link.parentNode.removeChild(link)
    }
    link.click()
  }
}

/**
 * `UploadError`.
 */

export class UploadError extends Error {
  constructor (reason, { type }) {
    super(reason)
    this.type = type
  }
}

/**
 * Encode `body` to dataURL.
 *
 * @param {String} body
 * @param {String} extension
 * @return {String}
 */

export function encodeToDataURL (body, extension) {
  const mime = mimetype(extension)
  try {
    return `data:${mime};base64,77u/` + btoa(body)
  } catch (err) {
    return encodeURI(`data:${mime};charset=utf-8,` + body)
  }
}

/**
 * Detect mimetype by `extension`.
 *
 * @param {String} extension
 * @return {String}
 */

export function mimetype (extension) {
  switch (extension) {
    case 'csv': return 'text/csv'
    default: return 'text/plain'
  }
}
