import React, { PropTypes, Component, PureComponent } from 'react'
import { moodColors } from '../MoodIcon'
import './index.css'

const borderColor = '#15656F'
const line = '#2CE6CE'
const transparent = 'transparent'
const getActiveAttributes = (percentage) => {
  if (percentage === 0) return [borderColor, 0, 0, transparent, transparent]
  else if (percentage >= 50) return [borderColor, 270, 90 + (3.6 * (percentage - 50)), line, transparent]
  return [line, 90 + (3.6 * percentage), 90, transparent, borderColor]
}

export class ChartCircle extends PureComponent {
  static propTypes = {
    isEmpty: PropTypes.bool.isRequired,
    value: PropTypes.number,
    isPercentage: PropTypes.bool,
    prefix: PropTypes.string
  }

  render () {
    const { isEmpty, isPercentage, value, prefix } = this.props
    const [bgColor, firstDegree, secondDegree, firstColor, secondColor] =
          getActiveAttributes(isPercentage ? value : Math.round(10 * value))
    const style = isEmpty ? {} : {
      backgroundColor: bgColor,
      backgroundImage: '' +
        `linear-gradient(${firstDegree}deg, ${firstColor} 50%, ${secondColor} 50%),` +
        `linear-gradient(${secondDegree}deg, ${secondColor} 50%, ${firstColor} 50%)`
    }
    return (
      <div className="bf-ChartCircle" style={style}>
        <div className="bf-ChartCircle-content">
          <div className="bf-ChartCircle-content-largeText">
            {isEmpty ? '-' : value}
            {isPercentage ? <span>%</span> : null}
          </div>
          <div className="bf-ChartCircle-content-text">{prefix}</div>
        </div>
      </div>
    )
  }
}

export class ChartMoodsCircle extends Component {
  static propTypes = {
    isEmpty: PropTypes.bool.isRequired,
    emptyText: PropTypes.string.isRequired,
    moods: PropTypes.array.isRequired
  }

  componentDidMount () {
    this.componentDidUpdate()
  }

  componentDidUpdate () {
    if (this.refs.canvas) {
      renderPieChart(this.refs.canvas, this.props.moods, moodColors)
    }
  }

  shouldComponentUpdate ({ moods }) {
    return this.props.moods.some((val, index) => val !== moods[index])
  }

  render () {
    const { isEmpty, emptyText } = this.props
    return isEmpty ? (
      <ChartCircle
        isEmpty
        prefix={emptyText}
      />
    ) : (
      <canvas className="bf-ChartMoodsCircle" ref="canvas" width="240" height="240" />
    )
  }
}

/**
 * Render simple pie-chart, based on
 * http://html5.litten.com/graphing-data-in-the-html5-canvas-element-part-iv-simple-pie-charts/
 *
 * @param {Array} replies
 * @param {Element} canvas
 */

function renderPieChart ($canvas, rawData, colors) {
  const total = rawData.reduce((memo, r) => { memo += r; return memo }, 0)
  const data = rawData.map((r) => r / total)
  const ctx = $canvas.getContext('2d')
  const halfWidth = $canvas.width / 2
  const halfHeight = $canvas.height / 2

  ctx.clearRect(0, 0, $canvas.width, $canvas.height)

  for (let i = 0, lastend = -Math.PI * 0.5, delta; i < data.length; i++) {
    delta = Math.PI * 2 * data[i]
    ctx.fillStyle = colors[i]
    ctx.beginPath()
    ctx.moveTo(halfWidth, halfHeight)
    ctx.arc(halfWidth, halfHeight, halfHeight, lastend, lastend + delta, false)
    ctx.lineTo(halfWidth, halfHeight)
    ctx.fill()
    lastend += delta
  }

  ctx.fill()
}
