import React from 'react'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export const MoodDriversLabels = ({ hasPrev }) => {
  return (
    <div className="bf-MoodDriversLabels">
      {hasPrev ? (
        <div className="bf-MoodDriversLabels-item is-prev">
          {tn('report-previous')} <span />
        </div>
      ) : null}
      <div className="bf-MoodDriversLabels-item is-curr">
        {tn('report-current')} <span />
      </div>
    </div>
  )
}
