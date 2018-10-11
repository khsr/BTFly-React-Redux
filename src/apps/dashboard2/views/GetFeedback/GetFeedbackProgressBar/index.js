import React from 'react'
import { times } from 'lodash'
import './index.css'

export const GetFeedbackProgressBar = ({ step }) => {
  return (
    <div className="bf-GetFeedbackProgressBar">
      {times(step).map((key) => <span key={key} />)}
    </div>
  )
}
