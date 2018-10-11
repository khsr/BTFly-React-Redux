import React, { Component, PureComponent } from 'react'
import { router } from '../../../routes'
import moment from '../../../utils/moment'
import { FeedbackIcon } from '../../../components/FeedbackIcon'
import { PopupPictureModal } from '../../../components/Modal'
import { filesHost } from '../../../../../components/boot'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export class FeedbackSidebar extends Component {
  constructor () {
    super()
    this.state = { picturePopupUrl: null }
  }

  handleItemClick = (id) => {
    const { isReport } = this.props
    router.push(`/feedback/${id}${isReport ? '' : '/comments'}`)
  }

  handleItemPictureClick = (imageUrl) => {
    this.setState({ picturePopupUrl: imageUrl })
  }

  handlePicturePopupClose = () => {
    this.setState({ picturePopupUrl: null })
  }

  componentDidMount () {
    if (this.refs.$active) this.refs.$active.scrollIntoView(true)
  }

  render () {
    const { boxes, isReport, currentBoxId } = this.props
    const { picturePopupUrl } = this.state
    return (
      <div className="bf-FeedbackSidebar">
        {picturePopupUrl ? <PopupPictureModal onClose={this.handlePicturePopupClose} src={picturePopupUrl} /> : null}
        {boxes.map((box) => {
          const { _id } = box
          const isActive = box._id === currentBoxId
          const href = isActive ? null : `/dashboard/feedback/${_id}${isReport ? '' : '/comments'}`
          const ref = isActive ? '$active' : null
          return (
            <FeedbackSidebarItem
              key={_id}
              ref={ref}
              href={href}
              onClick={this.handleItemClick}
              onPictureClick={this.handleItemPictureClick}
              isActive={isActive}
              box={box}
              filesHost={filesHost}
            />
          )
        })}
      </div>
    )
  }
}

class FeedbackSidebarItem extends PureComponent {
  scrollIntoView = (...args) => {
    this.refs.$element.scrollIntoView(...args)
  }

  handleClick = (e) => {
    e.preventDefault()
    const { onClick, box: { _id } } = this.props
    onClick(_id)
  }

  handlePictureClick = (e) => {
    e.preventDefault()
    this.props.onPictureClick(this.getImageUrl())
  }

  getImageUrl = () => {
    const { box: { polls }, filesHost } = this.props
    return polls[0].imageUrl ? `${filesHost}/${polls[0].imageUrl}` : ''
  }

  render () {
    const { href, isActive, box } = this.props
    const {
      isDisabled, isUnread, isScheduled,
      totalReplies, participation, type, polls
    } = box
    const name = `${polls[0].text}${type === 'polls' ? ' ...' : ''}`
    const imageUrl = this.getImageUrl()
    return (
      <a ref="$element" href={href} onClick={this.handleClick} className={`bf-FeedbackSidebarItem${isActive ? ' is-active' : ''}`}>
        {imageUrl ? (
          <button
            type="button"
            className="bf-FeedbackSidebarItem-imagePreview"
            style={{ backgroundImage: `url(${imageUrl})` }}
            onClick={this.handlePictureClick}
          />
        ) : null}
        <div className="bf-FeedbackSidebarItem-name">
          {name}
        </div>
        <FeedbackSidebarItemDate box={box} />
        <SidebarParticipation
          totalReplies={totalReplies}
          participation={participation}
          isUnread={isUnread}
          isScheduled={isScheduled}
          isDisabled={isDisabled}
          type={type}
          polls={polls}
        />
      </a>
    )
  }
}

const SidebarParticipation = ({ isUnread, isDisabled, isScheduled, totalReplies, participation, type, polls }) => {
  const modifierClass = `${isDisabled ? ' is-disabled' : ''}${isScheduled ? ' is-scheduled' : ''}${isUnread ? ' is-unread' : ''}`
  const background = `linear-gradient(to right, transparent ${participation}%, white ${participation}%)`
  const { averageSmileys, averageStars, averageVibe } = polls[0].report
  const value = type === 'polls' ? `Q${polls.length}` : (type === 'rating' ? averageStars : (type === 'smileys' ? averageSmileys : averageVibe))
  return (
    <div className="bf-FeedbackSidebarParticipation">
      <div className={`bf-FeedbackSidebarParticipation-total${modifierClass}`}>
        <span>{totalReplies === 0 ? '-' : totalReplies}</span>
      </div>
      <div className={`bf-FeedbackSidebarParticipation-container${modifierClass}`}>
        <span className="bf-FeedbackSidebarParticipation-container-line" style={{ background }} />
        {type === 'polls'
          ? <span className="bf-FeedbackSidebarParticipation-container-icon">{value}</span>
          : <FeedbackIcon isSmall isWhite type={type} value={value} />
        }
      </div>
    </div>
  )
}

class FeedbackSidebarItemDate extends Component {
  constructor (props) {
    super(props)
    this.state = { timer: this.timerText() }
  }

  componentWillMount () {
    if (!this.props.box.isScheduled) return
    this.interval = setInterval(() => {
      this.setState({ timer: this.timerText() })
    }, 1000)
  }

  componentWillUnmount () {
    if (this.interval) clearInterval(this.interval)
  }

  timerText () {
    const { scheduledAt, isScheduled } = this.props.box
    if (isScheduled && scheduledAt - Date.now() > 0) {
      const duration = moment.duration(scheduledAt - Date.now())
      const d = duration.days()
      const h = duration.hours()
      const m = duration.minutes()
      const s = duration.seconds()
      return `${d}${tn('timer-day')} ${h}${tn('timer-hour')} ${m}${tn('timer-minute')} ${s}${tn('timer-second')}`
    }
    return ''
  }

  render () {
    const { date, isDisabled } = this.props.box
    return (
      <div className="bf-FeedbackSidebarItem-date">
        {date}{isDisabled ? ` - ${tn('closed')}` : ''}<br />
        {this.state.timer}
      </div>
    )
  }
}
