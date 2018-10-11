import React, { Component } from 'react'
import { Popup, PopupTitle, PopupMessage, PopupClose } from '../Popup'
import { PopupButtonUpload } from '../PopupButton'
import { namespace } from '../../../../../utils/locales'
const tn = namespace('dashboard.popups.welcome')

export class WelcomePopup extends Component {
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
      <Popup isLogo>
        <PopupTitle title={tn('title')} />
        <PopupMessage text={tn('message', { userName })} />
        <PopupMessage text={tn('upload-photo-message')} />
        <PopupButtonUpload onUpload={this.handleUpload} />
        <PopupClose text={tn('close')} onClick={this.handleCloseClick} />
      </Popup>
    )
  }
}
