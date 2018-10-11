import React, { Component } from 'react'

export function MoodNotesZoomDecorator (WrappedComponent) {
  class Zoom extends Component {
    handleZoomLeft = () => {
      const { boxesIds, boxId, onBoxChange } = this.props
      const boxIdIndex = boxesIds.indexOf(boxId)
      if (boxIdIndex <= 0) return
      onBoxChange(boxesIds[boxIdIndex - 1])
    }

    handleZoomRight = () => {
      const { boxesIds, boxId, onBoxChange } = this.props
      const boxIdIndex = boxesIds.indexOf(boxId)
      if (boxIdIndex >= boxesIds.length - 1) return
      onBoxChange(boxesIds[boxIdIndex + 1])
    }

    render () {
      const { boxId, boxesIds } = this.props
      const boxIdIndex = boxesIds.indexOf(boxId)
      const isZoomLeftAvailable = boxIdIndex >= 1
      const isZoomRightAvailable = boxIdIndex < boxesIds.length - 1

      return React.createElement(WrappedComponent, {
        ...this.props,
        key: boxId,
        boxId,
        isZoomLeftAvailable,
        isZoomRightAvailable,
        onZoomLeft: this.handleZoomLeft,
        onZoomRight: this.handleZoomRight
      })
    }
  }
  Zoom.WrappedComponent = WrappedComponent
  Zoom.displayName = `ZoomDecorator(${WrappedComponent.displayName || WrappedComponent.name})`

  return Zoom
}
