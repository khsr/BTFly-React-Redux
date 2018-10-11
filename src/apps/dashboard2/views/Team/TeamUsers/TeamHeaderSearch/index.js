import React, { PureComponent } from 'react'
import { debounce } from 'lodash'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.teams')

const options = ['all', 'admins', 'managers', 'users', 'no-tags', 'latest-upload']
.map(key => ({ key, name: tn(`header-filter-${key}`) }))

export class TeamHeaderSearch extends PureComponent {
  constructor (props) {
    super(props)
    this.onSearch = debounce(props.onSearch, 200)
    this.state = { searchTerm: props.searchTerm }
  }

  onSearchInput = (e) => {
    const searchTerm = e.target.value
    this.setState({ searchTerm })
    this.onSearch(searchTerm)
  }

  onSearchFilter = (e) => {
    e.preventDefault()
    this.props.onSearchFilter(e.target.value)
  }

  componentWillReceiveProps ({ searchTerm }) {
    this.setState({ searchTerm })
  }

  render () {
    const { searchFilter } = this.props
    const { searchTerm } = this.state
    return (
      <div className="bf-TeamHeaderSearch">
        <input
          value={searchTerm}
          placeholder={tn('header-search')}
          onChange={this.onSearchInput}
        />
        <select value={searchFilter} onChange={this.onSearchFilter}>
          {options.map(({ key, name }) => <option key={key} value={key}>{name}</option>)}
        </select>
      </div>
    )
  }
}
