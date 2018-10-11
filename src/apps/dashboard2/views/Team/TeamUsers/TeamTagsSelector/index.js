import React, { PureComponent } from 'react'
import { debounce } from 'lodash'
import Immutable from 'immutable'
import classNames from 'classnames'
import { namespace } from '../../../../../../utils/locales'
import { FormCheck } from '../../../../components/FormCheck'
import './index.css'
const tn = namespace('dashboard.teams')

class TeamTagsSelectorBase extends PureComponent {
  constructor (props) {
    super(props)
    this.initialSelection = new Immutable.Set(props.selected || [])
    this.initialManagmentSelection = new Immutable.Set(props.selectedForManagment || [])
    this.state = { selected: this.initialSelection, selectedForManagment: this.initialManagmentSelection }
  }

  handleSelect = (groupId, isSelected) => {
    const updatedSelected = isSelected
    ? this.state.selected.delete(groupId)
    : this.state.selected.add(groupId)

    const updatedSelectedForManagment = isSelected
    ? this.state.selectedForManagment.delete(groupId)
    : this.state.selectedForManagment

    this.handleSelectCallback(updatedSelected, updatedSelectedForManagment)
  }

  handleManagmentSelect = (groupId, isSelected) => {
    const updatedSelectedForManagment = isSelected
    ? this.state.selectedForManagment.delete(groupId)
    : this.state.selectedForManagment.add(groupId)

    const updatedSelected = isSelected
    ? this.state.selected.add(groupId)
    : this.state.selected.delete(groupId)

    this.handleSelectCallback(updatedSelected, updatedSelectedForManagment)
  }

  handleSelectCallback (updatedSelected, updatedSelectedForManagment) {
    this.setState({ selected: updatedSelected, selectedForManagment: updatedSelectedForManagment })
    this.props.onChange({
      value: updatedSelected.toArray(),
      isValid: this.props.allowsEmpty || Boolean(updatedSelected.size),
      isChanged: !Immutable.is(updatedSelected, this.initialSelection)
    }, () => {
      this.props.isManager && this.props.onAccessChange({
        value: updatedSelectedForManagment.toArray(),
        isValid: this.props.allowManagmentEmpty || Boolean(updatedSelectedForManagment.size),
        isChanged: !Immutable.is(updatedSelectedForManagment, this.initialManagmentSelection)
      })
    })
  }

  render () {
    const { groups, filteredGroups, filterTerm, onFilterTermChange, isManager } = this.props
    const { selected, selectedForManagment } = this.state
    return (
      <div className="bf-TeamTagsSelector">
        {groups.length > 8 ? <input value={filterTerm} placeholder="Search tags" onChange={onFilterTermChange} /> : null}
        <div className="bf-TeamTagsSelector-list">
          {filteredGroups.map(({ _id, name }) => {
            const isSelectedForManagment = isManager && selectedForManagment.includes(_id)
            const isSelected = selected.includes(_id) || isSelectedForManagment
            return (
              <TeamTagsSelectorTag
                key={_id}
                isManager={isManager}
                id={_id}
                name={name}
                isSelected={isSelected}
                isSelectedForManagment={isSelectedForManagment}
                onSelect={this.handleSelect}
                onManagmentSelect={this.handleManagmentSelect}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

class TeamTagsSelectorTag extends PureComponent {
  handleClick = (e) => {
    e.preventDefault()
    const { id, isSelected, onSelect } = this.props
    onSelect(id, isSelected)
  }

  handleManagerClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { id, isSelectedForManagment, onManagmentSelect } = this.props
    onManagmentSelect(id, isSelectedForManagment)
  }

  render () {
    const { name, isSelected, isSelectedForManagment, isManager } = this.props
    const className = classNames('bf-TeamTagsSelector-tag', {
      'is-active': isSelected && !isSelectedForManagment,
      'is-managementable': isSelectedForManagment
    })
    return (
      <div className={className} onClick={this.handleClick}>
        <FormCheck isSmall isChecked={isSelected} />
        <span className="bf-TeamTagsSelector-tag-name">{name}</span>
        {isSelectedForManagment ? <span className="bf-TeamTagsSelector-tag-suffix">({tn('tags-selector-manager-suffix')})</span> : null}
        {isManager && isSelected ? (
          <a onClick={this.handleManagerClick}>
            {isSelectedForManagment ? tn('tags-selector-manager-remove-manager-button') : tn('tags-selector-manager-make-manager-button')}
          </a>
        ) : null}
      </div>
    )
  }
}

export function TeamTagsFilterDecorator (WrappedComponent) {
  const filter = (groups, term) => groups.filter(group => group.name.toLowerCase().includes(term))

  class TeamTagsFilter extends PureComponent {
    constructor (props) {
      super(props)
      this.state = { filtered: props.groups, term: '', value: '' }
      this.handleTermChange = debounce(this.handleTermChange, 100)
    }

    handleChange = (e) => {
      e.preventDefault()
      const value = e.target.value
      this.setState({ value })
      this.handleTermChange(value)
    }

    handleTermChange (value) {
      const term = value.trim().toLowerCase()
      const filtered = filter(this.props.groups, term)
      this.setState({ term, filtered })
    }

    componentWillReceiveProps ({ groups }) {
      if (groups !== this.props.groups) {
        const { term } = this.state
        const filtered = filter(groups, term)
        this.setState({ filtered })
      }
    }

    render () {
      const { filtered, value } = this.state
      return React.createElement(WrappedComponent, {
        ...this.props,
        filteredGroups: filtered,
        filterTerm: value,
        onFilterTermChange: this.handleChange
      })
    }
  }

  TeamTagsFilter.WrappedComponent = WrappedComponent
  TeamTagsFilter.displayName = `TeamTagsFilterDecorator(${WrappedComponent.displayName || WrappedComponent.name})`

  return TeamTagsFilter
}

export const TeamTagsSelector = TeamTagsFilterDecorator(TeamTagsSelectorBase)
