import React from 'react'
import AppContainerDevelopmentBase from 'react-hot-loader/lib/AppContainer.dev'
import Redbox from 'redbox-react'

export default class AppContainerDevelopment extends AppContainerDevelopmentBase {
  render () {
    const { error } = this.state
    if (error) {
      console.error(error.message, error.stack)
      return <Redbox error={error} />
    }

    if (this.props.component) {
      return <this.props.component {...this.props.props} />
    }

    return React.Children.only(this.props.children)
  }
}
