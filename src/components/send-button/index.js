
/**
 * Toggle button with spinner during ajax request.
 *
 * @param {Element} button
 * @param {Object} opts
 * @return {Function} stopSpinner
 */

export default function sendButton ($button, opts = {}) {
  const html = $button.innerHTML
  const padding = $button.style.padding
  const greenClass = opts.isDarkGreen ? ' send-button-placeholder__icon--is-dark-green' : ''
  const { offsetWidth: width, offsetHeight: height } = $button

  $button.style.width = $button.offsetWidth + 'px'
  $button.style.padding = '0'
  $button.setAttribute('disabled', true)
  $button.setAttribute('no-spinner', true)
  $button.innerHTML = `
  <div class="send-button-placeholder" style="width: ${width}px; height: calc(${height}px - 0.2rem)">
    <div class="send-button-placeholder__icon${greenClass}"></div>
  </div>`

  return function stopSpinner () {
    $button.innerHTML = html
    $button.removeAttribute('no-spinner')
    $button.style.padding = padding
    $button.style.width = 'auto'
  }
}
