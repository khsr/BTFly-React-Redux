import React, { Component } from 'react'
import { uniqueId } from 'lodash'
import { connect } from '../../utils/performance'
import { MARK_AS_READ_TIMEOUT } from '../../config'
import { createNote, updateNote } from '../../redux/actions/notes'
import { pushTempNote, popTempNote } from '../../redux/actions/moodNotes'
import { getBox, getMappedBoxNotesForCurrentUser, getFirstUnreadBoxNoteIndex,
  getCurrentUserPublicGroupsWithManagers, getNotesQueue
} from '../../redux/selectors/moodNotes'
import { getCurrentUserId, getCurrentUser } from '../../redux/selectors/users'
import { getCurrentCompanyName } from '../../redux/selectors/company'
import { markNotesAsSeen } from '../../redux/actions/boxes'

import { MoodNotesZoomDecorator } from './MoodNotesZoomDecorator'
import { MoodNotesModal } from './MoodNotesModal'
import { MoodNotesTagsModal } from './MoodNotesTagsModal'

const mapStateToProps = (state, { boxId }) => {
  const notes = getMappedBoxNotesForCurrentUser(state, { boxId })
  const unreadNoteIndex = getFirstUnreadBoxNoteIndex(state, { boxId })
  const notesQueue = getNotesQueue(state, { boxId })
  const box = getBox(state, { boxId })
  const currentUser = getCurrentUser(state)
  const isAdmin = currentUser.get('role') === 'admin'
  const groups = getCurrentUserPublicGroupsWithManagers(state).toArray()
  const companyName = getCurrentCompanyName(state)
  const currentUserId = getCurrentUserId(state)
  return {
    box,
    currentUserId,
    currentUser,
    isAdmin,
    groups,
    notes,
    notesQueue,
    companyName,
    unreadNoteIndex
  }
}

const mapDispatchToProps = (dispatch, { boxId }) => {
  return {
    markAsSeen: (timeout = 0) => dispatch(markNotesAsSeen({ boxId, timeout })),
    createNote: ({ managerId, body }) => {
      const tempNote = {
        _id: uniqueId('moodNote'),
        body,
        managerId,
        createdAt: Date.now()
      }

      dispatch(pushTempNote(boxId, tempNote))
      const promise = dispatch(createNote({ boxId, managerId, body }))
      promise.then(() => dispatch(popTempNote(boxId, tempNote._id)))
      return promise
    },
    changeNoteTags: (noteId, attrs) => dispatch(updateNote({ noteId, body: attrs }))
  }
}

export class MoodNotes extends Component {
  constructor () {
    super()
    this.state = { tagsModalNoteId: null, firstUnreadNoteIndex: null }
  }

  handleSubmit = (body) => {
    const { createNote, currentUserId } = this.props
    return createNote({ managerId: currentUserId, body })
  }

  handleEditTagsClick = (noteId) => {
    this.setState({ tagsModalNoteId: noteId })
  }

  handleTagsChange = (noteId, attrs) => {
    this.setState({ tagsModalNoteId: null })
    this.props.changeNoteTags(noteId, attrs)
  }

  handleEditTagsClose = () => {
    this.setState({ tagsModalNoteId: null })
  }

  handleFirstUnreadNote (unreadNoteIndex) {
    this.setState({ firstUnreadNoteIndex: unreadNoteIndex })
    this.props.markAsSeen(MARK_AS_READ_TIMEOUT)
  }

  componentWillMount () {
    const { unreadNoteIndex } = this.props
    if (unreadNoteIndex === -1) return
    this.handleFirstUnreadNote(unreadNoteIndex)
  }

  componentWillReceiveProps ({ boxId, unreadNoteIndex }) {
    if (this.props.boxId !== boxId) {
      this.setState({ tagsModalNoteId: null })
      return this.handleFirstUnreadNote(unreadNoteIndex)
    }

    if (this.state.firstUnreadNoteIndex !== unreadNoteIndex) this.setState({ firstUnreadNoteIndex: null })
    if (unreadNoteIndex !== -1) this.props.markAsSeen()
  }

  render () {
    const { onZoomLeft, onZoomRight, isZoomLeftAvailable, isZoomRightAvailable, notesQueue, onClose, box, currentUserId, companyName, isAdmin, groups } = this.props
    const { tagsModalNoteId, firstUnreadNoteIndex } = this.state
    const notes = this.props.notes.concat(notesQueue)
    const tagsModal = tagsModalNoteId ? (
      <MoodNotesTagsModal
        onClose={this.handleEditTagsClose}
        isAdmin={isAdmin}
        companyName={companyName}
        note={notes.find(note => note._id === tagsModalNoteId)}
        onSubmit={this.handleTagsChange}
        groups={groups}
      />
    ) : null
    return (
      <MoodNotesModal
        box={box}
        unreadNoteIndex={firstUnreadNoteIndex}
        currentUserId={currentUserId}
        onEditTagsClick={this.handleEditTagsClick}
        onSubmit={this.handleSubmit}
        onClose={onClose}
        notes={notes}
        onZoomLeft={onZoomLeft}
        onZoomRight={onZoomRight}
        isZoomLeftAvailable={isZoomLeftAvailable}
        isZoomRightAvailable={isZoomRightAvailable}
        embed={tagsModal}
      />
    )
  }
}

export default MoodNotesZoomDecorator(connect(mapStateToProps, mapDispatchToProps)(MoodNotes))
