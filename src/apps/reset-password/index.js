import Form from '../../components/form'
import emailField from '../../components/form/plugins/email'
import { requestApi } from '../../utils/request'
import subdomain from '../../utils/subdomain'
import './index.css'

const form = new Form('.js-form')
.use(emailField('.js-email'))
.onSubmit(([email], stopSpinner) => {
  requestApi('/reset-password', {
    method: 'post',
    body: { email, subdomain }
  }).then((res) => {
    if (res.status !== 204) {
      stopSpinner()
      window.alert('Sorry, unexpected error.')
    } else {
      form.$el.innerHTML = successTemplate({ email })
    }
  })
})

function successTemplate ({ email }) {
  return `
    <div class="reset-password">
      <h2 class="reset-password__subtitle">Password reset</h2>
      <p class="reset-password__text">
        We have sent you a reset link to the following email address:<br>
      </p>
      <p class="reset-password__email">
        ${email}
      </p>
    </div>
  `
}
