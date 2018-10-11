import React, { PureComponent } from 'react'
import { FormTextareaAutosize } from '../../../components/FormTextarea'
import { Icon } from '../../../components/Icon'
import iconMoods from './iconMoods.svg?react'
import iconRating from './iconRating.svg?react'
import iconYesno from './iconYesno.svg?react'
import { uploadFile } from '../../../utils/files'
import { namespace } from '../../../../../utils/locales'
import { ModalAlert } from '../../../components/Modal'
import { MAX_UPLOAD_PICTURE_SIZE } from '../../../config'

import './index.css'
const tn = namespace('dashboard.feedback')

export class GetFeedbackPoll extends PureComponent {
  constructor () {
    super()
    this.state = { isUploadSizeErrorOpen: false }
  }

  createOptionClick (type) {
    const { index, onOptionSelect } = this.props
    return () => {
      onOptionSelect({ type, index })
      this.refs.input.focus()
    }
  }

  onInputChange = (e) => {
    const { index, onInputChange } = this.props
    onInputChange({ index, text: e.target.value })
  }

  onRemovePoll = () => {
    const { index, removePoll } = this.props
    removePoll(index)
  }

  uploadImage = () => {
    const { index, onImageUpload } = this.props
    uploadFile({ accept: 'image/*', type: 'dataURL', maxSize: MAX_UPLOAD_PICTURE_SIZE })
    .then((imageSrc) => onImageUpload({ index, imageSrc }))
    .catch(err => {
      if (err.type === 'fileSizeLimit') return this.setState({ isUploadSizeErrorOpen: true })
      return err
    })
  }

  handleUploadSizeErrorClose = () => {
    this.setState({ isUploadSizeErrorOpen: false })
  }

  componentDidMount () {
    if (!this.props.text) this.refs.input.focus()
  }

  render () {
    const { type, text, imageUrl, imageSrc, index, isSmall } = this.props
    const { isUploadSizeErrorOpen } = this.state
    return (
      <div>
        {isUploadSizeErrorOpen ? (
          <AttachmentUploadError
            message={tn('attachment-upload-error-size-content', { size: Math.round(MAX_UPLOAD_PICTURE_SIZE / 1024.0) })}
            onClose={this.handleUploadSizeErrorClose}
          />
        ) : null}
        <div className="bf-GetFeedbackPoll">
          {imageUrl || imageSrc ? (
            <button
              type="button"
              className="bf-GetFeedbackPoll-attachment"
              style={{ backgroundImage: `url('${imageUrl || imageSrc}')` }}
              onClick={this.uploadImage}
            />
          ) : (
            <button
              type="button"
              className="bf-GetFeedbackPoll-attachment is-default"
              onClick={this.uploadImage}
            />
          )}
          <FormTextareaAutosize
            ref="input"
            defaultValue={text}
            onChange={this.onInputChange}
          />
          {index !== 0 ? (
            <button
              type="button"
              className="bf-GetFeedbackPoll-remove"
              onClick={this.onRemovePoll}
            >–</button>
          ) : null}
        </div>
        <div className="bf-GetFeedbackPollTypes">
          <button type="button" className={type === 'smileys' ? 'is-selected' : ''} onClick={this.createOptionClick('smileys')}>
            <Icon icon={iconMoods} />
            <span>{isSmall ? '' : tn('moods')}</span>
          </button>
          <button type="button" className={type === 'rating' ? 'is-selected' : ''} onClick={this.createOptionClick('rating')}>
            <Icon icon={iconRating} />
            <span>{isSmall ? '' : tn('rating')}</span>
          </button>
          <button type="button" className={type === 'yesno' ? 'is-selected' : ''} onClick={this.createOptionClick('yesno')}>
            <Icon icon={iconYesno} />
            <span>{isSmall ? '' : tn('yesno')}</span>
          </button>
        </div>
      </div>
    )
  }
}

const AttachmentUploadError = ({ message, onClose }) => {
  return (
    <ModalAlert
      isWarning
      title={tn('attachment-upload-error-title')}
      text={message}
      submitTitle={tn('attachment-upload-error-button')}
      onClose={onClose}
    />
  )
}
