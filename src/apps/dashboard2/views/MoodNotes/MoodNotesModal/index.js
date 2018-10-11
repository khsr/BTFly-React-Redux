import React, { PureComponent } from 'react'
import { formatDate } from '../../../utils/moment'
import { Logo } from '../../../components/Logo'
import { ModalBackdrop, stopPropagation } from '../../../components/Modal'
import { CloseButton } from '../../../components/CloseButton'
import { MoodNote } from '../MoodNote'
import { namespace } from '../../../../../utils/locales'

import './index.css'
const tn = namespace('dashboard.mood-notes')

export class MoodNotesModal extends PureComponent {
  componentDidMount () {
    this.fillPadder()
    this.scrollBottom()
  }

  componentDidUpdate ({ notes: prevNotes }) {
    const { notes } = this.props
    this.fillPadder()
    if (notes.length !== prevNotes.length) this.scrollBottom()
  }

  scrollBottom () {
    const { $body } = this.refs
    setTimeout(() => {
      $body.scrollTop = 1000000
    })
  }

  fillPadder () {
    const { $body, $notes, $padder } = this.refs
    setTimeout(() => {
      const diff = $body.clientHeight - $notes.clientHeight
      $padder.style.paddingTop = diff > 20 ? `calc(${diff}px - 5rem)` : 0
    })
  }

  render () {
    const { onClose, box, onZoomLeft, onZoomRight, isZoomLeftAvailable, isZoomRightAvailable, unreadNoteIndex, currentUserId, notes, onEditTagsClick, embed, onSubmit } = this.props
    return (
      <ModalBackdrop onClose={onClose}>
        <div className="bf-MoodNotesModal" onClick={stopPropagation}>
          <MoodNotesHeader
            onZoomLeft={onZoomLeft}
            onZoomRight={onZoomRight}
            isZoomLeftAvailable={isZoomLeftAvailable}
            isZoomRightAvailable={isZoomRightAvailable}
            date={box.get('createdAt')}
            onClose={onClose}
          />
          <div className="bf-MoodNotesModal-content">
            {embed}
            <div className="bf-MoodNotesModal-body" ref="$body">
              <div ref="$padder" />
              <div className="bf-MoodNotesModal-notes" ref="$notes">
                {notes.length === 0 ? <h2 className="bf-MoodNotesModal-notes-noNotesMessage">{tn('no-notes')}</h2> : null}
                {notes.map((note, index) => (
                  <div key={note._id}>
                    {index > 0 && index === unreadNoteIndex ? <MoodNotesUnreadLine /> : null}
                    <MoodNote
                      note={note}
                      isMine={note.manager._id === currentUserId}
                      onTagsChange={onEditTagsClick}
                    />
                  </div>
                ))}
              </div>
            </div>
            <MoodNotesForm onSubmit={onSubmit} />
          </div>
        </div>
      </ModalBackdrop>
    )
  }
}

const MoodNotesHeader = ({ onZoomLeft, onZoomRight, isZoomLeftAvailable, isZoomRightAvailable, onClose, date }) => (
  <div className="bf-MoodNotesModal-header">
    <div className="bf-MoodNotesModal-header-left">
      <Logo />
    </div>
    <div className="bf-MoodNotesModal-header-arrowWrapper">
      {isZoomLeftAvailable ? (
        <div onClick={onZoomLeft} className="bf-MoodNotesModal-header-arrowLeft" />
      ) : null}
    </div>
    <div className="bf-MoodNotesModal-header-center">
      <span className="bf-MoodNotesModal-header-title">{tn('title')}</span>
      <span className="bf-MoodNotesModal-header-date">{formatDate(date)}</span>
    </div>
    <div className="bf-MoodNotesModal-header-arrowWrapper">
      {isZoomRightAvailable ? (
        <div onClick={onZoomRight} className="bf-MoodNotesModal-header-arrowRight" />
      ) : null}
    </div>
    <div className="bf-MoodNotesModal-header-right">
      <CloseButton onClose={onClose} />
    </div>
  </div>
)

class MoodNotesForm extends PureComponent {
  constructor () {
    super()
    this.state = { value: '' }
  }

  handleChange = (e) => {
    e.preventDefault()
    const { value } = e.target
    this.setState({ value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const value = this.state.value.trim()
    if (value) this.props.onSubmit(value)
    this.setState({ value: '' })
  }

  componentDidMount () {
    this.refs.$input.focus()
  }

  render () {
    const { value } = this.state
    const isDisabled = value.trim().length === 0
    return (
      <form className="bf-MoodNotesModal-form" onSubmit={this.handleSubmit}>
        <input ref="$input" type="text" value={value} onChange={this.handleChange} />
        <button type="submit" disabled={isDisabled}>{tn('button-add-note')}</button>
      </form>
    )
  }
}

const MoodNotesUnreadLine = () => (
  <div className="bf-MoodNotesModal-newNotesLine">
    <div />
    <span>{tn('unread-line-title')}</span>
  </div>
)
