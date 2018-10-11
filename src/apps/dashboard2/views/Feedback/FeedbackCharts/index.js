import React from 'react'
import { Icon, getColorFromSVGIcon } from '../../../components/Icon'
import iconThumbUp from './iconThumbUp.svg?raw'
import iconThumbDown from './iconThumbDown.svg?raw'
import iconThumbUpDown from './iconThumbUpDown.svg?raw'
import iconSmileyHappy from './iconSmileyHappy.svg?raw'
import iconSmileyNeutral from './iconSmileyNeutral.svg?raw'
import iconSmileyUnhappy from './iconSmileyUnhappy.svg?raw'
import iconStarActive from './iconStarActive.svg?raw'
import iconStarInactive from './iconStarInactive.svg?raw'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export const FeedbackCharts = ({ poll, currentBox }) => {
  const { totalReplies } = currentBox
  const { type, report } = poll
  const { averageSmileys, averageStars, averageVibe } = report
  let [title, icon, lines] = ['', '', []]
  if (type === 'smileys') {
    title = tn('chart-mood')
    icon = averageSmileys === null ? <FeedbackEmptyIcon /> : <FeedbackMoodIcon value={averageSmileys} />
    lines = [
      { icon: iconSmileyHappy, value: report.smileys[0] || 0 },
      { icon: iconSmileyNeutral, value: report.smileys[1] || 0 },
      { icon: iconSmileyUnhappy, value: report.smileys[2] || 0 }
    ]
  } else if (type === 'rating') {
    title = tn('chart-rating')
    icon = <FeedbackStarIcon value={averageStars} />
    lines = [5, 4, 3, 2, 1].map((rating) => {
      return {
        value: report.stars[rating - 1] || 0,
        color: '#FFDC00',
        icons: [5, 4, 3, 2, 1].map((star) => {
          return star > rating ? iconStarInactive : iconStarActive
        })
      }
    })
  } else if (type === 'yesno') {
    title = tn('chart-vibe')
    icon = averageVibe === null ? <FeedbackEmptyIcon /> : <FeedbackVibeIcon value={averageVibe} />
    lines = [
      { icon: iconThumbUp, value: report.vibe[0] || 0 },
      { icon: iconThumbDown, value: report.vibe[1] || 0 }
    ]
  }

  return (
    <div className="bf-FeedbackCharts">
      <div className="bf-FeedbackCharts-head">
        {title}
      </div>
      <div className="bf-FeedbackCharts-body">
        {icon}
        <div className="bf-FeedbackCharts-body-lines">
          {lines.map((props, index) => {
            return <FeedbackChartLine key={index} {...props} totalReplies={totalReplies} />
          })}
        </div>
      </div>
    </div>
  )
}

const FeedbackEmptyIcon = () => {
  return <div className="bf-FeedbackEmptyIcon" dangerouslySetInnerHTML={{ __html: tn('nothing') }} />
}

const FeedbackMoodIcon = ({ value }) => {
  const mod = value === 1 ? 'happy' : (value === 0 ? 'neutral' : 'unhappy')
  return <div className={`bf-FeedbackMoodIcon is-${mod}`} />
}

const FeedbackVibeIcon = ({ value }) => {
  const icon = value === 0 ? iconThumbUpDown : (value === 1 ? iconThumbUp : iconThumbDown)
  return <Icon className="bf-FeedbackVibeIcon" html={icon} />
}

const FeedbackStarIcon = ({ value }) => {
  return (
    <div className="bf-FeedbackStarIcon">
      <div className="bf-FeedbackStarIcon-text">
        <div>
          {value || '-'}<br />
          <span>/5</span>
        </div>
      </div>
    </div>
  )
}

const FeedbackChartLine = ({ icon, icons, color, value, totalReplies }) => {
  const backgroundColor = color || getColorFromSVGIcon(icon)
  const width = value === 0 ? '0px' : `${Math.round(100 * value / totalReplies)}%`
  return (
    <div className="bf-FeedbackChartLine">
      {icon ? (
        <Icon className="bf-FeedbackChartLine-icon" html={icon} />
      ) : (
        <div className="bf-FeedbackChartLine-iconsContainer">
          {icons.map((svg, index) => {
            return <i key={index} dangerouslySetInnerHTML={{ __html: svg }} />
          })}
        </div>
      )}
      <div className="bf-FeedbackChartLine-progress">
        <span style={{ width, backgroundColor }} />
      </div>
      <div className="bf-FeedbackChartLine-value">{value}</div>
    </div>
  )
}
