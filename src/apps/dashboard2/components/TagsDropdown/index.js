import React, { Component } from 'react'
import { makeDropdownToggler, DropdownMenu, DropdownItem, DropdownSeparator } from '..//Dropdown'
import { namespace } from '../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.mood')

export class TagsDropdown extends Component {
  constructor () {
    super()
    this.state = { isOpen: false, filter: '' }
    this.toggleDropdown = makeDropdownToggler(this)
  }

  makeClickHandler (groupId) {
    return () => this.props.onClick(groupId)
  }

  onFilter = (e) => {
    this.setState({ filter: e.target.value.trim().toLowerCase() })
  }

  onFilterClick (e) {
    e.stopPropagation()
  }

  componentWillUnmount () {
    this.toggleDropdown(true)
  }

  render () {
    const { groups, visibleGroup, driver, IndexIcon, noValue } = this.props
    const { isOpen, filter } = this.state
    const filteredGroups = groups.filter((g) => {
      return !filter || (g.name && g.name.toLowerCase().includes(filter))
    })
    return (
      <div className="bf-TagsDropdown">
        <button type="button" className="bf-TagsDropdown-button" onClick={this.toggleDropdown}>
          <IndexIcon isSmall bfIndex={visibleGroup.driverIndex} driver={driver} />
          <span>{visibleGroup.name}</span>
        </button>
        <DropdownMenu isWhite isOpen={isOpen} marginBottom="1.2rem" onClick={this.toggleDropdown}>
          {groups.length > 4 ? (
            <input
              value={filter}
              placeholder={tn('report-search-tags')}
              onChange={this.onFilter}
              onClick={this.onFilterClick}
            />
          ) : null}
          {filteredGroups.map((g) => {
            if (g._id === 'separator') return <DropdownSeparator key={g._id} />
            return (
              <DropdownItem
                isDefaultColor
                key={g._id}
                onClick={this.makeClickHandler(g._id)}
                text={`${g.name}${noValue ? '' : ` (${g.driverIndex === null ? '-' : g.driverIndex})`}`}
                icon={<IndexIcon isSmall bfIndex={g.driverIndex} driver={driver} />}
                isDisabled={g.isDisabled}
                isActive={visibleGroup._id === g._id}
              />
            )
          })}
        </DropdownMenu>
      </div>
    )
  }
}
