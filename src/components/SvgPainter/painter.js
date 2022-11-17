import { deepClone } from '@/utils'
import { getElementNS, setAttrs } from './utils'
import { on, off } from '@/components/ImageViewer/utils'

class Painter {
  constructor(option) {
    this.config = {
      show: false,
      img: null,
      data: [],
      fill: 'contain',
      fontSize: 14,
      maxPadding: 5,
      imgLoaded: () => {},
      imgError: false
    }

    this.config = Object.assign(this.config, option)

    this.scale = 1 //  缩放比例
    this.width = 50 // 绘制区宽度
    this.height = 50 // 绘制区高度
    this.imgWidth = 1920 // 图片分辨率宽度
    this.imgHeight = 1080 // 图片分辨率高度
    this.offset = 0 // svg偏移量
    this.svgContainer = null // svgContainer

    this.behavior = 'view' // 目前行为  | view | draw |
    this.drawMultiple = false
    this.currentShape = null
    this.drawStart = {}
    this.drawShapes = []

    this.url = '' // 图片url

    this.clipImage = [] // canvas cilp的所有图片

    this.init()
  }

  init() {
    const url = this.config.img

    if (url === '') {
      this.error()
    } else {
      !url ? this.setSize() : this.isImg(url)
    }
  }

  isImg(url) {
    this.url = url

    const { imgLoaded } = this.config

    const image = new Image()
    image.src = url
    image.onload = () => {
      this.imgWidth = image.naturalWidth
      this.imgHeight = image.naturalHeight

      this.config.imgError = false

      this.setSize()

      imgLoaded && imgLoaded()
    }

    image.onerror = () => {
      this.error()
    }
  }

  error() {
    this.config.imgError = true
  }

  setSize() {
    if (!this.config.painter.nextElementSibling) return

    const boardAttr = window.getComputedStyle(this.config.painter.nextElementSibling, null)

    this.width = Number(boardAttr.width.replace('px', ''))
    this.height = Number(boardAttr.height.replace('px', ''))

    if (this.imgHeight) {
      this.scale = this.height / this.imgHeight
    }

    if (this.config.fill === 'cover') {
      this.offset = (this.imgWidth * this.scale - this.width) / 2
    }

    this.setSvgPainterStyle()
  }

  setSvgPainterStyle() {
    const container = this.config.container

    container.style.width = this.width ? (this.width + 'px') : 'auto'
    container.style.height = this.height ? (this.height + 'px') : 'auto'

    this.initSvgContainer()

    this.initSvg()
  }

  initSvgContainer() {
    const { painter } = this.config

    this.svgContainer = this.createSvgEl('svg')

    painter.innerHTML = ''
    painter.appendChild(this.svgContainer)

    if (this.config.model === 'viewer') {
      this.removeEvents()
    } else if (this.config.model === 'painter') {
      this.bindEvents()
    }
  }

  initSvg() {
    const { data } = this.config
    const { show } = this.config

    const dealData = this.dealData(data)

    dealData.forEach((deal, dealIndex) => {
      const { svgType, type, className } = deal

      let svgEl = null

      switch (type) {
        case 'rectAlarm':
          svgEl = this.drawRectAlarm(data[dealIndex], deal.rect, deal.text, deal.display && show)

          svgEl.some(el => className && el[0].setAttribute('class', className))
          break
        default:
          svgEl = this.drawSvg(data[dealIndex].type, deal[data[dealIndex].type], data[dealIndex].display)

          className && svgEl.setAttribute('class', className)

          svgType && svgType === 'drawData' && this.drawShapes.push({
            svgType: 'drawData',
            params: data[dealIndex][data[dealIndex].type],
            el: svgEl
          })
      }
    })
  }

  dealData(data) {
    const result = deepClone(data)

    const isOffset = this.config.fill === 'cover'

    result.forEach(svg => {
      const { type } = svg

      switch (type) {
        case 'rect': case 'rectAlarm':
          svg.rect.x = svg.rect.x * this.scale - (isOffset ? this.offset : 0)
          svg.rect.y *= this.scale
          svg.rect.width *= this.scale
          svg.rect.height *= this.scale
          svg.rect['stroke-width'] = this.config.fill === 'cover' ? 1 : svg.rect['stroke-width']
          break
        default:
      }
    })

    return result
  }

  createSvgEl(type, attrs) {
    const svgEl = getElementNS(type, attrs)

    return svgEl
  }

  drawSvg(type, attrs = {}, display = true) {
    let config = {
      class: 'svg-child-' + type
    }

    config = {
      ...config,
      ...attrs
    }

    const svgEl = this.createSvgEl(type, config)

    svgEl.style.display = display ? 'block' : 'none'

    this.svgContainer.appendChild(svgEl)

    return svgEl
  }

  drawRectAlarm(data = {}, rect = {}, text = {}, display = true) {
    const content = this.drawSvg('rect', rect, display)

    display && this.config.clip && this.getCilp(data)

    const textLength = text.value.length

    let textHeight = this.config.fontSize // 字体大小

    if (textLength * 14 > rect.width) {
      textHeight = rect.width / textLength

      if (textHeight <= 0) textHeight = 2
    }

    let padding = textHeight / 3

    if (padding >= this.config.maxPadding) padding = this.config.maxPadding

    const textRect = this.drawSvg(
      'rect',
      {
        x: rect.x,
        y: rect.y - textHeight - padding * 2,
        width: rect.width,
        height: textHeight + padding * 2,
        fill: rect.stroke,
        'stroke-width': rect['stroke-width'],
        stroke: rect.stroke
      },
      display
    )

    const textContent = this.drawSvg(
      'text',
      {
        x: rect.width / 2,
        y: (textHeight + padding * 2) / 2,
        fill: text.fill,
        'font-size': textHeight,
        dx: rect.x + 'px',
        dy: rect.y - textHeight - padding * 2 + 'px',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle'
      },
      display
    )

    textContent.innerHTML = text.value

    return [content, textRect, textContent]
  }

  getCilp(data, selfDeviation, format) {
    return new Promise(resolve => {
      if (this.width === 0 || this.height === 0 || !data.rect) {
        resolve(null)

        return
      }

      const deviation = selfDeviation || this.config.deviation || 0

      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = this.url + '?' + Date.now()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = this.imgWidth
        canvas.height = this.imgHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
        const cilpContent = ctx.getImageData(
          data.rect.x - data.rect.width * deviation,
          data.rect.y - data.rect.height * deviation,
          data.rect.width * (1 + 2 * deviation),
          data.rect.height * (1 + 2 * deviation)
        )

        const cilpCanvas = document.createElement('canvas')
        cilpCanvas.width = data.rect.width * Number(1 + 2 * deviation)
        cilpCanvas.height = data.rect.height * Number(1 + 2 * deviation)
        const cilpCtx = cilpCanvas.getContext('2d')
        cilpCtx.putImageData(cilpContent, 0, 0)

        const clipUrl = cilpCanvas.toDataURL(`image/${(format ?? 'png')}`, 1)

        this.clipImage.push({
          url: clipUrl,
          position: data.rect.x + '.' + data.rect.y + '-' + data.rect.width + '-' + data.rect.height,
          taskId: data.taskId
        })

        URL.revokeObjectURL(this.url)

        resolve(clipUrl)
      }

      image.error = () => {
        resolve(null)
      }
    })
  }

  mouseDown(e) {
    this.behavior = 'draw'

    const { drawOption } = this.config

    if (e.buttons === 1) {
      this.drawStart.x = e.offsetX
      this.drawStart.y = e.offsetY

      if (!this.currentShape) {
        const params = {
          x: e.offsetX / this.scale,
          y: e.offsetY / this.scale,
          width: 0,
          height: 0,
          ...drawOption
        }

        this.currentShape = {
          svgType: 'drawData',
          params: params,
          el: this.drawSvg(
            'rect',
            {
              x: e.offsetX,
              y: e.offsetY,
              width: 0,
              height: 0,
              ...drawOption
            },
            true
          )
        }
      }
    }
  }

  mouseMove(e) {
    if (this.behavior === 'view') return

    const { x, y } = this.drawStart

    if (e.buttons === 1) {
      !this.drawMultiple && this.clearDrawSvg()

      const draw = {
        x: e.offsetX > x ? x : e.offsetX,
        y: e.offsetY > y ? y : e.offsetY,
        width: Math.abs(e.offsetX - x),
        height: Math.abs(e.offsetY - y)
      }

      this.currentShape.params.x = draw.x / this.scale
      this.currentShape.params.y = draw.y / this.scale
      this.currentShape.params.width = draw.width / this.scale
      this.currentShape.params.height = draw.height / this.scale

      setAttrs(this.currentShape.el, draw)
    }
  }

  mouseUp(e) {
    this.behavior = 'view'

    if (e.button === 0) {
      const isSelf = this.currentShape.params.width === 0 && this.currentShape.params.height === 0

      if (!isSelf) {
        !this.drawMultiple && (this.drawShapes.length = 0)

        this.drawShapes.push(this.currentShape)
      }

      this.currentShape = null
    }
  }

  clearDrawSvg() {
    this.drawShapes.forEach(shape => {
      shape.el && this.svgContainer.removeChild(shape.el)
    })

    this.drawShapes.length = 0
  }

  bindEvents() {
    on(this.svgContainer, 'mousedown', this.mouseDown.bind(this))
    on(this.svgContainer, 'mousemove', this.mouseMove.bind(this))
    on(this.svgContainer, 'mouseup', this.mouseUp.bind(this))
  }

  removeEvents() {
    off(this.svgContainer, 'mousedown', this.mouseDown)
    off(this.svgContainer, 'mousemove', this.mouseMove)
    off(this.svgContainer, 'mouseup', this.mouseUp)
  }
}

export default Painter
