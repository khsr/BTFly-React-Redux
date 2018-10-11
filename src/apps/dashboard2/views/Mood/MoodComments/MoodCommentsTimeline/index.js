import React, { Component } from 'react'
import { router } from '../../../../routes'
import { MoodTimelineBase } from '../../MoodTimeline'
import { MoodCommentsTimelineItem } from '../MoodCommentsTimelineItem'
import './index.css'

export class MoodCommentsTimeline extends Component {
  componentDidMount () {
    if (this.refs.chart) this.refs.chart.scrollIntoView(this.refs.$active)
  }

  handleBoxSelect (boxId) {
    router.push(`/mood/${boxId}/comments`)
  }

  render () {
    const { currentBoxes, currentBox, scrollLeft, setScrollLeft } = this.props
    if (!currentBoxes.length) return null
    return (
      <div className="bf-MoodCommentsTimeline">
        <MoodTimelineBase
          ref="chart"
          className="bf-MoodTimeline-body-chart"
          scrollLeft={scrollLeft}
          setScrollLeft={setScrollLeft}
        >
          {currentBoxes.map(box => {
            const isActive = box === currentBox
            const counter = box.comments.length + box.allMessages.length
            const unreadCounter = box.unreadComments.length + box.unreadMessages.length
            const hrefRef = isActive
            ? { ref: '$active' }
            : { href: `/dashboard/mood/${box._id}/comments` }
            return <MoodCommentsTimelineItem
              {...hrefRef}
              id={box._id}
              isActive={isActive}
              key={box._id}
              counter={counter}
              unreadCounter={unreadCounter}
              createdAt={box.createdAt}
              onBoxSelect={this.handleBoxSelect}
            />
          })}
        </MoodTimelineBase>
      </div>
    )
  }
}
