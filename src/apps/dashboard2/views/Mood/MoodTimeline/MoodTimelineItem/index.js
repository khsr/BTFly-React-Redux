import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { ZOOM_OPTIONS } from '../../../../config'
import { MoodIndexIcon } from '../../MoodIndexIcon'
import moment from '../../../../utils/moment'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')
const barHeight = 11

const zoomCoefficient = (zoomValue) => ZOOM_OPTIONS.indexOf(zoomValue) + 1

export class MoodTimelineItem extends PureComponent {
  scrollIntoView = (option) => {
    this.refs.$element.scrollIntoView(option)
  }

  handleClick = (e) => {
    e.preventDefault()
    const { onBoxSelect, boxId } = this.props
    onBoxSelect(boxId)
  }

  handleNotesClick = (e) => {
    e.preventDefault()
    const { onNotesClick, boxId } = this.props
    onNotesClick(boxId)
  }

  render () {
    const { zoom, href, isLive, driver, isActive, hasCompanyLine, driverIndex,
            companyDriverIndex, createdAt, notesLength, unreadNotesLength } = this.props
    const height = (driverIndex / 10 * barHeight) + 'rem'
    const top = -(companyDriverIndex / 10 * barHeight) + 'rem'
    const suffix = isActive ? ' is-active' : ''
    const className = classNames('bf-MoodTimelineItem', `is-zoom-${zoomCoefficient(zoom)}x`, { 'is-active': isActive })
    return (
      <a href={href} onClick={this.handleClick} ref="$element" className={className}>
        <div className={`bf-MoodTimelineItem-header${suffix}`}>
          <MoodIndexIcon isMedium bfIndex={driverIndex} driver={driver} />
          <span>
            {isLive ? tn('box-mention-live').toUpperCase() + ' ' : null}
            {driverIndex !== null ? driverIndex : '-'}
          </span>
        </div>
        <div className={`bf-MoodTimelineItem-body${suffix}`}>
          {hasCompanyLine && companyDriverIndex !== null ? (
            <div className="bf-MoodTimelineItem-body-line" style={{ top }} />
          ) : null}
          <div className="bf-MoodTimelineItem-body-bar" style={{ height }} />
        </div>
        <div className={`bf-MoodTimelineItem-footer${suffix}`}>
          <div className="bf-MoodTimelineItem-footer-left" />
          <div className="bf-MoodTimelineItem-footer-center">
            <span className="bf-MoodTimelineItem-footer-date">
              {createdAt.length === 1 ? (
                moment(createdAt[0]).format('MMM DD')
              ) : (
                moment(createdAt[0]).format('MMM DD') + ' - ' + moment(createdAt[createdAt.length - 1]).format('MMM DD')
              )}
            </span>
          </div>
          <div className="bf-MoodTimelineItem-footer-right">
            {notesLength ? (
              <span
                className={`bf-MoodTimelineItem-footer-notesCounter${unreadNotesLength ? ' is-active' : ''}`}
                onClick={this.handleNotesClick}>
                {notesLength}
              </span>
            ) : (
              <span className="bf-MoodTimelineItem-footer-notes" onClick={this.handleNotesClick}>+</span>
            )}
          </div>
        </div>
      </a>
    )
  }
}
