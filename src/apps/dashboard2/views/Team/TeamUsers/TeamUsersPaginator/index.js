import React, { Component } from 'react'
import { range } from 'lodash'
import { TEAM_USERS_PAGINATOR_OPTIONS } from '../../../../config'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.teams')

export class TeamUsersPaginator extends Component {
  handleLeftClick = (e) => {
    e.preventDefault()
    const { onChange, currentPage } = this.props
    if (currentPage > 1) onChange(currentPage - 1)
  }

  handleRightClick = (e) => {
    e.preventDefault()
    const { onChange, currentPage, pagesNumber } = this.props
    if (currentPage < pagesNumber) onChange(currentPage + 1)
  }

  render () {
    const { currentPage, pagesNumber, onChange, recordsPerPage, onRecordsPerPageChange } = this.props
    const selectorOptions = TEAM_USERS_PAGINATOR_OPTIONS

    const isArrowLeftActive = currentPage > 1
    const isArrowRightActive = currentPage < pagesNumber
    const shouldShowPaginatorOptions = !(pagesNumber <= 1 && recordsPerPage === selectorOptions[0])

    const buttons = (
      <div style={{ display: 'inline-block' }}>
        <div
          onClick={this.handleLeftClick}
          className={`bf-TeamUsersPaginator-arrow${isArrowLeftActive ? ' is-active' : ''}`}
        >
          &lt;
        </div>
        {range(1, pagesNumber + 1).map(pageNumber =>
          <PaginatorPage
            key={pageNumber}
            number={pageNumber}
            active={pageNumber === currentPage}
            onChange={onChange}
          />
        )}
        <div
          onClick={this.handleRightClick}
          className={`bf-TeamUsersPaginator-arrow${isArrowRightActive ? ' is-active' : ''}`}
        >
          &gt;
        </div>
      </div>
    )

    return (
      <div className="bf-TeamUsersPaginator">
        {shouldShowPaginatorOptions
          ? <PaginatorSelector
            value={recordsPerPage}
            onChange={onRecordsPerPageChange}
            options={selectorOptions}
          />
        : null}
        {pagesNumber > 1 ? buttons : null}
      </div>
    )
  }
}

class PaginatorSelector extends Component {
  constructor () {
    super()
    this.handleChange = (e) => {
      e.preventDefault()
      const recordsPerPage = parseInt(e.target.value)
      this.props.onChange(recordsPerPage)
    }
  }

  render () {
    const { value, options } = this.props
    return (
      <select
        className="bf-TeamUsersPaginator-recordsPerPageSelect"
        value={value}
        onChange={this.handleChange}
      >
        {options.map(option =>
          <option key={option} value={option}>
            {tn('pagination-users-per-page-option', { usersPerPage: option })}
          </option>
        )}
      </select>
    )
  }
}

class PaginatorPage extends Component {
  handleClick = (e) => {
    e.preventDefault()
    this.props.onChange(this.props.number)
  }

  render () {
    const { number, active } = this.props
    return (
      <div onClick={this.handleClick}
        className={`bf-TeamUsersPaginator-page${active ? ' is-active' : ''}`}
      >
        {number}
      </div>
    )
  }
}
