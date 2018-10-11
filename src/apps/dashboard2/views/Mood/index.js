import React, { Component } from 'react'
import { connect } from '../../utils/performance'
import { Container, ContainerBody } from '../../components/Container'
import { getCurrentUser, getAdminEmail } from '../../redux/selectors/users'
import { getBoxesIds } from '../../redux/selectors/mood'
import { updateMoodSettings, disableMoodSettings } from '../../redux/actions/company'
import { MoodEmpty } from './MoodEmpty'
import { MoodSettings } from './MoodSettings'

export { default as MoodReport } from './MoodReport'
export { default as MoodCommentsWrapper } from './MoodCommentsWrapper'
export { default as MoodChat } from './MoodChat'

const mapStateToProps = (state) => {
  const { currentCompany } = state

  const currentUser = getCurrentUser(state)
  const adminEmail = getAdminEmail(state)
  const boxesIds = getBoxesIds(state)
  const isEmpty = boxesIds.length === 0 && !currentCompany.isMoodSet

  return {
    isEmpty,
    currentCompany,
    currentUser,
    adminEmail
  }
}

class Mood extends Component {
  constructor () {
    super()
    this.state = { isSettingsModalOpen: false, scrollLeft: 0 }
  }

  openSettingsModal = () => {
    this.setState({ isSettingsModalOpen: true })
  }

  closeSettingsModal = () => {
    this.setState({ isSettingsModalOpen: false })
  }

  setScrollLeft = (scrollLeft) => {
    this.setState({ scrollLeft })
  }

  saveMoodSettings = (moodSettings, isCheck) => {
    const { dispatch } = this.props
    return dispatch(!isCheck ? disableMoodSettings() : updateMoodSettings(moodSettings))
  }

  render () {
    const { isEmpty, currentCompany, currentUser, adminEmail } = this.props
    const { scrollLeft, isSettingsModalOpen } = this.state
    return (
      <div className="bf-Layout-contentContainer">
        {isEmpty ? (
          <Container>
            <ContainerBody>
              <MoodEmpty
                isManager={currentUser.isManager}
                adminEmail={adminEmail}
                openSettingsModal={this.openSettingsModal}
              />
            </ContainerBody>
          </Container>
        ) : (
          React.cloneElement(this.props.children, {
            scrollLeft,
            setScrollLeft: this.setScrollLeft,
            openSettingsModal: this.openSettingsModal
          })
        )}
        {isSettingsModalOpen ? (
          <MoodSettings
            currentCompany={currentCompany}
            isEmpty={isEmpty}
            onClose={this.closeSettingsModal}
            saveMoodSettings={this.saveMoodSettings}
          />
        ) : null}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Mood)
