import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import fastdom from 'fastdom'
import { makeCancelable } from '../../../../utils/promise'
import { trailing } from '../../../../utils/throttle'
import { CloseButton } from '../CloseButton'
import { FormButton } from '../FormButton'
import { Logo } from '../Logo'
import { RenderInBody } from '../RenderInBody'
import { namespace } from '../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.modal')
export const stopPropagation = (e) => e.stopPropagation()

export class Modal extends Component {
  static defaultProps = {
    footerAlign: 'center',
    submitTitle: ''
  }

  static propTypes = {
    submitTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = { isLoading: false }
    this.submitPromise = null
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { onSubmit, onClose } = this.props
    if (typeof onSubmit !== 'function') return onClose()

    const promise = onSubmit()
    if (!(promise instanceof Promise)) return

    this.submitPromise = makeCancelable(promise)
    this.setState({ isLoading: true })
    this.submitPromise.promise.then(() => {
      this.setState({ isLoading: false })
      onClose()
    })
    this.submitPromise.promise.catch(() => {
      this.setState({ isLoading: false })
    })
  }

  componentWillUnmount () {
    if (this.submitPromise) this.submitPromise.cancel()
  }

  render () {
    const { isLoading } = this.state
    const { title, submitTitle, submitIcon, isWarning, isLarge, onClose, isDisabled,
            isHeaderGrey, headerIcon, children, footer, footerAlign } = this.props
    const footerClassName = classNames('bf-Modal-footer', `is-${footerAlign}`, {
      'is-large': isLarge
    })
    return (
      <ModalBackdrop onClose={onClose}>
        <form className="bf-Modal" onClick={stopPropagation} onSubmit={this.onSubmit}>
          <div className={`bf-Modal-header${isWarning ? ' is-warning' : ''}${isLarge ? ' is-large' : ''}${isHeaderGrey ? ' is-grey' : ''}`}>
            {headerIcon !== undefined ? headerIcon : (isLarge ? <Logo /> : null)}
            {title}
            <CloseButton onClose={onClose} />
          </div>
          <div className={`bf-Modal-body${isLarge ? ' is-large' : ''}`}>
            {children}
          </div>
          <div className={footerClassName}>
            {footer || (
              <FormButton
                isLarge={isLarge}
                isDisabled={isLoading || isDisabled}
                isLoading={isLoading}
                isWarning={isWarning}
                icon={submitIcon}
                text={submitTitle.toUpperCase()}
                onClick={this.onSubmit}
              />
            )}
          </div>
        </form>
      </ModalBackdrop>
    )
  }
}

export const ModalAlert = (props) => {
  const { text } = props
  return (
    <Modal {...props} submitTitle={props.submitTitle || tn('ok')}>
      <div className="bf-ModalAlert" dangerouslySetInnerHTML={{ __html: text }} />
    </Modal>
  )
}

export class ModalBackdrop extends Component {
  closeOnEscape = (e) => {
    if (e.keyCode === 27) this.props.onClose()
  }

  componentWillMount () {
    document.body.addEventListener('keydown', this.closeOnEscape)
  }

  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.closeOnEscape)
  }

  render () {
    const { children, onClose, isDark, isTransparent } = this.props
    const className = classNames('bf-ModalBackdrop', {
      'is-dark': isDark,
      'is-transparent': isTransparent
    })
    return (
      <RenderInBody>
        <div className={className} onClick={onClose}>
          {children}
        </div>
      </RenderInBody>
    )
  }
}

export class EmbedModalBackdrop extends Component {
  constructor () {
    super()
    this.debouncedHandleResize = trailing(this.handleResize.bind(this), 50)
  }

  componentWillMount () {
    window.addEventListener('resize', this.debouncedHandleResize)
  }

  componentDidMount () {
    const { $element, $element: { parentElement } } = this.refs
    const { clientHeight, clientWidth } = parentElement
    $element.style.width = clientWidth + 'px'
    $element.style.height = clientHeight + 'px'
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedHandleResize)
  }

  componentDidUpdate () {
    this.handleResize()
  }

  handleResize () {
    fastdom.measure(() => {
      const { $element, $element: { parentElement } } = this.refs
      const { clientHeight, clientWidth } = parentElement
      fastdom.mutate(() => {
        $element.style.width = clientWidth + 'px'
        $element.style.height = clientHeight + 'px'
      })
    })
  }

  render () {
    const { children, isWhite, onClose } = this.props
    const className = classNames('bf-EmbedModalBackdrop', {
      'is-white': isWhite
    })
    return (
      <div ref="$element" className={className} onClick={onClose}>
        {children}
      </div>
    )
  }
}

export const PopupPictureModal = ({ onClose, src }) => {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bf-PopupPictureModal">
        <div className="bf-PopupPictureModal-header">
          <Logo />
          <CloseButton onClose={onClose} />
        </div>
        <div className="bf-PopupPictureModal-body">
          <img src={src} />
        </div>
      </div>
    </ModalBackdrop>
  )
}
