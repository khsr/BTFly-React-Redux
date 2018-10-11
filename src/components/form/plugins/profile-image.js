import { readProfileImage } from '../../../utils/profile-image'

export default function profileImage (inputSelector, imgSelector, errorSelector, spanSelector) {
  return (form) => {
    const image = form.addField(imgSelector)
    const $input = form.$el.querySelector(inputSelector)
    const $error = form.$el.querySelector(errorSelector)
    const $span = form.$el.querySelector(spanSelector)

    $input.style.opacity = 0
    $input.style.position = 'absolute'

    $span.addEventListener('click', (e) => {
      e.preventDefault()
      $input.click()
    })
    $input.addEventListener('change', onChangeProfileImage)

    image.getValue = () => {
      const src = image.$el.src
      // if there is http or '/' in the src then we know the image is a hyperlink, and not locally uploaded data
      if ((src.indexOf('http') === 0) || (src.indexOf('/') === 0)) {
        return null
      }
      return src
    }

    image.use(() => {
      image.setState({ isValid: true, noValid: true })
    })

    function onChangeProfileImage () {
      readProfileImage($input, $error, image.$el, (hasError) => {
        image.setState({ isValid: !hasError, noValid: true })
      })
    }
  }
}
