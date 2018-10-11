import { imageScaler } from './image.js'

const minImageWidth = 200
const minImageHeight = 200

export function readProfileImage ($fileInput, $error, $img, next) {
  const file = $fileInput.files[0]
  const fileReader = new FileReader()

  $error.textContent = null
  fileReader.onload = (e) => {
    const data = e.target.result
    const image = new Image()
    image.addEventListener('load', () => {
      if (image.naturalWidth < minImageWidth) {
        $error.textContent = 'Image should be at least ' + minImageWidth + ' pixels wide'
        next(true)
        return
      }
      if (image.naturalHeight < minImageHeight) {
        $error.text = 'Image should be at least ' + minImageHeight + ' pixels high'
        next(true)
        return
      }
      const scaledImage = imageScaler(image, minImageWidth, minImageHeight)
      $img.src = scaledImage
      next(false)
    })

    image.src = data

    if (image.complete) {
      image.dispatchEvent(new Event('load'))
    }
  }
  fileReader.readAsDataURL(file)
}

export function getInfoFromBase64Image (imageSrc) {
  const matches = imageSrc.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  if (matches.length !== 3) {
    throw Error('invalid image data')
  }

  const imageType = matches[1]
  const imageData = new Buffer(matches[2], 'base64')

  return { imageType, imageData }
}
