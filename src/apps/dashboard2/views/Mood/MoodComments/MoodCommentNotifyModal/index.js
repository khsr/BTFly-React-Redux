import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { Comment } from '../../../../views/Chat/Comment'
import { Modal } from '../../../../components/Modal'
import { FormButton } from '../../../../components/FormButton'
import { namespace } from '../../../../../../utils/locales'
import { makeCancelable } from '../../../../../../utils/promise'
import './index.css'
const tn = namespace('dashboard.mood')

export class MoodCommentNotifyModal extends PureComponent {
  constructor () {
    super()
    this.state = { isLoading: false }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.isLoading) return

    const { $input: { value } } = this.refs
    const { onSubmit } = this.props

    const promise = onSubmit(value)
    if (!(promise instanceof Promise)) return
    this.submitPromise = makeCancelable(promise)

    const cb = () => this.setState({ isLoading: false })
    this.setState({ isLoading: true })
    this.submitPromise.promise.then(cb)
    this.submitPromise.promise.catch(cb)
  }

  componentWillUnmount () {
    if (this.submitPromise) this.submitPromise.cancel()
  }

  render () {
    const { isLoading } = this.state
    const { reply, boxId, currentUserName, onClose } = this.props
    const footer = (
      <div className="bf-MoodCommentNotifyModal-footer">
        <div className="bf-MoodCommentNotifyModal-footer-form">
          <textarea
            placeholder={tn('comment-notify-modal-input-placeholder')}
            ref="$input"
          />
        </div>
        <div className="bf-MoodCommentNotifyModal-footer-buttons">
          <FormButton
            text={tn('comment-notify-modal-submit')}
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    )
    const to = `/mood/${boxId}/chats/${reply._id}`
    return (
      <Modal isLarge headerIcon={<div />} footer={footer} onClose={onClose} title={tn('comment-notify-modal-title')}>
        <div className="bf-MoodCommentNotifyModal">
          <div
            className="bf-MoodCommentNotifyModal-text"
            dangerouslySetInnerHTML={{ __html: tn('comment-notify-modal-input-text-1', { name: currentUserName }) }}
          />
          <div className="bf-MoodCommentNotifyModal-card">
            <Comment boxType="mood" reply={reply} />
          </div>
          <div className="bf-MoodCommentNotifyModal-text">
            <span>{tn('comment-notify-modal-input-text-2-1')}</span>
            {" "}
            <Link to={to}>{tn('comment-notify-modal-input-text-2-2')}</Link>
            {" "}
            <span>{tn('comment-notify-modal-input-text-2-3')}</span>
          </div>
        </div>
      </Modal>
    )
  }
}
