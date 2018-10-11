import Form from '../../components/form'
import subdomain from '../../components/form/plugins/subdomain'
import resolveSubdomain from '../../utils/resolve-subdomain'
import './index.css'

new Form('.js-form')
.use(subdomain('.js-subdomain', { reverse: true }))
.onSubmit((values) => {
  location.href = `${resolveSubdomain(values[0])}/signup${location.search}`
})

if (module.hot) module.hot.accept()
