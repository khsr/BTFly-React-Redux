import React from 'react'
import { Modal } from '../../../../components/Modal'
import { namespace } from '../../../../../../utils/locales'
import { TeamUsersImportCsvExample } from '../TeamUsersImportCsvExample'
import './index.css'
const tn = namespace('dashboard.teams')

export const TeamUsersImportModal = ({ onClose, onImportUsersFile }) => {
  return (
    <Modal
      title={tn('import-users-title')}
      submitTitle={tn('import-users-button')}
      onSubmit={onImportUsersFile}
      onClose={onClose}
    >
      <div className="bf-TeamUsersImportModal">
        <span>{tn('import-users-instruction')}</span>
        <br />
        <TeamUsersImportCsvExample />
      </div>
    </Modal>
  )
}
