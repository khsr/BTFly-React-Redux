import React from 'react'
import { namespace } from '../../../../../../utils/locales'
import { TeamUsersImportCsvExample } from '../TeamUsersImportCsvExample'
import './index.css'
const tn = namespace('dashboard.teams')

export const TeamUsersImport = ({ onImportUsers }) => {
  return (
    <div className="bf-TeamUsersImport">
      {tn('intro-hey')} <br />
      {tn('intro-add')} <a href="#" onClick={onImportUsers}>{tn('intro-csv-file')}</a>.
      <TeamUsersImportCsvExample />
    </div>
  )
}
