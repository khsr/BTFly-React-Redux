import { requestHost } from '../../utils/request'
import Form from '../../components/form'
import emailField from '../../components/form/plugins/email'
import textField from '../../components/form/plugins/text'
import passwordScoreField from '../../components/form/plugins/password-score'
import passwordConfirmField from '../../components/form/plugins/password-confirm'
import profileImageField from '../../components/form/plugins/profile-image'
import './index.css'

/**
 * Setup form
 */

new Form('.js-form')
.use(emailField('.js-email', { reverse: true }))
.use(textField('.js-full-name', { regexp: /(.){1} (.){1}/ }))
.use(passwordScoreField('.js-password'))
.use(profileImageField('.js-change-profile-image', '.js-profile-image', '.js-profile-image-error', '.js-changeImageSpan'))
.use(passwordConfirmField('.js-password-confirm', { passwordField: '.js-password' }))
.onSubmit((values, stopSpinner) => {
  const [email, fullName, password, profileImage] = values
  const companyName = document.querySelector('.js-company-name').innerText
  const body = { email, fullName, password, companyName, imageSrc: profileImage }

  requestHost('/signup', { method: 'post', body }).then((res) => {
    if (res.status !== 201) {
      stopSpinner()
      window.alert('Sorry, unexpected error.')
    } else {
      location.href = '/dashboard'
    }
  })
})

if (module.hot) module.hot.accept()
