import React, { Component } from 'react'
import { router } from '../../../routes'
import { Dropdown } from '../../../components/Dropdown'
import { CloseButton } from '../../../components/CloseButton'
import { ModalAlert } from '../../../components/Modal'
import { IconExport, IconResend, IconDuplicate, IconDisable, IconDelete } from '../../../components/Icon'
import { FeedbackModalResend } from '../FeedbackModalResend'
import { namespace } from '../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.feedback')

export class FeedbackHeaderDropdown extends Component {
  constructor () {
    super()
    this.state = { showStatusModal: false, showDeleteModal: false, showResendModal: false }
  }

  onShowStatusModal = () => {
    this.setState({ showStatusModal: true })
  }

  onShowDeleteModal = () => {
    this.setState({ showDeleteModal: true })
  }

  onShowResendModal = () => {
    this.setState({ showResendModal: true })
  }

  closeModal = () => {
    this.setState({ showStatusModal: false, showDeleteModal: false, showResendModal: false })
  }

  onCloseReport = () => {
    router.push('/feedback')
  }

  render () {
    const { currentBox: box, onExportReplies, onStatusChange, onDeleteBox, onDuplicate, onResend, isSmall } = this.props
    const { showStatusModal, showDeleteModal, showResendModal } = this.state
    const hasResend = !box.isDisabled && !box.resendedAt && box.totalQuestions > box.totalReplies
    return (
      <div className="bf-FeedbackHeaderDropdown">
        <Dropdown
          items={[
            { text: tn('menu-export'), icon: <IconExport />, onClick: onExportReplies, isDisabled: !box.totalReplies },
            { text: tn('menu-resend'), icon: <IconResend />, onClick: this.onShowResendModal, isDisabled: !hasResend },
            { text: tn('menu-duplicate'), icon: <IconDuplicate />, onClick: onDuplicate },
            { text: box.isDisabled ? tn('menu-enable') : tn('menu-disable'), icon: <IconDisable />, onClick: box.isDisabled ? onStatusChange : this.onShowStatusModal, isDisabled: box.isScheduled },
            { text: tn('menu-delete'), icon: <IconDelete />, onClick: this.onShowDeleteModal }
          ]}
        />
      {isSmall ? <CloseButton isLarge onClose={this.onCloseReport} /> : null}
        {showStatusModal ? <FeedbackModalStatus onClose={this.closeModal} onSubmit={onStatusChange} /> : null}
        {showDeleteModal ? (
          <FeedbackModalDelete
            onClose={this.closeModal}
            onSubmit={onDeleteBox}
            boxName={box.name}
          />
        ) : null}
        {showResendModal ? (
          <FeedbackModalResend
            onClose={this.closeModal}
            onSubmit={onResend}
            receivedPercentage={box.participation}
            remainingPercentage={100 - box.participation}
            boxName={box.name}
          />
        ) : null}
      </div>
    )
  }
}

const FeedbackModalStatus = ({ onClose, onSubmit }) => {
  return (
    <ModalAlert
      isWarning
      title={tn('disable-title')}
      text={tn('disable-text')}
      submitTitle={tn('menu-disable')}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

const FeedbackModalDelete = ({ boxName, onClose, onSubmit }) => {
  return (
    <ModalAlert
      isWarning
      title={tn('delete-title')}
      submitTitle={tn('menu-delete')}
      text={boxName ? tn('delete-text', { question: boxName }) : tn('delete-text-poll')}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
