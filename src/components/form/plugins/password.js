import textForm from './text'

export default function passwordForm (selector, opts) {
  return (form) => {
    const password = textForm(selector, opts)(form)
    password.getValue = () => password.$el.value
    return password
  }
}
