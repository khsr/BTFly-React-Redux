import React, { Component } from 'react'
import { filesHost } from '../../../../../components/boot'
import { PopupPictureModal } from '../../../components/Modal'
import './index.css'

export class FeedbackBoxName extends Component {
  constructor () {
    super()
    this.state = { isPicturePopupOpen: false }
  }

  handlePictureClick = (e) => {
    e.preventDefault()
    this.setState({ isPicturePopupOpen: true })
  }

  handlePicturePopupClose = () => {
    this.setState({ isPicturePopupOpen: false })
  }

  render () {
    const { poll, pollIndex, hasCounter } = this.props
    const { isPicturePopupOpen } = this.state
    const imageUrl = poll.imageUrl ? `${filesHost}/${poll.imageUrl}` : ''
    const counter = hasCounter ? <span>{pollIndex + 1}</span> : null
    return (
      <div className="bf-FeedbackBoxName">
        {isPicturePopupOpen ? <PopupPictureModal onClose={this.handlePicturePopupClose} src={imageUrl} /> : null}
        {hasCounter || imageUrl ? (
          imageUrl ? (
            <button
              type="button"
              className="bf-FeedbackBoxName-counter"
              style={{ backgroundImage: `url(${imageUrl})` }}
              onClick={this.handlePictureClick}
            >
              {counter}
            </button>
          ) : (
            <div className="bf-FeedbackBoxName-counter">
              {counter}
            </div>
          )
        ) : null}
        <span>{poll.text}</span>
      </div>
    )
  }
}
