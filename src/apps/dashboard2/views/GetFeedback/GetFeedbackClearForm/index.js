import React from 'react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const GetFeedbackClearForm = ({ clearForm }) => {
  return (
    <button
      type="button"
      className="bf-GetFeedbackClearForm"
      onClick={clearForm}
    >
      {tn('clear-form')}
    </button>
  )
}
