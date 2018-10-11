import React, { Component } from 'react'
import { uploadFile } from '../../../utils/files'
import t from '../../../../../utils/locales'
import { MAX_UPLOAD_PICTURE_SIZE } from '../../../config'
import './index.css'

export class ProfilePicture extends Component {
  constructor () {
    super()
    this.state = { imageSrc: null }
  }

  addAttachement = () => {
    uploadFile({ accept: 'image/*', type: 'dataURL', maxSize: MAX_UPLOAD_PICTURE_SIZE })
    .then((imageSrc) => {
      this.setState({ imageSrc })
      this.props.onChange({ isValid: true, isChanged: true, value: imageSrc })
    })
  }

  render () {
    const { picture } = this.props
    const { imageSrc } = this.state
    return (
      <div className="bf-ProfilePicture">
        <img src={imageSrc || picture} />
        <div className="bf-ProfilePicture-details">
          <div className="bf-ProfilePicture-details-title">{t('dashboard.profile.picture')}</div>
          <div className="bf-ProfilePicture-details-info">{t('dashboard.profile.photo')}</div>
          <button type="button" onClick={this.addAttachement}>
            {t('dashboard.profile.change-image')}
          </button>
        </div>
      </div>
    )
  }
}
