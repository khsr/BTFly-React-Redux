import React, { Component } from 'react'
import { connect } from '../../utils/performance'
import { kebabCase } from 'lodash'
import moment from '../../utils/moment'
import { exportRepliesToCSV } from '../../redux/csv-utils'
import { updateBoxStatus, deleteBox, resendBox } from '../../redux/actions/boxes'
import { getSelectedBoxId, getSelectedGroup, getGroupsListForSelectedBox,
  getTransformedBoxesList, getTransformedSelectedBox, getCommentsListForSelectedBox
} from '../../redux/selectors/feedback'
import { openGetFeedback } from '../../redux/actions/ui'
import { downloadFile } from '../../utils/files'
import { Container, ContainerHeader, ContainerBody } from '../../components/Container'
import { FeedbackEmpty } from './FeedbackEmpty'
import { FeedbackSidebar } from './FeedbackSidebar'
import { FeedbackHeaderMenu } from './FeedbackHeaderMenu'
import { FeedbackHeaderDropdown } from './FeedbackHeaderDropdown'
import './index.css'

export { default as FeedbackReportWrapper } from './FeedbackReportWrapper'
export { default as FeedbackChat } from './FeedbackChat'
export { default as FeedbackCommentsWrapper } from './FeedbackCommentsWrapper'

const mapStateToProps = (state, { params, location: { pathname, query } }) => {
  const { isSmall } = state
  const selectedBoxId = getSelectedBoxId(state, params)
  if (!selectedBoxId) return { isEmpty: true }

  const currentGroup = getSelectedGroup(state, params)
  const isSidebar = isSmall && !params.boxId

  const currentBox = getTransformedSelectedBox(state, params)
  const comments = getCommentsListForSelectedBox(state, params)
  const transformedBoxes = getTransformedBoxesList(state, params)
  const groups = getGroupsListForSelectedBox(state, params)
  return {
    isReport: !pathname.includes('/comments'),
    ask: pathname.includes('/ask') ? query : null,
    isSmall,
    isSidebar,
    boxes: transformedBoxes,
    currentBox,
    currentGroup,
    groups,
    comments
  }
}

class Feedback extends Component {
  onExportReplies = () => {
    const { currentBox } = this.props
    downloadFile({
      name: kebabCase(currentBox.polls[0].text).substr(0, 80) + '-' + moment().format('YYYYMMDD'),
      extension: 'csv',
      content: exportRepliesToCSV(currentBox, currentBox.replies.toArray())
    })
  }

  onStatusChange = () => {
    const { dispatch, currentBox } = this.props
    return dispatch(updateBoxStatus({
      status: currentBox.isDisabled ? 'enabled' : 'disabled',
      boxId: currentBox._id
    }))
  }

  onDeleteBox = () => {
    const { dispatch, currentBox } = this.props
    return dispatch(deleteBox({ boxId: currentBox._id }))
  }

  onResend = () => {
    const { dispatch, currentBox } = this.props
    const { questions, replies } = currentBox
    const questionIds = questions
    .filter((q) => !replies.find((r) => r.questionId === q._id))
    .map((q) => q._id)
    return dispatch(resendBox({ boxId: currentBox._id, questionIds }))
  }

  onDuplicate = () => {
    const { currentBox, groups } = this.props
    const { isAnonymous, isAll, polls } = currentBox
    this.openGetFeedback({
      isAnonymous,
      isAll,
      isDuplicate: true,
      isStep1Disabled: false,
      isStep2Disabled: false,
      polls,
      groupIds: groups.map((g) => g._id),
      step: 3
    })
  }

  openGetFeedback = (opts) => {
    this.props.dispatch(openGetFeedback(opts))
  }

  componentDidMount () {
    const { ask } = this.props
    if (!ask) return
    const { type, text } = ask
    this.openGetFeedback({ polls: [{ type, text, imageSrc: '' }], isStep1Disabled: false })
  }

  render () {
    const { isEmpty, isReport, isSidebar, isSmall, boxes, currentBox } = this.props
    if (isEmpty) return <FeedbackEmpty openGetFeedback={this.openGetFeedback} />
    return (
      <div className="bf-Feedback">
        <FeedbackSidebar boxes={boxes} currentBoxId={currentBox._id} isReport={isReport} />
        {!this.props.chat ? null : <div className="bf-Feedback-chatContent">{this.props.chat}</div>}
        {!this.props.content || isSidebar ? null : (
          <Container>
            <ContainerHeader>
              <FeedbackHeaderMenu currentBox={currentBox} isReport={isReport} />
              <FeedbackHeaderDropdown
                isSmall={isSmall}
                currentBox={currentBox}
                onExportReplies={this.onExportReplies}
                onStatusChange={this.onStatusChange}
                onDeleteBox={this.onDeleteBox}
                onResend={this.onResend}
                onDuplicate={this.onDuplicate}
              />
            </ContainerHeader>
            <ContainerBody>
              {this.props.content}
            </ContainerBody>
          </Container>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Feedback)
