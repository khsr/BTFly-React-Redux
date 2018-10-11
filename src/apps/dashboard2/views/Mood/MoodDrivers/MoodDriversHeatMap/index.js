import React from 'react'
import { range } from 'lodash'
import { MoodIcon, getMoodColorByBfIndex } from '../../../../components/MoodIcon'
import { getMoodDrivers } from '../../../../redux/data-utils'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tm = namespace('question-mood')

const driverNames = [
  tm('role'),
  tm('management'),
  tm('colleagues'),
  tm('environment'),
  tm('balance')
]

export const MoodDriversHeatMap = ({ currentBox, isSmall }) => {
  const titles = isSmall ? driverNames.map((c) => c[0]) : driverNames
  const moods = range(5, 0).map((mood) => {
    const relatedReplies = currentBox.driversReplies.filter((reply) => reply.mood === mood)
    const details = getMoodDrivers(relatedReplies)
    return {
      icon: <MoodIcon moodValue={mood} />,
      totalCount: relatedReplies.length,
      circles: details
      ? [details.role, details.management, details.colleagues, details.environment, details.balance]
      : [null, null, null, null, null]
    }
  })

  return (
    <div className="bf-MoodDriversHeatMap">
      <div className="bf-MoodDriversHeatMap-title">
        <div className="bf-MoodDriversHeatMap-title-emptyItem" />
        {titles.map((title) => {
          return <div key={title} className="bf-MoodDriversHeatMap-title-item">{title}</div>
        })}
      </div>
      {moods.map(({ icon, totalCount, circles }, index) => {
        return (
          <div key={index} className="bf-MoodDriversHeatMap-item">
            <div className="bf-MoodDriversHeatMap-item-block is-icon">
              {icon}
              <span>{totalCount}</span>
            </div>
            {circles.map((count, circleIndex) => {
              return count !== null ? (
                <div
                  key={circleIndex}
                  className="bf-MoodDriversHeatMap-item-block is-circle"
                  style={{ backgroundColor: getMoodColorByBfIndex(count) }}
                >
                  {count}
                </div>
              ) : (
                <div key={circleIndex} className="bf-MoodDriversHeatMap-item-block is-circle">-</div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
