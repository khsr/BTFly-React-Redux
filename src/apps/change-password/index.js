import { requestApi, requestHost } from '../../utils/request'
import Form from '../../components/form'
import passwordScore from '../../components/form/plugins/password-score'
import passwordConfirm from '../../components/form/plugins/password-confirm'
import { bootstrap } from '../../components/boot'
import './index.css'

/**
 * Setup form
 */

new Form('.js-form')
.use(passwordScore('.js-password'))
.use(passwordConfirm('.js-password-confirm', { passwordField: '.js-password' }))
.onSubmit(([password], stopSpinner) => {
  requestApi('/api/user/change-password', {
    method: 'put',
    token: bootstrap.token,
    body: { password }
  }).then((res) => {
    if (res.status !== 200) {
      stopSpinner()
      window.alert('Sorry, unexpeted error.')
    } else {
      res.json().then(({ email }) => {
        requestHost('/login', { method: 'post', body: { email, password } }).then((res2) => {
          if (res2.status !== 201) {
            stopSpinner()
            window.alert('Sorry, unexpeted error.')
          } else {
            location.href = '/dashboard'
          }
        })
      })
    }
  })
})
