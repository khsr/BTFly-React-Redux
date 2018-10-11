import React from 'react'
import { ModalAlert } from '../../../../components/Modal'
import { namespace } from '../../../../../../utils/locales'
const tn = namespace('dashboard.teams')

export const TeamModalError = ({ message, onClose }) => {
  return (
    <ModalAlert
      isWarning
      title={tn('upload-error')}
      text={message}
      submitTitle={tn('upload-error-button')}
      onClose={onClose}
    />
  )
}

export const TeamModalDeleteUsers = ({ amountOfSelectedUsers, onClose, onSubmit }) => {
  return (
    <ModalAlert
      isWarning
      title={tn('delete-users')}
      text={tn('delete-users-message', { count: amountOfSelectedUsers })}
      submitTitle={tn('delete-users-button')}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
