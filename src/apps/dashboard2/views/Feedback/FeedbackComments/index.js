import React, { Component } from 'react'
import { Comment } from '../../Chat'
import { FeedbackIcon } from '../../../components/FeedbackIcon'
import { IconFilter } from '../../../components/IconFilter'
import { getReplyValue } from '../../../../../utils/replies-utils'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export class FeedbackComments extends Component {
  constructor () {
    super()
    this.state = { filters: [] }
  }

  onCancelFilter = () => {
    this.setState({ filters: [] })
  }

  onSelectFilter = (filter) => {
    const { filters } = this.state
    const isSelected = filters.includes(filter)
    const newFilters = isSelected
    ? filters.filter((f) => f !== filter)
    : filters.concat([filter])
    this.setState({ filters: newFilters })
  }

  componentDidMount () {
    this.componentDidUpdate()
  }

  componentDidUpdate () {
    const { currentBox, onMarkAsRead } = this.props
    if (currentBox.unreadComments.length) {
      onMarkAsRead(currentBox.unreadComments.map((r) => r._id))
    }
  }

  render () {
    const { comments, currentBox } = this.props
    const { filters } = this.state
    const { type: boxType } = currentBox
    const [filterValues, filterIcons] = getFilterValuesAndIcons(boxType, filters)

    return comments.length ? (
      <div className="bf-FeedbackComments">
        {filterValues.length ? (
          <IconFilter
            noIconColors={boxType === 'rating'}
            currentValues={filters}
            values={filterValues}
            icons={filterIcons}
            onSelect={this.onSelectFilter}
            onCancel={this.onCancelFilter}
          />
        ) : null}
        {comments.map(({ _id, userName, isUnread, messagesCount, reply }) => {
          const value = getReplyValue(reply, boxType)

          if (filters.length) {
            if (boxType !== 'polls' && !filters.includes(value)) return null
            if (boxType === 'polls' && !containsMood(filters, value)) return null
          }

          return (
            <Comment
              key={_id}
              isNew={reply.status !== 'read'}
              userName={userName}
              boxType={boxType}
              reply={reply}
              chatButton={{
                prefix: `/feedback/${currentBox._id}`,
                isUnread,
                messagesCount
              }}
            />
          )
        })}
      </div>
    ) : (
      <div className="bf-FeedbackCommentsEmpty">{tn('comments-empty')}</div>
    )
  }
}

function getFilterValuesAndIcons (type, filters) {
  if (type === 'rating') {
    const stars = [5, 4, 3, 2, 1]
    return [stars, stars.map((s) => {
      return <FeedbackIcon isMedium isGrey6={!filters.includes(s)} type="rating" value={s} />
    })]
  } else if (type === 'smileys') {
    const smileys = [1, 0, -1]
    return [smileys, smileys.map((s) => <FeedbackIcon isMedium type="smileys" value={s} />)]
  } else if (type === 'yesno') {
    const thumbs = [1, -1]
    return [thumbs, thumbs.map((s) => <FeedbackIcon isMedium type="yesno" value={s} />)]
  }
  return [[], []]
}

function containsMood (filters, value) {
  return filters.some((f) => {
    if (f === 1 && value < 2) return true
    if (f === 2 && value >= 2 && value < 4) return true
    if (f === 3 && value >= 4 && value < 6) return true
    if (f === 4 && value >= 6 && value < 8) return true
    if (f === 5 && value >= 8) return true
    return false
  })
}
