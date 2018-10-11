import Textarea from 'react-textarea-autosize'

export class FormTextareaAutosize extends Textarea {
  getRef () {
    return this._rootDOMNode
  }

  componentDidMount () {
    super.componentDidMount()
    this._rootDOMNode.addEventListener('keydown', this.handleSubmitHotkey.bind(this), false)
  }

  handleSubmitHotkey (e) {
    if (e.keyCode !== 13 || e.shiftKey || !this.props.onSubmit) return
    this.props.onSubmit(e)
  }
}
