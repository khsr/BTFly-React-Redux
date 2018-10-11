import React, { Component } from 'react'
import { router } from '../../../routes'
import { connect } from '../../../utils/performance'
import moment from '../../../utils/moment'
import { Container, ContainerHeader, ContainerBody } from '../../../components/Container'
import { exportMoodRepliesToCSV } from '../../../redux/csv-utils'
import { changeZoom, resetZoom } from '../../../redux/actions/mood'
import { shareMoodResults } from '../../../redux/actions/boxes'
import { getCurrentUser } from '../../../redux/selectors/users'
import { getCurrentCompany } from '../../../redux/selectors/company'
import { getUnreadNotesNumber } from '../../../redux/selectors/notes'
import { emptyBox, getUnreadMoodCommentsNumber, getSelectedMergedBoxIndex,
  getMergedBoxes, getCurrentGroups, getZoom, getZoomOptions,
  getSelectedBoxId, getSelectedGroup, yourTeam,
  getBoxesIds, getSelectedMergedBox
} from '../../../redux/selectors/mood'
import { downloadFile } from '../../../utils/files'
import { MoodHeaderMenu } from '../MoodHeaderMenu'
import { MoodHeaderDropdown } from '../MoodHeaderDropdown'
import { MoodTimeline } from '../MoodTimeline'
import { MoodCharts } from '../MoodCharts'
import { MoodDrivers } from '../MoodDrivers'
import { MoodShareModal } from '../MoodShareModal'
import MoodNotes from '../../MoodNotes'

const mapStateToProps = (state, { params }) => {
  return {
    isSmall: state.isSmall,
    yourTeam,
    currentCompany: getCurrentCompany(state),
    currentUser: getCurrentUser(state),
    zoom: getZoom(state),
    zoomOptions: getZoomOptions(state),

    selectedGroup: getSelectedGroup(state, params),
    currentGroups: getCurrentGroups(state, params),

    selectedBoxId: getSelectedBoxId(state, params) || emptyBox._id,
    boxesIds: getBoxesIds(state, params),

    selectedMergedBox: getSelectedMergedBox(state, params) || emptyBox,
    selectedMergedBoxIndex: getSelectedMergedBoxIndex(state, params),
    mergedBoxes: getMergedBoxes(state, params),

    unreadNotes: getUnreadNotesNumber(state),
    unreadComments: getUnreadMoodCommentsNumber(state)
  }
}

class MoodReport extends Component {
  constructor () {
    super()
    this.state = { isNotesModalOpen: false, isShareModalOpen: false }
  }

  onNotesClick = (boxId) => {
    const { selectedMergedBox } = this.props
    if (!selectedMergedBox.boxIds.includes(boxId)) this.handleBoxChange(boxId)
    this.setState({ isNotesModalOpen: true })
  }

  onNotesModalCloseClick = () => {
    this.setState({ isNotesModalOpen: false })
  }

  setScrollLeft = (scrollLeft) => {
    const { setScrollLeft } = this.props
    setScrollLeft(scrollLeft)
  }

  onOpenShareModal = () => {
    this.setState({ isShareModalOpen: true })
  }

  onCloseShareModal = () => {
    this.setState({ isShareModalOpen: false })
  }

  shareCurrentBox = () => {
    const { selectedBoxId, dispatch } = this.props
    return dispatch(shareMoodResults({ boxId: selectedBoxId }))
  }

  exportCurrentBox = () => {
    const { selectedMergedBox } = this.props
    const date = selectedMergedBox.createdAt.length === 1
    ? moment(selectedMergedBox.createdAt[0]).format('YYYYMMDD')
    : `${moment(selectedMergedBox.createdAt[0]).format('YYYYMMDD')} - ${moment(selectedMergedBox.createdAt[selectedMergedBox.createdAt.length - 1]).format('YYYYMMDD')}`
    downloadFile({
      name: `mood-${date}`,
      extension: 'csv',
      content: exportMoodRepliesToCSV(selectedMergedBox, selectedMergedBox.replies)
    })
  }

  handleZoomChange = (scale) => {
    this.props.dispatch(changeZoom(scale))
  }

  handleBoxChange = (boxId) => {
    const { selectedGroup } = this.props
    const url = `mood/${boxId}${selectedGroup ? `/${selectedGroup._id}` : ''}`
    router.push(url)
  }

  componentWillUnmount = () => {
    this.props.dispatch(resetZoom())
  }

  render () {
    const { selectedBoxId, isSmall, currentCompany, currentUser,
      selectedMergedBoxIndex, selectedMergedBox,
      mergedBoxes, selectedGroup, currentGroups, unreadNotes, unreadComments,
      boxesIds, zoom, zoomOptions, scrollLeft } = this.props
    const { isNotesModalOpen, isShareModalOpen } = this.state
    return (
      <Container>
        {isNotesModalOpen ? (
          <MoodNotes
            boxId={selectedBoxId}
            boxesIds={boxesIds}
            onClose={this.onNotesModalCloseClick}
            onBoxChange={this.handleBoxChange}
          />
        ) : null}
        {isShareModalOpen ? (
          <MoodShareModal
            onClose={this.onCloseShareModal}
            onSubmit={this.shareCurrentBox}
          />
        ) : null}
        <ContainerHeader>
          <MoodHeaderMenu
            isReport
            currentBoxId={selectedBoxId}
            currentUser={currentUser}
            unreadNotes={unreadNotes}
            unreadComments={unreadComments}
          />
          <MoodHeaderDropdown
            hasReplies={selectedMergedBox.allReplies.length > 0}
            isShareEnabled={currentCompany.isMoodShareEnabled || selectedMergedBox.moodSharedAt.length > 1}
            isAlreadyShared={selectedMergedBox.moodSharedAt[0] || selectedMergedBox.status[0] !== 'disabled'}
            isAdmin={currentUser.isAdmin}
            openSettingsModal={this.props.openSettingsModal}
            exportCurrentBox={this.exportCurrentBox}
            onOpenShareModal={this.onOpenShareModal}
          />
        </ContainerHeader>
        <ContainerBody>
          <MoodTimeline
            currentCompany={currentCompany}
            currentBox={selectedMergedBox}
            currentBoxes={mergedBoxes}
            currentUser={currentUser}
            currentGroup={selectedGroup}
            currentGroups={currentGroups}
            yourTeam={yourTeam}
            scrollLeft={scrollLeft}
            setScrollLeft={this.setScrollLeft}
            onNotesClick={this.onNotesClick}
            onZoomChange={this.handleZoomChange}
            onBoxChange={this.handleBoxChange}
            zoom={zoom}
            zoomOptions={zoomOptions}
          />
          <MoodCharts
            currentBox={selectedMergedBox}
            currentBoxIndex={selectedMergedBoxIndex}
            currentBoxes={mergedBoxes}
          />
          <MoodDrivers
            currentCompany={currentCompany}
            currentBox={selectedMergedBox}
            currentBoxIndex={selectedMergedBoxIndex}
            currentBoxes={mergedBoxes}
            isSmall={isSmall}
          />
        </ContainerBody>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(MoodReport)
