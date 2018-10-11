import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Icon } from '../Icon'
import iconDropdown from './iconDropdown.svg?react'
import './index.css'

export class Dropdown extends Component {
  constructor () {
    super()
    this.state = { isOpen: false }
    this.toggleDropdown = makeDropdownToggler(this)
  }

  componentWillUnmount () {
    this.toggleDropdown(true)
  }

  render () {
    const { isOpen } = this.state
    const items = this.props.items.filter((item) => !item.isHidden)
    return (
      <div>
        <button type="button" className={`bf-Dropdown${isOpen ? ' is-open' : ''}`} onClick={this.toggleDropdown}>
          <Icon icon={iconDropdown} />
        </button>
        <DropdownMenu isOpen={isOpen} marginBottom="1rem" onClick={this.toggleDropdown}>
          {items.map(({ type, isDisabled, icon, text, onClick }, index) => {
            if (type === 'separator') return <DropdownSeparator key={index} />
            return (
              <DropdownItem
                key={index}
                onClick={onClick}
                text={text}
                icon={icon}
                isDisabled={isDisabled}
              />
            )
          })}
        </DropdownMenu>
      </div>
    )
  }
}

export class DropdownMenu extends Component {
  componentDidUpdate () {
    const { $menu } = this.refs
    $menu.style.marginBottom = `calc(-${$menu.clientHeight}px - ${this.props.marginBottom || 0})`
  }

  render () {
    const { children, isOpen, isWhite, onClick } = this.props
    return (
      <ul
        ref="$menu"
        className={`bf-DropdownMenu${isOpen ? ' is-open' : ''}${isWhite ? ' is-white' : ''}`}
        onClick={onClick}
      >
        {children}
      </ul>
    )
  }
}

export const DropdownItem = ({ text, icon, isDisabled, isDefaultColor, isActive, onClick }) => {
  if (icon === 'no-icon') icon = <span className="bf-DropdownItem-noIcon">-</span>
  const clickHandler = (e) => {
    e.preventDefault()
    if (isDisabled || isActive) e.stopPropagation()
    else onClick()
  }
  const href = isDisabled || isActive ? {} : { href: '#' }
  return (
    <li className="bf-DropdownItem">
      <a {...href} className={`${isActive ? 'is-active' : ''}${isDefaultColor ? ' is-defaultColor' : ''}`} disabled={isDisabled} onClick={clickHandler}>
        {icon}
        <span>{text}</span>
      </a>
    </li>
  )
}

export const DropdownSeparator = () => (
  <li className="bf-DropdownSeparator">
    <span />
  </li>
)

export function makeDropdownToggler (component) {
  const handleClick = (e) => {
    if (ReactDOM.findDOMNode(component).contains(e.target)) return
    component.setState({ isOpen: false })
  }
  // TODO: refactor code bellow
  return (forceClose) => {
    const isOpen = forceClose === true ? false : !component.state.isOpen
    if (forceClose !== true) component.setState({ isOpen })
    if (isOpen) {
      document.addEventListener('click', handleClick)
      document.addEventListener('touchstart', handleClick)
    } else {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }
}
