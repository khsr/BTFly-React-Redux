import React, { Component } from 'react'
import { namespace } from '../../../../../utils/locales'
import { uploadFile } from '../../../utils/files'
import { Spinner } from '../../../components/Spinner'
import { IconCamera } from '../../../components/Icon'
import { MAX_UPLOAD_PICTURE_SIZE } from '../../../config'

import './index.css'
const tn = namespace('dashboard.popups.popup-button')

export const PopupButton = ({ title, icon, isDisabled, isLoading, onClick }) => {
  return (
    <button
      className="bf-PopupButton"
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      <span>{title}</span>
      {isLoading ? <Spinner /> : icon}
    </button>
  )
}

export class PopupButtonUpload extends Component {
  constructor () {
    super()
    this.state = { isDisabled: false, isLoading: false }
  }

  handleClick = (e) => {
    e.preventDefault()
    const { onUpload } = this.props
    uploadFile({ accept: 'image/*', type: 'dataURL', maxSize: MAX_UPLOAD_PICTURE_SIZE })
    .then(imageSrc => {
      this.setState({ isLoading: true })
      return onUpload(imageSrc)
    })
  }

  render () {
    const { isDisabled, isLoading } = this.state
    return (
      <PopupButton
        title={tn('name')}
        icon={<IconCamera />}
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={this.handleClick}
      />
    )
  }
}
