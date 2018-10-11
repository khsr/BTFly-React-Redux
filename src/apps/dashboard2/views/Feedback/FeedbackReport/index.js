import React, { Component } from 'react'
import { router } from '../../../routes'
import { filterRepliesByGroupIds, sortGroupsByDriverIndex } from '../../../redux/data-utils'
import { getValueByBoxAndReplies } from '../feedback-utils'
import { TagsDropdown } from '../../../components/TagsDropdown'
import { FeedbackIcon } from '../../../components/FeedbackIcon'
import { FeedbackParticipation } from '../FeedbackParticipation'
import { FeedbackBoxName } from '../FeedbackBoxName'
import { FeedbackCharts } from '../FeedbackCharts'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

const FeedbackIndexIcon = ({ bfIndex, driver }) => {
  return driver === 'polls'
  ? null
  : <FeedbackIcon isSmall type={driver} value={bfIndex} />
}

export class FeedbackReport extends Component {
  onSelectGroup = (groupId) => {
    const { currentBox: { _id } } = this.props
    router.push(`/feedback/${_id}${groupId ? `/${groupId}` : ''}`)
  }

  componentDidMount () {
    this.componentDidUpdate()
  }

  componentDidUpdate () {
    const { currentBox, onMarkAsRead } = this.props
    if (currentBox.unreadReplies.length) {
      onMarkAsRead(currentBox.unreadReplies.map((r) => r._id))
    }
  }

  render () {
    const { currentBox, currentGroup } = this.props
    const groups = prepareGroups(this.props)
    const visibleGroup = (currentGroup ? groups.find((g) => g._id === currentGroup._id) : null) || groups[0]
    return (
      <div className="bf-FeedbackReport">
        <TagsDropdown
          noValue
          IndexIcon={FeedbackIndexIcon}
          visibleGroup={visibleGroup}
          driver={currentBox.type}
          groups={groups}
          onClick={this.onSelectGroup}
        />
        <FeedbackParticipation currentBox={currentBox} />
        {currentBox.polls.map((poll, index) => {
          return (
            <div key={index}>
              <FeedbackBoxName poll={poll} pollIndex={index} hasCounter={currentBox.type === 'polls'} />
              <FeedbackCharts poll={poll} currentBox={currentBox} />
            </div>
          )
        })}
      </div>
    )
  }
}

function prepareGroups ({ groups, currentBox }) {
  const { allQuestions, allReplies, type } = currentBox
  const result = groups.map(({ _id, name }) => {
    const replies = filterRepliesByGroupIds(allQuestions, allReplies, [_id])
    return {
      _id,
      name,
      driverIndex: type === 'polls' ? 0 : getValueByBoxAndReplies(currentBox, replies)
    }
  })
  .sort(sortGroupsByDriverIndex)

  if (groups.length !== 1) {
    if (groups.length > 1) result.unshift({ _id: 'separator' })
    result.unshift({
      _id: null,
      name: tn('all'),
      driverIndex: type === 'polls' ? 0 : getValueByBoxAndReplies(currentBox, allReplies)
    })
  }
  return result
}
