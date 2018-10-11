import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { makeCancelable } from '../../../../../utils/promise'
import t from '../../../../../utils/locales'
import { IconCircleChecked } from '../../../components/Icon'
import { Spinner } from '../../../components/Spinner'
import './index.css'

export class ChatResolveButton extends PureComponent {
  constructor () {
    super()
    this.state = { isLoading: false }
  }

  handleClick = (e) => {
    e.preventDefault()
    if (this.state.isLoading) return

    const promise = this.props.onClick()
    if (!(promise instanceof Promise)) return
    this.submitPromise = makeCancelable(promise)

    const cb = () => this.setState({ isLoading: false })
    this.setState({ isLoading: true })
    this.submitPromise.promise.then(cb)
    this.submitPromise.promise.catch(cb)
  }

  componentWillUnmount () {
    if (this.submitPromise) this.submitPromise.cancel()
  }

  render () {
    const { isLoading } = this.state
    const className = classNames('bf-ChatResolveButton', {
      'is-loading': isLoading
    })
    return (
      <div className={className} onClick={this.handleClick}>
        {isLoading ? <Spinner /> : <IconCircleChecked />}
        <span>{t('dashboard.mood.comment-resolve')}</span>
      </div>
    )
  }
}
