import React, { PureComponent } from 'react'
import { router } from '../../../routes'
import { ModalBackdrop } from '../../../components/Modal'
import { Icon } from '../../../components/Icon'
import iconThumb from './iconThumb.svg?react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export class GetFeedbackStep4 extends PureComponent {
  onClose = () => {
    const { onClose } = this.props
    router.push('/feedback')
    onClose()
  }

  componentWillMount () {
    this.timeout = setTimeout(this.onClose, 2000)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  render () {
    return (
      <ModalBackdrop onClose={this.onClose}>
        <div className="bf-GetFeedbackStep4">
          <Icon icon={iconThumb} />
          <h2 dangerouslySetInnerHTML={{ __html: tn('success-message') }} />
        </div>
      </ModalBackdrop>
    )
  }
}
