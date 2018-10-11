import React, { Component } from 'react'
import { MoodIcon } from '../../../components/MoodIcon'
import { IconFilter } from '../../../components/IconFilter'
import { MoodDriverIcon } from '../../../components/MoodDriverIcon'
import { MoodCommentsTimeline } from './MoodCommentsTimeline'
import { MoodComment } from './MoodComment'
import { MoodCommentNotifyModal } from './MoodCommentNotifyModal'
import { allDrivers, allMoods } from '../mood-utils'
import { filterUnreadMessages } from '../../../redux/data-utils'
import { namespace } from '../../../../../utils/locales'
import { MANAGERS_NUMBER_FOR_REPLY_NOTIFICATION } from '../../../config'
import './index.css'
const tn = namespace('dashboard.mood')

export class MoodComments extends Component {
  constructor () {
    super()
    this.state = { filter: 'mood', subFilters: [], replyIdNotifyModal: null }
  }

  componentWillMount () {
    this.componentDidUpdate()
  }

  changeFilter = (e) => {
    this.setState({ filter: e.target.value, subFilters: [] })
  }

  onCancelDriver = () => {
    this.setState({ subFilters: [] })
  }

  onSelectDriver = (subFilter) => {
    const { subFilters } = this.state
    const isSelected = subFilters.includes(subFilter)
    const newFilters = isSelected
    ? subFilters.filter((f) => f !== subFilter)
    : subFilters.concat([subFilter])
    this.setState({ subFilters: newFilters })
  }

  handleNotifyClick = (notifyId) => {
    this.setState({ replyIdNotifyModal: notifyId })
  }

  handleNotifyModalClose = () => {
    this.setState({ replyIdNotifyModal: null })
  }

  handleNotifyModalSubmit = (text) => {
    const { onNotify, currentBox: { _id: boxId } } = this.props
    const { replyIdNotifyModal: replyId } = this.state
    return onNotify({ boxId, replyId, text })
    .then(() => this.handleNotifyModalClose())
  }

  componentDidUpdate () {
    const { currentBox, onMarkBoxAsSeen } = this.props
    if (currentBox.unreadComments.length) onMarkBoxAsSeen()
  }

  render () {
    const { currentBox, currentBoxes, setScrollLeft, scrollLeft, currentUser, managersNumber, adminsNumber, zoom, onResolve } = this.props
    const { filter, subFilters, replyIdNotifyModal } = this.state
    const filterdComments = currentBox.comments
    .filter((r) => {
      if (filter === 'mood' && subFilters.length) {
        return subFilters.includes(r.mood)
      } else if (filter === 'drivers') {
        return r.moodComments && Object.keys(r.moodComments).length &&
               (subFilters.length ? subFilters.some((f) => r.moodComments[f]) : true)
      }
      return true
    })
    const replyNotify = replyIdNotifyModal ? filterdComments.find(comment => comment._id === replyIdNotifyModal) : null

    return (
      <div className="bf-MoodComments">
        {replyNotify ? (
          <MoodCommentNotifyModal
            reply={replyNotify}
            boxId={currentBox._id}
            currentUserName={currentUser.fullName}
            onSubmit={this.handleNotifyModalSubmit}
            onClose={this.handleNotifyModalClose}
          />
        ) : null}
        <MoodCommentsTimeline
          zoom={zoom}
          currentBoxes={currentBoxes}
          currentBox={currentBox}
          setScrollLeft={setScrollLeft}
          scrollLeft={scrollLeft}
        />
        <div className="bf-MoodComments-filter">
          <select value={filter} onChange={this.changeFilter}>
            <option key="mood" value="mood">{tn('report-general-mood')}</option>
            <option key="drivers" value="drivers">{tn('report-mood-drivers')}</option>
          </select>
          <IconFilter
            currentValues={subFilters}
            values={filter === 'mood' ? allMoods : allDrivers}
            icons={filter === 'mood'
              ? allMoods.map((m) => <MoodIcon isMedium moodValue={m} />)
              : allDrivers.map((d) => <MoodDriverIcon isMedium driverType={d} />)
            }
            onSelect={this.onSelectDriver}
            onCancel={this.onCancelDriver}
          />
        </div>
        {filterdComments.length === 0 ? (
          <div className="bf-MoodComments-empty">{tn('comments-empty')}</div>
        ) : (
        filterdComments.map((reply) => {
          const isNew = currentBox.unreadComments.some((c) => c._id === reply._id)
          const chats = currentBox.allChats.filter((c) => c.replyId === reply._id)
          const userChat = chats.find(c => c.managerId === currentUser._id)
          const chatMessages = currentBox.allMessages.filter((m) => {
            return userChat && userChat._id === m.chatId
          })
          const otherChats = chats.filter((c) => c.managerId !== currentUser._id)
          const isChatUnread = filterUnreadMessages(chatMessages).length
          const isNotified = !!reply.notifiedAt
          const canBeNotified = managersNumber >= MANAGERS_NUMBER_FOR_REPLY_NOTIFICATION && adminsNumber - 1 >= 1
          const isResolved = !!reply.resolvedAt
          const isNeedsYourAttention = isNotified && reply.notifiedManagerIds.includes(currentUser._id) && !isResolved
          return (
            <MoodComment
              key={reply._id}
              isAdmin={currentUser.role === 'admin'}
              boxId={currentBox._id}
              reply={reply}
              isNew={isNew}
              isUnread={isChatUnread}
              isNotified={isNotified}
              canBeNotified={canBeNotified}
              isNeedsYourAttention={isNeedsYourAttention}
              isResolved={isResolved}
              messagesCount={chatMessages.length}
              hasOtherChats={otherChats.length > 0}
              subFilters={subFilters}
              onNotify={this.handleNotifyClick}
              onResolve={onResolve}
            />
          )
        }))}
      </div>
    )
  }
}
