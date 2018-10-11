
export function imageScaler (image, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  let scaledWidth = 0
  let scaledHeight = 0
  if (image.height > image.width) {
    const imageRatio = image.height / image.width
    scaledHeight = canvas.width * imageRatio
    scaledWidth = canvas.width
  } else {
    const imageRatio = image.width / image.height
    scaledWidth = canvas.height * imageRatio
    scaledHeight = canvas.height
  }

  const xOfs = (canvas.width - scaledWidth) / 2
  const yOfs = (canvas.height - scaledHeight) / 2
  canvas.getContext('2d').drawImage(image, xOfs, yOfs, scaledWidth, scaledHeight)
  const result = canvas.toDataURL('image/jpg')
  canvas.remove()

  return result
}
