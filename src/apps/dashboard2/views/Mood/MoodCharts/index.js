import React from 'react'
import { ChartCircle, ChartMoodsCircle } from '../../../components/ChartCircle'
import { ChartSidebar, ChartMoodsSidebar } from '../../../components/ChartSidebar'
import { countMoodValues } from '../mood-utils'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export const MoodCharts = ({ currentBox, currentBoxIndex, currentBoxes }) => {
  const previousBox = currentBoxes[currentBoxIndex - 1]
  const isEmpty = currentBox.replies.length === 0
  return (
    <div className="bf-MoodCharts">
      <MoodChartButterflyIndex currentBox={currentBox} previousBox={previousBox} isEmpty={isEmpty} />
      <MoodChartResponseRate currentBox={currentBox} previousBox={previousBox} isEmpty={isEmpty} />
      <MoodChartMoodSplits currentBox={currentBox} isEmpty={isEmpty} />
    </div>
  )
}

const MoodChart = ({ title, children }) => {
  return (
    <div className="bf-MoodChart">
      <div className="bf-MoodChart-header">{title}</div>
      <div className="bf-MoodChart-body">{children}</div>
    </div>
  )
}

const MoodChartButterflyIndex = ({ currentBox, previousBox, isEmpty }) => {
  return (
    <MoodChart title={tn('report-butterfly-index')}>
      <ChartCircle
        isEmpty={isEmpty}
        prefix="/10"
        value={currentBox.bfIndex}
      />
      <ChartSidebar
        isEmpty={isEmpty}
        value={currentBox.bfIndex}
        prevValue={previousBox ? previousBox.bfIndex : null}
        prevLabel={tn('report-previous')}
      />
    </MoodChart>
  )
}

const MoodChartResponseRate = ({ currentBox, previousBox, isEmpty }) => {
  const totalReplies = currentBox.replies.length
  const totalQuestions = currentBox.questions.length
  const participation = totalQuestions ? Math.round(totalReplies * 100 / totalQuestions) : null
  const previousParticipation = previousBox && previousBox.questions.length
  ? Math.round(previousBox.replies.length * 100 / previousBox.questions.length)
  : null
  return (
    <MoodChart title={tn('report-response-rate')}>
      <ChartCircle
        isPercentage
        isEmpty={isEmpty}
        prefix={`${totalReplies}/${totalQuestions}`}
        value={participation}
      />
      <ChartSidebar
        isPercentage
        isEmpty={isEmpty}
        value={participation}
        prevValue={previousParticipation}
        prevLabel={tn('report-previous')}
      />
    </MoodChart>
  )
}

const MoodChartMoodSplits = ({ currentBox, isEmpty }) => {
  const moods = countMoodValues(currentBox.replies)
  return (
    <MoodChart title={tn('report-mood-splits')}>
      <ChartMoodsCircle
        isEmpty={isEmpty}
        moods={moods}
        emptyText={tn('report-nothing')}
      />
      <ChartMoodsSidebar
        isEmpty={isEmpty}
        moods={moods}
      />
    </MoodChart>
  )
}
