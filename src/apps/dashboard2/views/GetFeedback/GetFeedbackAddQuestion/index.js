import React from 'react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const GetFeedbackAddQuestion = ({ addPoll }) => {
  return (
    <div className="bf-GetFeedbackAddQuestion">
      <button type="button" onClick={addPoll}>+ {tn('add-question')}</button>
    </div>
  )
}
