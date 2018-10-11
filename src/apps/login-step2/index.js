import Form from '../../components/form'
import emailField from '../../components/form/plugins/email'
import pwdField from '../../components/form/plugins/password'
import { requestHost } from '../../utils/request'
import './index.css'

const form = new Form('.js-form')
.use(emailField('.js-email'))
.use(pwdField('.js-password', { noValid: true }))
.onSubmit((values, stopSpinner) => {
  const [email, password] = values
  const passwordField = form.get('.js-password')
  requestHost('/login', { method: 'post', body: { email, password } }).then((res) => {
    if (res.status !== 201) {
      stopSpinner()
      passwordField.setState({ isInvalid: true })
    } else {
      passwordField.setState({ isValid: true })
      const match = location.search.match(/back=(.*)$/)
      location.href = match ? `/dashboard${match[1]}` : '/dashboard'
    }
  })
})

if (module.hot) module.hot.accept()
