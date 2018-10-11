import React, { Component } from 'react'
import { connect, startRender, endRender } from '../utils/performance'
import { getIsGetFeedbackOpen, getGetFeedbackOptions } from '../redux/selectors/ui'
import { openGetFeedback, closeGetFeedback } from '../redux/actions/ui'
import { TopMenu } from './TopMenu'
import LeftMenu from './LeftMenu'
import GetFeedback from './GetFeedback'
import Popups from './Popups'

const mapStateToProps = (state, { location: { pathname } }) => {
  return {
    isGetFeedbackOpen: getIsGetFeedbackOpen(state),
    getFeedbackOpts: getGetFeedbackOptions(state),
    pathname
  }
}

class Layout extends Component {
  constructor () {
    super()
    this.state = { isLeftMenuVisible: false }
  }

  openLeftMenu = () => {
    this.setState({ isLeftMenuVisible: true })
  }

  closeLeftMenu = () => {
    this.setState({ isLeftMenuVisible: false })
  }

  openGetFeedback = () => {
    this.props.dispatch(openGetFeedback())
  }

  closeGetFeedback = () => {
    this.props.dispatch(closeGetFeedback())
  }

  componentWillMount () { startRender() }
  componentDidMount () { endRender() }
  componentWillUpdate () { startRender() }
  componentDidUpdate () { endRender() }

  // close LeftMenu when path is changed
  componentWillReceiveProps ({ pathname }) {
    if (typeof pathname !== 'undefined' && this.state.isLeftMenuVisible) {
      this.setState({ isLeftMenuVisible: false })
    }
  }

  render () {
    const { isLeftMenuVisible } = this.state
    const { isGetFeedbackOpen, getFeedbackOpts, children } = this.props
    return (
      <div className="bf-Layout">
        <div className={isLeftMenuVisible ? 'bf-Layout-bgContainer' : ''} onClick={this.closeLeftMenu} />
        <LeftMenu isVisible={isLeftMenuVisible} openGetFeedback={this.openGetFeedback} />
        <div className="bf-Layout-container">
          <TopMenu openGetFeedback={this.openGetFeedback} openLeftMenu={this.openLeftMenu} />
          <div className="bf-Layout-contentContainer js-container">{children}</div>
        </div>
        {isGetFeedbackOpen ? (
          <GetFeedback onClose={this.closeGetFeedback} opts={getFeedbackOpts} />
        ) : null}
        <Popups />
      </div>
    )
  }
}

export default connect(mapStateToProps)(Layout)
