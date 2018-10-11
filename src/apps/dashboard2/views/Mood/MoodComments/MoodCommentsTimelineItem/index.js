import React, { PureComponent } from 'react'
import classNames from 'classnames'
import moment from '../../../../utils/moment'

export class MoodCommentsTimelineItem extends PureComponent {
  scrollIntoView = (option) => {
    this.refs.$element.scrollIntoView(option)
  }

  handleClick = (e) => {
    e.preventDefault()
    const { onBoxSelect, id } = this.props
    onBoxSelect(id)
  }

  render () {
    const { href, isActive, unreadCounter, counter, createdAt } = this.props
    const className = classNames('bf-MoodCommentsTimeline-content-item', {
      'is-active': isActive
    })
    return (
      <a href={href} onClick={this.handleClick} ref="$element" className={className}>
        <span />
        <div className="bf-MoodCommentsTimeline-content-item-date">
          {moment(createdAt).format('MMM DD')}
        </div>
        {counter ? (
          <span className={classNames('is-counter', { 'is-active': unreadCounter })}>{counter}</span>
        ) : <span />}
      </a>
    )
  }
}
