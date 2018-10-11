import passwordForm from './password'

export default function passwordConfirmForm (selector, opts) {
  if (!opts.passwordField) throw new Error('passwordField is required')
  return (form) => {
    const passwordConfirm = passwordForm(selector, opts)(form)
    const password = form.get(opts.passwordField)

    passwordConfirm.$el.addEventListener('input', validatePasswordConfirm)
    password.$el.addEventListener('input', validatePasswordConfirm)

    return passwordConfirm

    function validatePasswordConfirm () {
      const value = passwordConfirm.getValue()
      if (!value || !password.getValue()) {
        passwordConfirm.setState()
      } else if (value !== password.getValue()) {
        passwordConfirm.setState({ isInvalid: true })
      } else {
        passwordConfirm.setState({ isValid: true })
      }
    }
  }
}
