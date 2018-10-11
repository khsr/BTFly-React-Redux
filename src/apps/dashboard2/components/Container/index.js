import React from 'react'
import { Icon } from '../Icon'
import './index.css'

export const Container = ({ children }) => (
  <div className="bf-Container">
    {children}
  </div>
)

export const ContainerHeader = ({ children }) => (
  <div className="bf-ContainerHeader">
    {children}
  </div>
)

export const ContainerHeaderWithIcon = ({ text, icon, children }) => (
  <div className="bf-ContainerHeaderWithIcon">
    {text}
    {children}
    {typeof icon === 'string' ? <Icon icon={icon} /> : icon}
  </div>
)

export const ContainerBody = ({ children }) => (
  <div className="bf-ContainerBody">
    {children}
  </div>
)

export const ContainerBodyWithPadding = ({ children }) => (
  <div className="bf-ContainerBodyWithPadding">
    {children}
  </div>
)
