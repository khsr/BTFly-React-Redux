import React, { PureComponent } from 'react'
import { debounce } from 'lodash'
import { namespace } from '../../../../../../utils/locales'
import './index.css'
const tn = namespace('dashboard.teams')

export class TeamTagsHeaderSearch extends PureComponent {
  constructor (props) {
    super(props)
    this.onSearch = debounce(props.onSearch, 200)
    this.state = { value: props.value }
  }

  handleSearchInput = (e) => {
    const value = e.target.value
    this.setState({ value })
    this.onSearch(value)
  }

  componentWillReceiveProps ({ value }) {
    this.setState({ value })
  }

  render () {
    const { value } = this.state
    return (
      <div className="bf-TeamTagsHeaderSearch">
        <input
          value={value}
          placeholder={tn('tags-header-search')}
          onChange={this.handleSearchInput}
        />
      </div>
    )
  }
}
