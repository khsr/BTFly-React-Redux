import request from '../../utils/request'

export const sendSupportRequest = (attrs) => {
  return () => {
    const postRequest = (imageUrl = null) => {
      const body = {
        imageUrl,
        content: attrs.content,
        topic: attrs.topic
      }
      return request('/api/support', 201, { method: 'post', body })
    }
    if (attrs.imageSrc) {
      return uploadImageSrc(attrs.imageSrc).then((url) => postRequest(url))
    }
    return postRequest()
  }
}

export function uploadImageSrc (imageSrc) {
  return request('/api/upload', 201, { method: 'post', body: { base64Data: imageSrc } })
  .then((res) => res.url)
}
