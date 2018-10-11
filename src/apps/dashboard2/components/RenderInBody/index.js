import { Component } from 'react'
import ReactDOM from 'react-dom'

export class RenderInBody extends Component {
  componentDidMount () {
    this.wrapper = document.createElement('div')
    document.body.appendChild(this.wrapper)
    this.renderLayer()
  }

  componentDidUpdate () {
    this.renderLayer()
  }

  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this.wrapper)
    document.body.removeChild(this.wrapper)
  }

  renderLayer () {
    // Render with context transferring
    ReactDOM.unstable_renderSubtreeIntoContainer(this, this.props.children, this.wrapper)
  }

  render () { return null }
}
