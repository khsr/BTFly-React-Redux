import React from 'react'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const FeedbackEmpty = ({ openGetFeedback }) => (
  <div className="bf-FeedbackEmpty">
    {tn('no-feedback-intro')}<br />
    {tn('no-feedback-use-start')}
    <button onClick={openGetFeedback}>{tn('no-feedback-use-button')}</button>
    {tn('no-feedback-use-end')}.
  </div>
)
