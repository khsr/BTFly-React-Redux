import initDebug from 'debug'
import sendButton from '../../components/send-button'
const debug = initDebug('bf:components/form')

// this is to distinguish between: a field that has been evaluated and has correct contents,
// a field that has been evaluated and has incorrect contents and
// a field that was never evaluated but initialized with what should be a correct value at construction of the form

const fieldValidationStateValid = 1
const fieldValidationStateInvalid = 0
const fieldValidationStateNotEvaluated = -1

class FormField {

  /**
   * Init new `FormField` to `$el`.
   *
   * @param {Element} $el
   * @param {Function} onChange
   * @param {Boolean} validateDuringConstruction
   */

  constructor ($el, onChange, validateDuringConstruction) {
    debug('init form-field %o', $el)
    this.$el = $el
    this.onChange = onChange

    if (validateDuringConstruction) {
      this.validationState = fieldValidationStateInvalid
    } else {
      this.validationState = fieldValidationStateNotEvaluated
    }
    this.validateDuringConstruction = validateDuringConstruction
    this.$el.insertAdjacentHTML('beforebegin', '<span class="form-input__icon"></span>')
    this.$icon = this.$el.parentElement.querySelector('.form-input__icon')
  }

  /**
   * Value getter.
   */

  getValue () {
    throw new Error('define getValue() callback')
  }

  /**
   * Register validator plugin.
   *
   * @param {Function} plugin
   */

  use (plugin) {
    this.$el.addEventListener('input', () => plugin(this.getValue()))
    if (this.validateDuringConstruction) plugin(this.getValue())
  }

  /**
   * Set input to 3 possible states: default, invalid, valid
   *
   * @param {Object} { isValid, isInvalid }
   */

  setState ({ isValid, isInvalid, noValid } = {}) {
    if (isInvalid) {
      this.$icon.classList.add('form-input__icon--invalid')
      this.$el.classList.add('form-input--invalid')
    } else {
      this.$icon.classList.remove('form-input__icon--invalid')
      this.$el.classList.remove('form-input--invalid')
    }
    if (!noValid) {
      if (isValid) {
        this.$icon.classList.add('form-input__icon--valid')
        this.$el.classList.add('form-input--valid')
      } else {
        this.$el.classList.remove('form-input--valid')
        this.$icon.classList.remove('form-input__icon--valid')
      }
    } else {
      this.$el.classList.remove('form-input--valid')
      this.$icon.classList.remove('form-input__icon--valid')
    }

    this.validationState = isValid ? fieldValidationStateValid : fieldValidationStateInvalid
    this.onChange()
  }
}

export default class Form {

  /**
   * Init new form with `selector`.
   *
   * @param $el element or selector
   * @param {Boolean} validateDuringConstruction   if true will execute all field validators when form is initialized
   */

  constructor ($el, validateDuringConstruction = true) {
    debug('init form "%s" %o', $el, this)
    this.$el = typeof $el === 'string' ? document.querySelector($el) : $el
    this.$button = this.$el.querySelector('[type="submit"]')
    this.fields = []
    this.selectors = {}
    this.isValid = false
    this.validateDuringConstruction = validateDuringConstruction
    if (!this.$button) throw new Error('add submit button')
  }

  /**
   * Use `plugin()`.
   *
   * @return {Form}
   */

  use (plugin) {
    plugin(this)
    return this
  }

  /**
   * Get field by `selector`.
   *
   * @param {}
   */

  get (selector) {
    return this.selectors[selector]
  }

  /**
   * Register `onSubmit` callback.
   *
   * @param {Function} onSubmit (values, stopSpinner)
   * @return {Form}
   */

  onSubmit (fn) {
    debug('register subdmit callback')
    const submit = (e) => {
      e.preventDefault()
      if (this.$button.hasAttribute('disabled')) return debug('form is disabled')
      const stopSpinner = sendButton(this.$button)
      fn(this.fields.map((field) => field.getValue()), () => {
        stopSpinner()
        this.isValid = false
        this.$button.setAttribute('disabled', true)
      })
    }
    this.$button.addEventListener('click', submit)
    this.$el.addEventListener('submit', submit)
    return this
  }

  /**
   * Add new FormField by `selector`.
   *
   * @param {String} selector
   */

  addField (selector) {
    const $el = this.$el.querySelector(selector)
    if (!$el) throw new Error(`can not find "${selector}"`)
    if (this.fields[selector]) throw new Error(`"${selector}" is already registered`)
    const field = new FormField($el, () => this.onChange(), this.validateDuringConstruction)
    this.selectors[selector] = field
    this.fields.push(field)
    return field
  }

  /**
   * Toggle local state when one of the fields has changed.
   */

  onChange () {
    const isValid = this.fields.every((field) => {
      return field.validationState === fieldValidationStateValid ||
             field.validationState === fieldValidationStateNotEvaluated
    })
    if (this.isValid !== isValid) {
      debug('change valid state to "%s"', isValid)
      this.isValid = isValid
      if (isValid) {
        this.$button.removeAttribute('disabled')
      } else {
        this.$button.setAttribute('disabled', true)
      }
    }
  }
}
