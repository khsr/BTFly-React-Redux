import React, { Component } from 'react'
import { connect } from '../../../utils/performance'
import { getSelectedBoxId, getTransformedSelectedBox, getCommentsListForSelectedBox } from '../../../redux/selectors/feedback'
import { markAsRead } from '../../../redux/actions/boxes'
import { MARK_AS_READ_TIMEOUT } from '../../../config'
import { FeedbackComments } from '../FeedbackComments'

const mapStateToProps = (state, { params }) => {
  const selectedBoxId = getSelectedBoxId(state, params)
  if (!selectedBoxId) return { isEmpty: true }

  const currentBox = getTransformedSelectedBox(state, params)
  const comments = getCommentsListForSelectedBox(state, params)
  return {
    currentBox,
    comments
  }
}

class FeedbackCommentsWrapper extends Component {
  onMarkAsRead = (replyIds) => {
    const { currentBox, dispatch } = this.props
    return dispatch(markAsRead({ boxId: currentBox._id, replyIds, timeout: MARK_AS_READ_TIMEOUT }))
  }

  render () {
    const { currentBox, comments } = this.props
    return (
      <FeedbackComments
        comments={comments}
        currentBox={currentBox}
        onMarkAsRead={this.onMarkAsRead}
      />
    )
  }
}

export default connect(mapStateToProps)(FeedbackCommentsWrapper)
