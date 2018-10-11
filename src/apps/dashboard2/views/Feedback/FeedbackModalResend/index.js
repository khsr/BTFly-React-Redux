import React from 'react'
import { Modal } from '../../../components/Modal'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const FeedbackModalResend = ({ receivedPercentage, remainingPercentage, boxName, onClose, onSubmit }) => {
  return (
    <Modal
      isLarge
      title={`${tn('resend-title')}:`}
      submitTitle={tn('menu-resend')}
      submitIcon="next"
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div className="bf-FeedbackModalResend">
        <p>{`${tn('resend-text1', { receivedPercentage })}:`}</p>
        <p><strong>{boxName}</strong></p>
        <p dangerouslySetInnerHTML={{ __html: tn('resend-text2', { remainingPercentage }) }} />
      </div>
    </Modal>
  )
}
