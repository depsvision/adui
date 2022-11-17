import dayjs from 'dayjs'

class TimeLine {
  constructor(option) {
    this.config = {}

    const checkResult = this.checkOption(option)

    if (!checkResult) return

    this.dayContainer = null
    this.dayContainerStyle = {
      backgroundColor: this.config.dayBackgroundColor ?? 'rgba(245, 249, 255, 1)',
      padding: `0 ${(this.config.dayBackgroundPadding ?? 10)}px`
    }

    this.dayCanvas = null
    this.dayCtx = null
    this.dayCanvasWidth = 0
    this.dayCanvasHeight = 0
    this.dayBackground = {
      shape: this.config.dayBackgroundShape ?? 'round' // round or other
    }

    this.dayCanvasStyle = {}

    this.dayRecord = {
      lineHeight: this.config.dayRecordLineHeight ?? 2,
      lineColor: this.config.dayRecordlineColor ?? 'rgba(218, 227, 240, 1)',
      height: this.config.dayRecordHeight ?? 12,
      color: this.config.dayRecordColor ?? 'rgba(24, 114, 240, 1)',
      ratio: 0.15
    }

    this.dayAnimation = null
    this.dayAnimationTimer = this.config.dayAnimationTimer ?? 1
    this.dayAnimationEase = this.config.dayAnimationEase ?? 'easeInOutQuart'

    this.container = null
    this.containerStyle = {
      position: 'relative',
      display: 'flex',
      'justify-content': 'center'
    }

    this.canvas = null
    this.ctx = null
    this.canvasWidth = 0
    this.canvasHeight = 0
    this.canvasStyle = {
      'background-color': this.config.backgroundColor ?? 'rgba(14, 27, 46, .05)'
    }

    const allowValue = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]
    //  60 second / n pixel
    this.SecondPixelRatio = allowValue.includes(this.config.secondPixelRatio) ? this.config.secondPixelRatio : 1

    this.pointer = null
    this.pointerStyle = {
      position: 'absolute',
      top: 0,
      width: `1px`,
      height: 'calc(100% + 4px)',
      display: 'flex',
      'background-color': this.config.pointerColor ?? 'rgba(27, 53, 89, 1)'
    }

    this.pointBlock = {
      scope: this.config.pointBlockScope ?? 14.5,
      backgroundColor: this.config.pointBlockBackgroundColor ?? 'rgba(255, 58, 51, .1)'
    }

    this.timeFormat = this.config.timeFormat ?? 'YYYY/MM/DD'

    this.pointerTime = dayjs()

    this.leftBorderTime = null
    this.rightBorderTime = null

    this.startTime = null
    this.startPixel = 0

    this.incompletePixel = 0

    this.short = {
      height: this.config.shortHeight ?? 8,
      color: this.config.shortColor ?? 'rgba(200, 202, 204, 1)'
    }

    this.middle = {
      height: this.config.middleHeight ?? 12,
      color: this.config.middleColor ?? 'rgba(200, 202, 204, 1)'
    }

    this.long = {
      height: this.config.longHeight ?? 16,
      color: this.config.longColor ?? 'rgba(150, 151, 153, 1)'
    }

    this.zero = {
      height: this.long.height + (this.config.zeroBottom ?? 6),
      color: this.config.zeroColor ?? 'rgba(14, 27, 46, .65)',
      angle: this.config.zeroRadian ?? 60,
      fontSize: this.config.fontSize ?? 12,
      fontFamily: this.config.fontFamily ?? 'sans-serif',
      fontWeight: this.config.fontWeight ?? 600,
      format: this.config.zeroFormat ?? 'YYYY/MM/DD'
    }

    this.usedPixel = 0

    /*
      0: no
      1: keep leftDown
      2: keep rightDown
    */
    this.mouseStatus = 0

    this.mouseInfo = {
      x: 0,
      y: 0
    }

    this.support = 'onwheel' in document.createElement('div') ? 'wheel' // 各个厂商的高版本浏览器都支持"wheel"
      : document.onmousewheel !== undefined ? 'mousewheel' // Webkit 和 IE一定支持"mousewheel"
        : 'DOMMouseScroll' // 低版本firefox

    this.extent = (this.config.extent ?? 6) * this.SecondPixelRatio

    /*
      {
        start: unix,
        duration: s
      }
    */
    this.record = this.config.record ?? []
    this.recordConfig = {
      top: this.config.recordTop ?? 4,
      radius: this.config.recordRadius ?? 3,
      color: this.config.recordColor ?? 'rgba(156, 191, 240, 1)',
      ratio: 0.15
    }

    this.clock = {
      height: this.config.clockHeight ?? 16,
      color: 'rgba(75,76,77,0.1)'
    }
    this.clockAnimationFrame = null

    // event bind cache
    this.resize = null
    this.dayMouseClick = null
    this.mouseDown = null
    this.mouseUp = null
    this.mouseMove = null
    this.mouseEnter = null
    this.mouseLeave = null
    this.mouseScroll = null

    this.init()
  }

  checkOption(option) {
    let result = true

    if (option) {
      this.config = option
    } else {
      console.error('Creating TimeLine object requires passing parameters')

      result = false
    }

    return result
  }

  getPointerTimeInfo() {
    return {
      year: this.pointerTime.format('YYYY'),
      month: this.pointerTime.format('MM'),
      day: this.pointerTime.format('DD'),
      hour: this.pointerTime.format('HH'),
      minute: this.pointerTime.format('mm'),
      second: this.pointerTime.format('ss')
    }
  }

  async init() {
    this.initDayContainer()

    this.initContainer()

    this.setInitTime()

    await this.waitRendered()

    this.createDayCanvas()

    this.createCanvas()

    this.createPointer()

    this.setClockAnimation()

    this.pointerBlockDataCallback()

    this.bindCache()

    this.bindEvent()
  }

  initDayContainer() {
    this.dayContainer = this.config.dayContainer ?? document.createElement('div')
    this.setStyle(this.dayContainer, this.dayContainerStyle)
  }

  initContainer() {
    this.container = this.config.container ?? document.createElement('div')
    this.setStyle(this.container, this.containerStyle)
  }

  setInitTime() {
    // initTime unix
    const { initTime } = this.config

    if (initTime) {
      let initTimeCache = null

      if (initTime.isValid && initTime.isValid()) {
        initTimeCache = initTime
      } else {
        initTimeCache = dayjs.unix(initTime)

        if (!initTimeCache.isValid || !initTimeCache.isValid()) {
          console.error('time is not the correct timestamp')

          return
        }
      }

      this.pointerTime = initTime
    }
  }

  createDayCanvas() {
    this.dayCanvasWidth = this.dayContainer.getBoundingClientRect().width - 2 * (this.config.dayBackgroundPadding ?? 10)
    this.dayCanvasHeight = this.dayContainer.getBoundingClientRect().height

    this.dayCanvas = document.createElement('canvas')
    this.dayCtx = this.dayCanvas.getContext('2d')
    this.dayCanvas.width = this.dayCanvasWidth
    this.dayCanvas.height = this.dayCanvasHeight

    switch (this.dayBackground.shape) {
      case 'round':
        this.dayContainer.style['border-radius'] = `${this.dayCanvasHeight}px`
        break
      default:
        break
    }

    this.setStyle(this.dayCanvas, this.dayCanvasStyle)

    this.dayContainer.appendChild(this.dayCanvas)
  }

  createCanvas() {
    this.canvasWidth = this.container.getBoundingClientRect().width
    this.canvasHeight = this.container.getBoundingClientRect().height

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight

    this.setStyle(this.canvas, this.canvasStyle)

    this.container.appendChild(this.canvas)
  }

  createPointer() {
    this.pointer = document.createElement('div')

    this.setStyle(this.pointer, this.pointerStyle)

    this.container.appendChild(this.pointer)
  }

  setStyle(element, style) {
    const styleKeys = Object.keys(style)

    styleKeys.forEach(key => {
      element.style[key] = style[key]
    })
  }

  waitRendered(time) {
    const timeOut = time ?? 0

    return new Promise(resolve => {
    // wait canvas rendered
      setTimeout(() => {
        resolve(true)
      })
    }, timeOut)
  }

  setPointerAnimation(lastPixel, pixel, index, frame, ease) {
    const time = index / frame
    const easeY = ease(time)
    const easePixel = pixel * easeY
    const movePixel = easePixel - lastPixel

    this.setPointerTime(movePixel)

    this.dayAnimation = requestAnimationFrame(timestamp => {
      this.setPointerAnimation(easePixel, pixel, ++index, frame, ease)
    })

    if (time === 1) {
      this.disposeDayAnimation()

      this.setClockAnimation()

      this.pointerBlockDataCallback()
    }
  }

  setPointerTime(pixel) {
    this.clearCanvas()
    this.clearDayCanvas()

    const movePixel = pixel ?? 0
    const moveSecond = movePixel * 60 / this.SecondPixelRatio

    this.pointerTime = this.pointerTime.add(moveSecond, 's')

    this.pointerTimeCallback()

    this.drawPointerBlock()

    this.setStartTime()
  }

  drawDayMiddleLine() {
    this.drawFillRect(
      this.dayCtx,
      0,
      (this.dayCanvasHeight - this.dayRecord.lineHeight) / 2,
      this.dayCanvasWidth,
      this.dayRecord.lineHeight,
      this.dayRecord.lineColor
    )
  }

  drawDayPointer() {
    const poniterZeroTime = this.pointerTime.startOf('d')
    const startSecond = this.pointerTime.diff(poniterZeroTime, 's')

    const pixelSecondRatio = this.dayCanvasWidth / (24 * 3600)

    const startPixel = startSecond * pixelSecondRatio

    this.drawFillRect(
      this.dayCtx,
      startPixel,
      0,
      1,
      this.dayCanvasHeight,
      this.config.pointerColor ?? 'rgba(27, 53, 89, 1)'
    )
  }

  drawPointerBlock() {
    const pointerLeft = (this.canvasWidth - 1) / 2
    const blockX = pointerLeft - this.pointBlock.scope
    const blockWidth = this.pointBlock.scope * 2 + 1

    this.drawFillRect(this.ctx, blockX, 0, blockWidth, this.canvasHeight, this.pointBlock.backgroundColor)
  }

  setStartTime() {
    const halfWidthPixel = (this.canvasWidth - 1) / 2
    this.incompletePixel = halfWidthPixel % 1

    const halfSecond = Math.ceil(halfWidthPixel) * 60 / this.SecondPixelRatio

    const pointerTimeRemain = this.pointerTime.get('s') % (60 / this.SecondPixelRatio)
    const integerPointerTime = this.pointerTime.subtract(pointerTimeRemain, 's')
    this.leftBorderTime = integerPointerTime.subtract(halfSecond, 's')
    this.startTime = this.leftBorderTime.startOf('day')

    const canvasWidthSecond = this.canvasWidth * 60 / this.SecondPixelRatio
    this.rightBorderTime = this.leftBorderTime.add(canvasWidthSecond, 's')

    this.drawDayMiddleLine()

    this.record.forEach(record => {
      const start = dayjs.unix(record.start)

      if (!start.isValid || !start.isValid()) {
        console.error(`${record.start} is not the correct timestamp`)
      } else {
        const duration = record.duration ?? 1
        const end = start.add(duration, 's')

        this.drawDayRecord(start, end, duration)

        this.drawRecord(start, end, duration)
      }
    })

    this.drawDayPointer()

    this.drawTickMarks()

    this.drawClockRect()
  }

  pixelToTime(pixel) {
    const addSecond = (pixel - this.startPixel) * 60 / this.SecondPixelRatio

    return this.startTime.add(addSecond, 's')
  }

  timeToPixel(time) {
    const timeDuration = time.diff(this.leftBorderTime, 's')

    return timeDuration * this.SecondPixelRatio / 60
  }

  setClockAnimation() {
    this.setPointerTime()

    this.disposeClockAnimation()

    const timer = (60 / this.SecondPixelRatio) * 1000
    this.clockAnimationFrame = setInterval(() => {
      this.setPointerTime()
    }, timer)
  }

  drawClockRect() {
    const now = dayjs()
    const clockWidth = this.timeToPixel(now)
    this.drawFillRect(this.ctx, 0, this.canvasHeight - this.clock.height, clockWidth, this.clock.height, this.clock.color)
  }

  drawRecord(start, end) {
    const startPixel = this.timeToPixel(start)
    const endPixel = this.timeToPixel(end)
    const durationPixel = endPixel - startPixel

    const minWidth = 6 * 60 / (60 / this.SecondPixelRatio)

    const circleCenterX = startPixel + 3
    const circleCenterY = this.recordConfig.top + 3

    if (durationPixel <= minWidth) {
      this.drawFillArc(this.ctx, circleCenterX, circleCenterY, this.recordConfig.radius, this.recordConfig.color)
    } else {
      this.drawRoundRect(
        this.ctx,
        circleCenterX,
        this.recordConfig.top,
        durationPixel,
        2 * this.recordConfig.radius,
        this.recordConfig.color,
        this.recordConfig.ratio
      )
    }
  }

  drawDayRecord(start, end) {
    const poniterZeroTime = this.pointerTime.startOf('d')
    const startSecond = start.diff(poniterZeroTime, 's')
    const endSecond = end.diff(poniterZeroTime, 's')

    const pixelSecondRatio = this.dayCanvasWidth / (24 * 3600)

    const startPixel = startSecond * pixelSecondRatio
    const endPixel = endSecond * pixelSecondRatio
    const recordWidth = endPixel - startPixel

    this.drawRoundRect(
      this.dayCtx,
      startPixel,
      (this.dayCanvasHeight - this.dayRecord.height) / 2,
      recordWidth,
      this.dayRecord.height,
      this.dayRecord.color,
      this.dayRecord.ratio
    )
  }

  drawTickMarks() {
    const startDiff = this.leftBorderTime.diff(this.startTime, 's')
    this.startPixel = (0 - this.incompletePixel) - startDiff / (60 / this.SecondPixelRatio)

    this.usedPixel = 6 * this.SecondPixelRatio - 1
    this.drawLoopTickMarks()
  }

  drawLoopTickMarks() {
    let startIndex = 1

    while (this.startPixel + this.usedPixel <= this.canvasWidth) {
      const loopIndex = startIndex % 10

      const lineWidth = 1

      const rectX = this.startPixel + this.usedPixel
      if (loopIndex === 0) {
        this.drawFillRect(this.ctx, rectX, this.canvasHeight - this.long.height, lineWidth, this.long.height, this.long.color)

        const tickMarkTime = this.pixelToTime(rectX)

        const isRightHour = tickMarkTime.get('h') === 23
        const isRightMinute = tickMarkTime.get('m') === 59
        const isRightSecond = tickMarkTime.get('s') === 60 - 60 / this.SecondPixelRatio
        if (isRightHour && isRightMinute && isRightSecond) {
          this.drawDayZeroTime(rectX, tickMarkTime)
        }
      } else if (loopIndex === 5) {
        this.drawFillRect(this.ctx, rectX, this.canvasHeight - this.middle.height, lineWidth, this.middle.height, this.middle.color)
      } else {
        this.drawFillRect(this.ctx, rectX, this.canvasHeight - this.short.height, lineWidth, this.short.height, this.short.color)
      }

      startIndex++

      this.usedPixel += 6 * this.SecondPixelRatio
    }
  }

  drawFillRect(ctx, x, y, width, height, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    ctx.closePath()
  }

  drawFillArc(ctx, x, y, r, color) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  }

  drawRoundRect(ctx, x, y, width, height, color, ratio) {
    const r = width >= height ? (ratio ?? 0.5) * height : (ratio ?? 0.5) * width

    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + width, y, x + width, y + height, r)
    ctx.arcTo(x + width, y + height, x, y + height, r)
    ctx.arcTo(x, y + height, x, y, r)
    ctx.arcTo(x, y, x + width, y, r)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  }

  drawDayZeroTime(beginX, time) {
    const triangleHeight = this.zero.fontSize - 4
    const halfBottomEdge = triangleHeight * Math.tan((this.zero.angle / 2) * (Math.PI / 180))

    // triangle
    this.ctx.beginPath()
    this.ctx.moveTo(beginX + 0.5, this.canvasHeight - this.zero.height)
    this.ctx.lineTo(beginX + 0.5 + halfBottomEdge, this.canvasHeight - (this.zero.height + triangleHeight))
    this.ctx.lineTo(beginX + 0.5 - halfBottomEdge, this.canvasHeight - (this.zero.height + triangleHeight))
    this.ctx.fillStyle = this.zero.color
    this.ctx.fill()

    // font
    const fontX = beginX + 0.5 + halfBottomEdge + 4
    const fontY = this.canvasHeight - (this.zero.height)

    this.ctx.font = `normal ${this.zero.fontWeight} ${this.zero.fontSize}px Unknown ${this.zero.fontFamily}`

    this.ctx.fillText(time.add(1, 'm').format(this.zero.format), fontX, fontY)
  }

  bindCache() {
    this.resize = this.resizeEvent.bind(this)

    this.dayMouseClick = this.dayMouseClickEvent.bind(this)

    this.mouseDown = this.mouseDownEvent.bind(this)
    this.mouseUp = this.mouseUpEvent.bind(this)
    this.mouseMove = this.mouseMoveEvent.bind(this)

    this.mouseEnter = this.mouseEnterEvent.bind(this)
    this.mouseLeave = this.mouseLeaveEvent.bind(this)

    this.mouseScroll = this.mouseScrollEvent.bind(this)
  }

  bindEvent() {
    window.addEventListener('resize', this.resize)

    this.dayCanvas.addEventListener('click', this.dayMouseClick)

    this.canvas.addEventListener('mousedown', this.mouseDown)
    this.canvas.addEventListener('mouseup', this.mouseUp)
    this.canvas.addEventListener('mousemove', this.mouseMove)

    this.container.addEventListener('mouseenter', this.mouseEnter, false)
    this.container.addEventListener('mouseleave', this.mouseLeave, false)

    this.canvas.addEventListener(this.support, this.mouseScroll, false)
  }

  unBindEvent() {
    window.removeEventListener('resize', this.resize)

    this.dayCanvas.removeEventListener('click', this.dayMouseClick)

    this.canvas.removeEventListener('mousedown', this.mouseDown)
    this.canvas.removeEventListener('mouseup', this.mouseUp)
    this.canvas.removeEventListener('mousemove', this.mouseMove)

    this.container.removeEventListener('mouseenter', this.mouseEnter)
    this.container.removeEventListener('mouseleave', this.mouseLeave)

    this.canvas.removeEventListener(this.support, this.mouseScroll)
  }

  jumpTime(time) {
    let endTime = null

    if (time.isValid && time.isValid()) {
      endTime = time
    } else {
      endTime = dayjs.unix(time)

      if (!endTime.isValid || !endTime.isValid()) {
        console.error('time is not the correct timestamp')

        return
      }
    }

    this.disposeDayAnimation()
    this.disposeClockAnimation()

    const duration = endTime.diff(this.pointerTime, 's')
    const movePixel = duration / (60 / this.SecondPixelRatio)

    const timer = this.dayAnimationTimer
    const frame = timer * 60
    const ease = this[this.dayAnimationEase]
    this.setPointerAnimation(0, movePixel, 0, frame, ease)
  }

  easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
  }

  async resizeEvent() {
    this.resetDayCanvasWidthHeight()
    this.resetCanvasWidthHeight()

    await this.waitRendered

    this.setClockAnimation()

    this.pointerBlockDataCallback()
  }

  dayMouseClickEvent(evt) {
    this.disposeDayAnimation()
    this.disposeClockAnimation()

    const poniterZeroTime = this.pointerTime.startOf('d')
    const pixelSecondRatio = this.dayCanvasWidth / (24 * 3600)

    const moveEndSecond = evt.offsetX / pixelSecondRatio
    const moveEndTime = poniterZeroTime.add(moveEndSecond, 's')

    const duration = moveEndTime.diff(this.pointerTime, 's')
    const movePixel = duration / (60 / this.SecondPixelRatio)

    const timer = this.dayAnimationTimer
    const frame = timer * 60
    const ease = this[this.dayAnimationEase]
    this.setPointerAnimation(0, movePixel, 0, frame, ease)
  }

  mouseDownEvent(evt) {
    this.disposeDayAnimation()
    this.disposeClockAnimation()

    this.mouseStatus = evt.buttons

    if (this.mouseStatus === 1) {
      this.mouseInfo.x = evt.offsetX
      this.mouseInfo.y = evt.offsetY
    }
  }

  mouseUpEvent(evt) {
    this.mouseStatus = 0

    this.setClockAnimation()
  }

  mouseMoveEvent(evt) {
    if (this.mouseStatus !== 1) return

    this.disposeClockAnimation()

    const moveX = this.mouseInfo.x - evt.offsetX

    this.setPointerTime(moveX)

    this.mouseInfo.x = evt.offsetX
    this.mouseInfo.y = evt.offsetY

    this.pointerBlockDataCallback()
  }

  mouseEnterEvent(evt) {
    this.mouseStatus = evt.buttons

    if (this.mouseStatus === 1) {
      this.disposeClockAnimation()
    }
  }

  mouseLeaveEvent(evt) {
    this.mouseStatus = 0

    this.setClockAnimation()
  }

  mouseScrollEvent(evt) {
    const detail = evt.wheelDelta || evt.detail || evt.wheelDeltaY

    // 定义滚动方向
    const moveForward = 1
    const moveBack = -1

    // 定义滚动幅度
    const extent = this.extent

    // 定义滚动距离
    let step = 0

    if (detail < 0) {
      step = moveForward * extent
    } else {
      step = moveBack * extent
    }

    this.setPointerTime(step)

    this.pointerBlockDataCallback()
  }

  pointerTimeCallback() {
    const { pointerTimeCallback } = this.config

    if (pointerTimeCallback) {
      pointerTimeCallback(this.pointerTime)
    }
  }

  pointerBlockDataCallback() {
    const { pointerBlockDataCallback } = this.config

    if (pointerBlockDataCallback) {
      const pointerLeft = (this.canvasWidth - 1) / 2
      const blockStart = pointerLeft - this.pointBlock.scope
      const blockEnd = blockStart + this.pointBlock.scope * 2
      const startTime = this.pixelToTime(blockStart)
      const endTime = this.pixelToTime(blockEnd)

      const returnVideoList = this.record.filter(item => {
        const start = dayjs.unix(item.start)

        if (!start.isValid || !start.isValid()) {
          console.error(`${item.start} is not the correct timestamp`)

          return false
        } else {
          const duration = item.duration ?? 1
          const end = start.add(duration, 's')

          const isBorderOverlap = start.isSame(startTime) || start.isSame(endTime) || end.isSame(startTime) || end.isSame(endTime)
          const isStartInScope = start.isAfter(startTime) && start.isBefore(endTime)
          const isEndInScope = end.isAfter(startTime) && end.isBefore(endTime)
          const isScopeCoverDuration = startTime.isAfter(start) && endTime.isBefore(end)

          return isBorderOverlap || isStartInScope || isEndInScope || isScopeCoverDuration
        }
      })

      pointerBlockDataCallback(returnVideoList)
    }
  }

  async resetDayCanvasWidthHeight() {
    this.dayCanvas.width = 0
    this.dayCanvas.height = 0

    await this.waitRendered

    this.dayCanvasWidth = this.dayContainer.getBoundingClientRect().width - 2 * (this.config.dayBackgroundPadding ?? 10)
    this.dayCanvasHeight = this.dayContainer.getBoundingClientRect().height

    this.dayCanvas.width = this.dayCanvasWidth
    this.dayCanvas.height = this.dayCanvasHeight
  }

  async resetCanvasWidthHeight() {
    this.canvas.width = 0
    this.canvas.height = 0

    await this.waitRendered

    this.canvasWidth = this.container.getBoundingClientRect().width
    this.canvasHeight = this.container.getBoundingClientRect().height

    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
  }

  clearDayContainer() {
    this.dayContainer.innerHTML = ''
  }

  clearContainer() {
    this.container.innerHTML = ''
  }

  clearDayCanvas() {
    this.dayCtx.clearRect(0, 0, this.dayCanvasWidth, this.dayCanvasHeight)
  }

  clearCanvas() {
    this.usedPixel = 0

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  disposeDayAnimation() {
    if (this.dayAnimation) {
      cancelAnimationFrame(this.dayAnimation)
      this.dayAnimation = null
    }
  }

  disposeClockAnimation() {
    if (this.clockAnimationFrame) {
      clearInterval(this.clockAnimationFrame)
      this.clockAnimationFrame = null
    }
  }

  dispose() {
    this.unBindEvent()
    this.disposeDayAnimation()
    this.disposeClockAnimation()

    if (this.dayContainer) {
      this.clearDayContainer()

      this.dayContainer = null
    }

    if (this.dayCanvas) {
      this.dayCanvas = null
    }

    if (this.dayPointer) {
      this.dayPointer = null
    }

    if (this.container) {
      this.clearContainer()

      this.container = null
    }

    if (this.canvas) {
      this.canvas = null
    }

    if (this.pointer) {
      this.pointer = null
    }
  }
}

export default TimeLine
