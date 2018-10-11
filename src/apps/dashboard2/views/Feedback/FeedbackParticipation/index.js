import React from 'react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const FeedbackParticipation = ({ currentBox }) => {
  const { totalReplies, totalQuestions, participation } = currentBox
  return (
    <div className="bf-FeedbackParticipation">
      <div className="bf-FeedbackParticipation-text">
        {tn('participation')}: <strong>{participation}% ({totalReplies}/{totalQuestions})</strong>
      </div>
      <div className="bf-FeedbackParticipation-line">
        <span style={{ width: `${participation}%`, minWidth: participation ? '0.4rem' : 0 }} />
      </div>
    </div>
  )
}
