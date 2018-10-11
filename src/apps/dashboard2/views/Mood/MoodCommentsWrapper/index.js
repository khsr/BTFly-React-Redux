import React, { Component } from 'react'
import { connect } from '../../../utils/performance'
import { Container, ContainerHeader, ContainerBody } from '../../../components/Container'
import { getCurrentUser, getCurrentUserManagers, getAdminUsers } from '../../../redux/selectors/users'
import { emptyBox, getUnreadMoodCommentsNumber, getSelectedBoxId, getBoxes, getSelectedBox } from '../../../redux/selectors/mood'
import { getUnreadNotesNumber } from '../../../redux/selectors/notes'
import { markBoxAsSeen } from '../../../redux/actions/boxes'
import { notifyManagers, resolve } from '../../../redux/actions/replies'
import { MARK_AS_READ_TIMEOUT } from '../../../config'
import { MoodHeaderMenu } from '../MoodHeaderMenu'
import { MoodComments } from '../MoodComments'

const mapStateToProps = (state, { params }) => {
  const currentUser = getCurrentUser(state)
  const selectedBoxId = getSelectedBoxId(state, params) || emptyBox._id

  const currentBoxes = getBoxes(state, params)
  const selectedBox = getSelectedBox(state, params) || emptyBox

  const unreadNotes = getUnreadNotesNumber(state, params)
  const unreadComments = getUnreadMoodCommentsNumber(state, params)

  const managersNumber = getCurrentUserManagers(state).size
  const adminsNumber = getAdminUsers(state).size

  return {
    currentUser,
    managersNumber,
    adminsNumber,

    selectedBoxId,
    selectedBox,
    currentBoxes,

    unreadNotes,
    unreadComments
  }
}

class MoodCommentsWrapper extends Component {
  setScrollLeft = (scrollLeft) => {
    this.props.setScrollLeft(scrollLeft)
  }

  handleMarkBoxAsSeen = () => {
    const { dispatch, selectedBox } = this.props
    dispatch(markBoxAsSeen({ boxId: selectedBox._id, timeout: MARK_AS_READ_TIMEOUT }))
  }

  handleNotify = ({ boxId, replyId, text }) => {
    return this.props.dispatch(notifyManagers({ boxId, replyId, text }))
  }

  handleResolve = ({ boxId, replyId }) => {
    return this.props.dispatch(resolve({ boxId, replyId }))
  }

  render () {
    const { isComments, selectedBoxId, currentUser, managersNumber, adminsNumber, selectedBox, currentBoxes, unreadNotes, unreadComments, scrollLeft } = this.props
    return (
      <Container>
        <ContainerHeader>
          <MoodHeaderMenu
            currentBoxId={selectedBoxId}
            currentUser={currentUser}
            isComments={isComments}
            unreadNotes={unreadNotes}
            unreadComments={unreadComments}
          />
        </ContainerHeader>
        <ContainerBody>
          <MoodComments
            currentUser={currentUser}
            managersNumber={managersNumber}
            adminsNumber={adminsNumber}
            currentBox={selectedBox}
            currentBoxes={currentBoxes}
            onMarkBoxAsSeen={this.handleMarkBoxAsSeen}
            onNotify={this.handleNotify}
            onResolve={this.handleResolve}
            scrollLeft={scrollLeft}
            setScrollLeft={this.setScrollLeft}
          />
        </ContainerBody>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(MoodCommentsWrapper)
