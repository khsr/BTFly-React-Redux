import React from 'react'
import { IconCancel } from '../Icon'
import './index.css'

export const IconFilter = ({ currentValues, values, icons, onSelect, onCancel, isLeft, isDark, noIconColors }) => {
  const isFiltered = currentValues.length
  const makeSelect = (value) => () => onSelect(value)
  return (
    <div className={`bf-IconFilter${isFiltered ? ' is-filtered' : ''}${isDark ? ' is-dark' : ''}`}>
      {isFiltered && isLeft ? <CancelButton onCancel={onCancel} /> : null}
      {values.map((value, valueIndex) => {
        const isSelected = currentValues.includes(value)
        const icon = icons[valueIndex]
        const mod = `${noIconColors ? ' is-noColors' : ''}${isSelected ? ' is-selected' : ''}${isDark ? ' is-dark' : ''}`
        return (
          <button
            key={valueIndex}
            type="button"
            className={`bf-IconFilter-icon${mod}`}
            onClick={makeSelect(value)}
          >
            {icon}
          </button>
        )
      })}
      {isFiltered && !isLeft ? <CancelButton onCancel={onCancel} /> : null}
    </div>
  )
}

const CancelButton = ({ onCancel }) => {
  return (
    <button type="button" className="bf-IconFilter-cancel" onClick={onCancel}>
      <IconCancel />
    </button>
  )
}
