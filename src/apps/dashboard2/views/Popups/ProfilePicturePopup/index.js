import React, { Component } from 'react'
import { Popup, PopupTitle, PopupMessage, PopupClose } from '../Popup'
import { PopupButtonUpload } from '../PopupButton'
import { namespace } from '../../../../../utils/locales'
import imgSrc from './dude.png'
const tn = namespace('dashboard.popups.profile-picture')

export class ProfilePicturePopup extends Component {
  constructor (props) {
    super(props)
    this.state = { isOpen: props.isShown }
  }

  handleUpload = (imageSrc) => {
    const { updateCurrentUser } = this.props
    return updateCurrentUser({ imageSrc })
    .then(() => {
      this.setState({ isOpen: false })
    })
  }

  handleCloseClick = (e) => {
    e.preventDefault()
    this.setState({ isOpen: false })
  }

  render () {
    const { userName } = this.props
    const { isOpen } = this.state
    if (!isOpen) return null

    return (
      <Popup imgSrc={imgSrc}>
        <PopupTitle title={tn('title')} />
        <PopupMessage text={tn('message', { userName })} />
        <PopupButtonUpload onUpload={this.handleUpload} />
        <PopupClose text={tn('close')} onClick={this.handleCloseClick} />
      </Popup>
    )
  }
}
