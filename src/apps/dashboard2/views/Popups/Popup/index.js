import React from 'react'
import { LogoWithText } from '../../../components/Logo'
import { ModalBackdrop } from '../../../components/Modal'
import './index.css'

export const Popup = ({ children, isLogo, imgSrc }) => {
  return (
    <ModalBackdrop isDark>
      <div className="bf-Popup">
        {isLogo ? <LogoWithText /> : null}
        {imgSrc ? <img className="bf-Popup-imgLogo" src={imgSrc} /> : null}
        {children}
      </div>
    </ModalBackdrop>
  )
}

export const PopupTitle = ({ title, subTitle }) => {
  return (
    <div className="bf-Popup-title">
      {title}
      {subTitle ? <div className="bf-Popup-title-subTitle">{subTitle}</div> : null}
    </div>
  )
}

export const PopupMessage = ({ text }) => {
  return (
    <div className="bf-Popup-message">{text}</div>
  )
}

export const PopupClose = ({ text, onClick }) => {
  return (
    <a href="#" className="bf-Popup-close" onClick={onClick}>{text}</a>
  )
}
