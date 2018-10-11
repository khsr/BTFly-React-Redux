import React, { Component } from 'react'
import { Spinner } from '../../../../components/Spinner'
import t from '../../../../../../utils/locales'
import './index.css'

export class TeamTagsCreateForm extends Component {
  constructor () {
    super()
    this.state = { value: '', isLoading: false }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const value = this.state.value.trim()
    if (!value.length) return
    this.setState({ value: '', isLoading: true })
    this.props.onSubmit(value).then(() => {
      this.setState({ isLoading: false })
    })
  }

  render () {
    const { isLoading, value } = this.state
    const isEmpty = Boolean(!value.trim())
    return (
      <form className="bf-TeamTagsCreateForm" onSubmit={this.onSubmit}>
        <input
          type="text"
          className={`${isEmpty ? ' is-empty' : ''}`}
          placeholder={t('dashboard.teams.tags-tag-name')}
          value={value}
          onChange={this.onChange}
        />
        <button type="submit" className="bf-TeamTagsCreateForm-submitButton" disabled={isEmpty}>
          <span>{t('dashboard.teams.tags-create-tag')}</span>
          {isLoading ? <Spinner isCenter /> : null}
        </button>
      </form>
    )
  }
}
