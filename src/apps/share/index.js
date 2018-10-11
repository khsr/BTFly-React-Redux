import './index.css'
import React from 'react'
import { render } from 'react-dom'
import { bootstrap } from '../../components/boot'
import { namespace } from '../../utils/locales'
import moment from '../dashboard2/utils/moment'
import win from '../dashboard2/utils/window'
import { ChartCircle, ChartMoodsCircle } from '../dashboard2/components/ChartCircle'
import { ChartMoodsSidebar } from '../dashboard2/components/ChartSidebar'
import { ChartDrivers } from '../dashboard2/components/ChartDrivers'
import { MoodIcon } from '../dashboard2/components/MoodIcon'

// local variables

const tn = namespace('share')
const { userName, supportHost, supportEmail, reply } = bootstrap
const { totalReplies, totalQuestions, moods, moodDrivers, createdAt } = bootstrap.box
const isEmpty = totalReplies === 0
const responseRate = Math.round(100 * totalReplies / totalQuestions)
const reportDate = moment(new Date(createdAt)).format('Do MMMM')
const moodDetails = reply && Object.keys(reply.moodDetails).length ? Object.keys(reply.moodDetails).reduce((memo, prop) => {
  const val = reply.moodDetails[prop]
  memo[prop] = (val - 1) * 2.5
  return memo
}, {}) : null

// components

const ShareConfidentialCorner = () => (
  <div className="bf-ShareConfidentialCorner">
    <div className="bf-ShareConfidentialCorner-ribbon">
      {tn('confidential-corner')} *
    </div>
  </div>
)

const ShareGreeting = () => (
  <div className="bf-ShareGreeting">
    {tn('greeting', { userName, reportDate })}
  </div>
)

const ShareChartBlock = ({ isWhite, text, children }) => (
  <div className={`bf-ShareChartBlock${isWhite ? ' is-white' : ''}`}>
    <div className="bf-ShareChartBlock-content">
      {children}
    </div>
    {text ? (
      <div
        className={`bf-ShareChartBlock-text${isWhite ? ' is-white' : ''}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    ) : null}
  </div>
)

const ShareMoods = () => (
  <div className="bf-ShareMoods">
    <div className="bf-ShareBlock is-medium">
      <div className="bf-ShareBlock-header">
        {tn('general-mood')}
      </div>
      <div className="bf-ShareBlock-content">
        {reply ? (
          <ShareChartBlock isWhite text={tn('general-mood-your-text')}>
            <MoodIcon moodValue={reply.mood} className="bf-ShareChartBlock-largeIcon" />
          </ShareChartBlock>
        ) : (
          <ShareChartBlock isWhite text={tn('general-mood-empty-text')}>
            <MoodIcon bfIndex={null} className="bf-ShareChartBlock-largeIcon" />
          </ShareChartBlock>
        )}
        <ShareChartBlock text={tn('general-mood-team-text')}>
          <ChartMoodsCircle
            isEmpty={isEmpty}
            emptyText=""
            moods={moods}
          />
          <ChartMoodsSidebar
            isTransparent
            isEmpty={isEmpty}
            moods={moods}
          />
        </ShareChartBlock>
      </div>
    </div>
    <div className="bf-ShareBlock is-smallWithPadding">
      <div className="bf-ShareBlock-header">
        {tn('team-response-rate')}
      </div>
      <div className="bf-ShareBlock-content">
        <ShareChartBlock text={tn('team-response-text', { totalReplies, totalQuestions })}>
          <ChartCircle
            isPercentage
            isEmpty={isEmpty}
            value={responseRate}
          />
        </ShareChartBlock>
      </div>
    </div>
  </div>
)

const ShareDrivers = () => (
  <div className="bf-ShareDrivers">
    <div className="bf-ShareBlock">
      <div className="bf-ShareBlock-header">
        {tn('mood-drivers')}
        <div>
          <span className="bf-ShareBlock-header-label">
            {tn('mood-drivers-you')}
          </span>
          <span className="bf-ShareBlock-header-label is-transparent">
            {tn('mood-drivers-your-team')}
          </span>
        </div>
      </div>
      <div className="bf-ShareBlock-content">
        <ShareChartBlock>
          <div className="bf-ShareChartDrivers">
            <ChartDrivers
              noNumbers
              isWhite
              isSmall={win.isSmall}
              drivers={moodDrivers}
              previousDrivers={moodDetails ? [moodDetails] : []}
            />
          </div>
        </ShareChartBlock>
      </div>
    </div>
  </div>
)

const ShareFooter = () => (
  <div className="bf-ShareFooter">
    {tn('footer1')}<br /><br />
    {tn('footer2-1')} <a href={supportHost}>{tn('footer2-2')}</a> {tn('footer2-2')} <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.<br /><br />
    {tn('footer3')}
  </div>
)

const AppContainer = () => (
  <div className="bf-ShareLayout">
    <ShareConfidentialCorner />
    <ShareGreeting />
    <ShareMoods />
    <ShareDrivers />
    <ShareFooter />
  </div>
)

// render

const $root = document.getElementById('root')
render(<AppContainer />, $root)
