import isEmail from 'regex-email'
import formText from './text'
import checkEmail from '../../../utils/email'

export default function formEmail (selector, { reverse, acceptValue, noValid } = {}) {
  return (form) => {
    const emailInput = formText(selector, { regexp: isEmail, request: checkMail, noValid })(form)
    emailInput.getValue = () => emailInput.$el.value.trim().toLowerCase()
    return emailInput
  }

  function checkMail (email) {
    return checkEmail(email, { reverse, acceptValue })
  }
}
