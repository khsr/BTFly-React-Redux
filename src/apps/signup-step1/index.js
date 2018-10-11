import { kebabCase } from 'lodash'
import Form from '../../components/form'
import text from '../../components/form/plugins/text'
import './index.css'

// init form

new Form('.js-form')
.use(text('.js-company-name'))
.onSubmit((fields) => {
  const companyName = fields[0]
  location.href = `/signup?subdomain=${kebabCase(companyName)}` +
                  `&companyName=${encodeURIComponent(companyName)}`
})
