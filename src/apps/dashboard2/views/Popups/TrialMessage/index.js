import React, { Component } from 'react'
import moment from '../../../utils/moment'
import { IconCancel } from '../../../components/Icon'
import { namespace } from '../../../../../utils/locales'

import './index.css'
const tn = namespace('dashboard.popups.trial-message')

export class TrialMessage extends Component {
  constructor (props) {
    super(props)
    this.state = { isOpen: props.isShown }
  }

  closeTrialMessage = () => {
    this.setState({ isOpen: false })
  }

  render () {
    const { userName, trialEnds, onTrialUpgrade } = this.props
    const { isOpen } = this.state
    if (!isOpen) return null
    const remain = moment(new Date(trialEnds)).fromNow()

    return (
      <div className="bf-TrialMessage">
        <div className="bf-TrialMessage-text">
          <span dangerouslySetInnerHTML={{ __html: tn('notification-text', { userName, remain }) }} />
          <span>|</span>
          <a href="#" onClick={onTrialUpgrade}>{tn('notification-click')}</a>
        </div>
        <button type="button" className="bf-TrialMessage-button" onClick={this.closeTrialMessage}>
          <IconCancel isWhite isSmall />
        </button>
      </div>
    )
  }
}
