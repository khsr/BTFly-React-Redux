import React, { Component } from 'react'
import { connect } from '../../../utils/performance'
import { getSelectedBoxId, getSelectedGroup, getGroupsListForSelectedBox, getTransformedSelectedBox } from '../../../redux/selectors/feedback'
import { markAsRead } from '../../../redux/actions/boxes'
import { MARK_AS_READ_TIMEOUT } from '../../../config'
import { FeedbackReport } from '../FeedbackReport'

const mapStateToProps = (state, { params }) => {
  const selectedBoxId = getSelectedBoxId(state, params)
  if (!selectedBoxId) return { isEmpty: true }

  const currentGroup = getSelectedGroup(state, params)
  const currentBox = getTransformedSelectedBox(state, params)
  const groups = getGroupsListForSelectedBox(state, params)
  return {
    currentBox,
    currentGroup,
    groups
  }
}

class FeedbackReportWrapper extends Component {
  onMarkAsRead = (replyIds) => {
    const { currentBox, dispatch } = this.props
    return dispatch(markAsRead({ boxId: currentBox._id, replyIds, timeout: MARK_AS_READ_TIMEOUT }))
  }

  render () {
    const { currentBox, groups, currentGroup } = this.props
    return (
      <FeedbackReport
        groups={groups}
        currentGroup={currentGroup}
        currentBox={currentBox}
        onMarkAsRead={this.onMarkAsRead}
      />
    )
  }
}

export default connect(mapStateToProps)(FeedbackReportWrapper)
