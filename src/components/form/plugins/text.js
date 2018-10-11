import initDebug from 'debug'
const debug = initDebug('bf:components/form/plugins/text')

export default function formText (selector, { regexp, request, noValid, noRequired } = {}) {
  return (form) => {
    const text = form.addField(selector)
    const valueCache = {}
    let isValidTimeout = null

    text.getValue = () => text.$el.value.trim()
    text.use((value) => {
      clearTimeout(isValidTimeout)
      isValidTimeout = null

      if (noRequired && !value) {
        text.setState({ isValid: true, noValid })
        debug('%s: field is empty but not mandatory', selector)
        return
      }

      if (!value) {
        debug('%s: value is empty', selector)
        text.setState()
      } else if (regexp && !regexp.test(value)) {
        debug('%s: invalid regexp', selector)
        text.setState({ isInvalid: true })
      } else if (typeof valueCache[value] !== 'undefined') {
        debug('%s: use cache "%s" as %s', selector, value, valueCache[value])
        if (valueCache[value]) {
          text.setState({ isValid: true, noValid })
        } else {
          text.setState({ isInvalid: true })
        }
      } else if (request) {
        const currentValidTimeout = setTimeout(() => {
          request(value).then((valid) => {
            debug('%s: cache "%s" as %s', selector, value, valid)
            valueCache[value] = valid
            if (currentValidTimeout !== isValidTimeout) return debug('invalid timeout')
            if (valueCache[value]) {
              text.setState({ isValid: true, noValid })
            } else {
              text.setState({ isInvalid: true })
            }
          })
        }, 300)
        isValidTimeout = currentValidTimeout
        text.setState()
      } else {
        text.setState({ isValid: true, noValid })
      }
    })
    return text
  }
}
