import Form from '../../components/form'
import subdomain from '../../components/form/plugins/subdomain'
import resolveSubdomain from '../../utils/resolve-subdomain'
import './index.css'

new Form('.js-form')
.use(subdomain('.js-subdomain'))
.onSubmit((values) => {
  location.href = `${resolveSubdomain(values[0])}/login`
})
