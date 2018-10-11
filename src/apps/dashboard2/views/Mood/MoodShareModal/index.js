import React from 'react'
import { Modal } from '../../../components/Modal'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export const MoodShareModal = ({ onSubmit, onClose }) => {
  return (
    <Modal
      isLarge
      title={tn('share-title')}
      submitTitle={tn('share-button')}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <div className="bf-MoodShareModal" dangerouslySetInnerHTML={{ __html: tn('share-text') }} />
    </Modal>
  )
}
