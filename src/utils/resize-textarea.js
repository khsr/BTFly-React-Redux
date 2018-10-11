
/**
 * Resize textarea `$el` during `input` event.
 *
 * @param {Element} $el
 * @param {Object} opts
 */

export default function resizeTextarea ($el, { size } = {}) {
  $el.addEventListener('input', onInput)
  onInput()

  function onInput () {
    $el.style.height = 'auto'
    $el.style.height = `calc(${$el.scrollHeight}px - ${size || '0rem'})`
  }
}
