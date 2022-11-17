/*
 * @Descripttion:
 * @version:
 * @Author: Jianyong Wang
 * @Date: 2021-05-08 11:55:24
 * @LastEditors: Jianyong Wang
 * @LastEditTime: 2021-06-17 12:11:47
 */
import { merge, makeElementNS, getSiblings, addHandle, removeHandle, deepClone } from './util'

class LabelImg {
  constructor(opt) {
    this.config = {
      el: document.querySelector('.lbi-paint-container'),
      shape: 'polygon',
      shapeIcon: {
        point: '',
        polyline: '',
        rect: '',
        polygon: ''
      },
      showMask: false,
      maskInfo: {
        x: 0.25,
        y: 0.25,
        w: 0.25,
        h: 0.25,
        color: 'rgba(248, 47, 7, 0.3)'
      },
      labelInfo: [{ names: '', labels: [] }],
      isGroup: false,
      groupList: ['任意对象', '对象'],
      initData: [],
      drawColor: 'red',
      pointSize: 4,
      lineSize: 2,
      w: 880,
      h: 550,
      type: 'draw', //  类型  draw -- 绘制状态  drag底图拖拽状态
      isLock: false, // 整个画布是否锁定状态
      isMouseWheel: true,
      imgOnloadCb: () => {},
      imgOnErr: () => {},
      drawEnd: (type, points) => {
        console.log('drawEnd ' + type + '：', points, 'output data：', this.outputData)
      }
    }

    this.config = merge(this.config, opt)

    this.x = 0
    this.y = 0
    this.styleTop = 0
    this.styleLeft = 0
    this.rectMinWidth = 4 //  绘制矩形最小宽度 小于这个值删除
    this.rectMinHeight = 4 //  绘制矩形最小高度 小于这个值删除
    this.curShape = {
      shape: '',
      els: [],
      points: []
    } //  当前绘制元素相关信息
    this.isDrawEnd = true //  是否正在绘制矩形
    // this.kx = 1
    // this.ky = 1
    this.scale = 1 //  缩放比例
    this.isBindEvent = false //  是否绑定事件
    this.imgWidth = 0 //  图片当前宽度
    this.imgHeight = 0 //  图片当前高度
    this.viewWidth = 0 //  图片加载完成 画布宽度
    this.viewHeight = 0 //  图片加载完成 画布高度
    this.isLoaded = false //  底图是否加载完成
    this.isDrag = false //  当前是否可以拖拽底图
    // this.color_active = '#ff0000'; // 当前标注所使用的颜色
    this.outputData = []
    this.labelsConfig = {
      stack: []
    }

    this.init()
  }

  init() {
    const url = this.config.url

    if (!url) return

    this.loadStyle()
    this.renderUI()

    this.addImg(this.config.url)
  }

  addImg(src) {
    const { el, w, h, imgOnloadCb, imgModel, showMask, maskInfo } = this.config
    const img = el.querySelector('.lbi-img')
    const svg = el.querySelector('.lbi-svg')
    this.isLoaded = false

    img.src = src + '?' + (+new Date())

    img.onload = () => {
      //  console.log('img onload')
      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight

      const { width, height } = this.getImgSize(w, h, imgWidth, imgHeight, imgModel)
      this.viewWidth = width
      this.viewHeight = height
      const left = (w - width) / 2
      const top = (h - height) / 2

      svg.setAttribute('viewBox', '0, 0, ' + width + ', ' + height)
      this.changeStyle(width, height, top, left)

      //  添加蒙层
      if (showMask) {
        this.deleteMask(svg)
        this.createSvgMask(svg, maskInfo.x, maskInfo.y, maskInfo.w, maskInfo.h, maskInfo.color)
      }

      imgOnloadCb && imgOnloadCb()
      this.isLoaded = true

      if (this.isBindEvent) return

      //  初始化图形
      this.initShape(svg, this.config.initData, width, height)
      this.config.initData = []

      if (this.config.isLock) return

      this.bindEvent()
    }

    img.onerror = () => {
      imgOnloadCb && imgOnloadCb()
    }
  }

  //  添加蒙层
  createSvgMask = (svg, x, y, w, h, color = 'rgba(248, 47, 7, 0.3)') => {
    const rect = makeElementNS('rect', {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      stroke: 'none',
      fill: color,
      mask: 'url(#svgMask)'
    })

    rect.id = 'rect-mask'

    const defsEl = makeElementNS('defs', {})
    defsEl.id = 'defs-mask'
    const maskEl = makeElementNS('mask', {
      id: 'svgMask'
    })
    const maskRect = makeElementNS('rect', {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      stroke: 'none',
      fill: '#fff'
    })
    const rectHollowOut = makeElementNS('rect', {
      x: x * 100 + '%',
      y: y * 100 + '%',
      width: w * 100 + '%',
      height: h * 100 + '%',
      fill: 'red'
    })

    maskEl.appendChild(maskRect)
    maskEl.appendChild(rectHollowOut)

    svg.appendChild(rect)
    defsEl.appendChild(maskEl)
    svg.appendChild(defsEl)
  }

  //  删除蒙层
  deleteMask = (parent) => {
    const rectEl = parent.querySelector('#rect-mask')
    const defsEl = parent.querySelector('#defs-mask')

    rectEl && parent.removeChild(rectEl)
    defsEl && parent.removeChild(defsEl)
  }

  getImgSize(maxWidth, maxHeight, imgWidth, imgHeight, type) {
    const scale = maxWidth / maxHeight
    const imgScale = imgWidth / imgHeight
    let width
    let height

    if (type !== 'cover') {
      if (imgScale >= scale) {
        width = maxWidth
        height = width * (imgHeight / imgWidth)
      } else {
        height = maxHeight
        width = height * imgScale
      }
    } else {
      if (imgScale >= scale) {
        height = maxHeight
        width = height * imgScale
      } else {
        width = maxWidth
        height = width * (imgHeight / imgWidth)
      }
    }

    return {
      width,
      height
    }
  }

  //  放大或缩小 计算样式
  setScale(scale, centralPoint) {
    if (this.config.isLock) return

    const { el } = this.config
    const scaleNum = scale / this.scale
    const imgLastWidth = this.imgWidth
    const imgLastHeight = this.imgHeight
    const w = this.imgWidth * scaleNum
    const h = this.imgHeight * scaleNum

    const box = el.getBoundingClientRect()
    const boxLeft = box.left
    const boxTop = box.top

    centralPoint = centralPoint || {
      x: boxLeft + this.config.w / 2,
      y: boxTop + this.config.h / 2
    }

    const { top, left } = this.scaleCalculationImgPos(centralPoint, scaleNum, w, h, imgLastWidth, imgLastHeight, scale)

    this.changeStyle(w, h, top, left)
    this.scale = scale
  }

  //  放大缩小设置图片坐标
  scaleCalculationImgPos(centralPoint, scaleNum, imgCurWidth, imgCurHeight, imgLastWidth, imgLastHeight, scale) {
    const { el, w, h } = this.config
    const img = el.querySelector('.lbi-img')

    const { x, y } = centralPoint

    let left = 0
    let top = 0
    const box = el.getBoundingClientRect()
    const boxLeft = box.left
    const boxTop = box.top

    //  console.log('centralPoint', boxLeft, boxTop)
    left = x - boxLeft
    top = y - boxTop
    const imgLeft = left - img.offsetLeft
    const imgTop = top - img.offsetTop

    left = left - imgCurWidth * (imgLeft / imgLastWidth)
    top = top - imgCurHeight * (imgTop / imgLastHeight)

    //  缩小  边界判断
    if (scale <= 1) {
      if (imgCurWidth <= w || imgCurHeight <= h) {
        left = (w - imgCurWidth) / 2
        top = (h - imgCurHeight) / 2
      }
    }

    return { top, left }
  }

  //  设置底图 / svg样式
  changeStyle(w, h, top, left) {
    this.setStyleSize(w, h)
    this.setStylePos(top, left)
    this.imgWidth = w
    this.imgHeight = h
  }

  //  设置底图/svg画布宽高
  setStyleSize(w, h) {
    const { el } = this.config
    const img = el.querySelector('.lbi-img')
    const svg = el.querySelector('.lbi-svg')

    img.style.width = w + 'px'
    img.style.height = h + 'px'
    svg.style.width = w + 'px'
    svg.style.height = h + 'px'
  }

  //  设置底图/svg top left值
  setStylePos(top, left) {
    const { el } = this.config
    const img = el.querySelector('.lbi-img')
    const svg = el.querySelector('.lbi-svg')

    img.style.top = top + 'px'
    img.style.left = left + 'px'
    svg.style.top = top + 'px'
    svg.style.left = left + 'px'
  }

  renderUI() {
    const { w, h } = this.config
    const uiHtml = `
      <div class="lbi-paint-box">
        <div class="lbi-svg-box">
          <img src="" alt="" class="lbi-img" />
          <svg class="lbi-svg"></svg>
        </div>
        <svg class="lbi-axis">
          <line x1="0" y1="0" x2="${w}" y2="0" style="stroke:#1c79c6;stroke-width:2" />
          <line x1="0" y1="0" x2="0" y2="${h}" style="stroke:#1c79c6;stroke-width:2" />
        </svg>
      </div>
    `

    this.config.el.innerHTML = uiHtml
  }

  loadStyle() {
    let style = document.querySelector('.label-svg-style')

    if (!style) {
      style = document.createElement('style')
      style.className = 'label-svg-style'

      const styleStr = `
        .lbi-paint-box, .lbi-svg-box {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .lbi-svg-box {
          position: relative;
        }
        .lbi-img, .lbi-svg {
          position: absolute;
        }
        // .lbi-img {
        //   box-shadow: 2px 2px 5px 0 rgb(0 0 0 / 75%);
        // }
        .lbi-svg {
          z-index: 5;
        }
        .lbi-axis {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: none;
        }
      `

      style.innerHTML = styleStr

      document.querySelector('head').appendChild(style)
    }
  }

  //  设置画布类型  draw--绘画状态 drag--底图拖拽状态
  setType(type) {
    this.config.type = type
  }

  //  设置画布绘画类型
  setDrawShape(shape) {
    this.config.shape = shape
  }

  //  事件绑定
  bindEvent() {
    const { el, isMouseWheel } = this.config
    const svg = el.querySelector('.lbi-svg')

    //  鼠标右键
    document.oncontextmenu = function() { return false }

    //  鼠标滚轮
    const agent = navigator.userAgent
    //  火狐浏览器
    if (/.*Firefox.*/.test(agent)) {
      console.log('Firefox')
      isMouseWheel && addHandle(el, 'DOMMouseScroll', this.mouseScroll.bind(this))
    }
    //  非火狐浏览器
    else {
      isMouseWheel && addHandle(el, 'mousewheel', this.mouseScroll.bind(this))
      //  console.log('not Firefox')
    }

    //  addHandle(document, 'contextmenu', this.wrapperContextmenu)
    addHandle(el, 'mouseover', this.wrapperMouseenter.bind(this))
    addHandle(el, 'mouseleave', this.wrapperMouseleave.bind(this))
    addHandle(el, 'mousemove', this.wrapperMousemove.bind(this))

    addHandle(svg, 'mousedown', this.handleMousedown.bind(this))
    addHandle(svg, 'mousemove', this.handleMousemove.bind(this))
    addHandle(svg, 'mouseup', this.handleMouseup.bind(this))

    this.isBindEvent = true
  }

  wrapperContextmenu() {
    return false
  }

  //  事件解绑
  removeEvent() {
    const { el } = this.config
    const svg = el.querySelector('.lbi-svg')

    //  removeHandle(document, 'contextmenu', this.wrapperContextmenu)
    //  鼠标右键
    document.oncontextmenu = null
    //  鼠标滚轮
    removeHandle(el, 'DOMMouseScroll', this.mouseScroll)
    addHandle(el, 'mousewheel', this.mouseScroll)

    removeHandle(el, 'mouseover', this.wrapperMouseenter)
    removeHandle(el, 'mouseleave', this.wrapperMouseleave)
    removeHandle(el, 'mousemove', this.wrapperMousemove)

    removeHandle(svg, 'mousedown', this.handleMousedown)
    removeHandle(svg, 'mousemove', this.handleMousemove)
    removeHandle(svg, 'mouseup', this.handleMouseup)
  }

  wrapperMouseenter() {
    const { el, type, shapeIcon, shape } = this.config

    //  默认为绘画状态
    let mouseShape = 'crosshair'

    //  底图拖拽
    if (type === 'drag') {
      mouseShape = 'move'
    } else {
      const icon = shapeIcon[shape]
      // console.log('icon', icon)
      mouseShape = `url(${icon || 'crosshair'}) 12 12, auto`
    }

    el.style.cursor = mouseShape
  }

  wrapperMouseleave() {
    const { el, shape } = this.config

    el.style.cursor = 'auto'
    this.isDrag = false

    switch (shape) {
      case 'point':
        break
      case 'rect':
        //  鼠标没有松开离开
        this.drawRectEnd()

        break

      case 'polyline':
      case 'polygon':
        break

      default:
        break
    }
  }

  mouseScroll(e) {
    e.preventDefault()
    let scale = this.scale
    //  火狐 e.detail  非火狐 e.wheelDelta
    const delta = e.detail ? e.detail > 0 : e.wheelDelta < 0

    if (!delta) {
      scale += 0.1

      if (scale >= 10) {
        scale = 10
      }
    } else {
      scale -= 0.1

      if (scale <= 0.5) {
        scale = 0.5
      }
    }

    const x = e.clientX
    const y = e.clientY

    this.setScale(scale, {
      x,
      y
    })

    return false
  }

  wrapperMousemove(e) {
    if (this.config.type === 'drag') return
    const scale = 1 / this.scale
    const x = e.offsetX * scale
    const y = e.offsetY * scale

    //  this.setAxisPos(x, y)
  }

  //  鼠标按下事件
  handleMousedown(e) {
    let type = this.config.type
    type = type.charAt(0).toUpperCase() + type.slice(1)

    this['handleMousedown' + type](e)
  }

  //  鼠标移动事件
  handleMousemove(e) {
    //  console.log('handleMousemove', e)
    let type = this.config.type
    type = type.charAt(0).toUpperCase() + type.slice(1)

    this['handleMousemove' + type](e)
  }
  //  鼠标弹起事件
  handleMouseup(e) {
    //  console.log('handleMouseup', e)
    let type = this.config.type
    type = type.charAt(0).toUpperCase() + type.slice(1)
    const x = e.pageX
    const y = e.pageY

    this['handleMouseup' + type](e)
  }

  //  鼠标按下--拖拽
  handleMousedownDrag(e) {
    //  if (this.scale === 1) return

    const x = e.pageX
    const y = e.pageY

    this.x = x
    this.y = y
    this.isDrag = true

    const { styleTop, styleLeft } = this.getImgStyleTopLeft()

    this.styleTop = styleTop
    this.styleLeft = styleLeft
  }
  //  鼠标移动--拖拽
  handleMousemoveDrag(e) {
    if (!this.isDrag) return

    const x = e.pageX
    const y = e.pageY
    const top = this.styleTop + y - this.y
    const left = this.styleLeft + x - this.x

    //  边界判断  拖动到图片边缘不可以再拖动
    // const { w, h } = this.config
    // let imgWidth = this.imgWidth
    // let imgHeight = this.imgHeight
    // let maxLeft = w - imgWidth
    // let maxTop = h - imgHeight
    // left = left > 0 ? 0 : (left < maxLeft ? maxLeft : left)
    // top = top > 0 ? 0 : (top < maxTop ? maxTop : top)

    //  console.log('handleMousemoveDrag', top, left)
    this.setStylePos(top, left)
  }
  //  鼠标弹起--拖拽
  handleMouseupDrag(e) {
    this.isDrag = false
  }

  //  鼠标按下--绘画
  handleMousedownDraw(e) {
    //  console.log('handleMousedownDraw')
    const scale = 1 / this.scale

    this.x = e.offsetX * scale
    this.y = e.offsetY * scale

    this.mouseDownToDraw(e)
  }
  // 鼠标按下--绘画 回调
  mouseDownToDraw(e) {
    const { shape, el, lineSize, drawColor, drawEnd } = this.config
    const svg = el.querySelector('.lbi-svg')
    const button = e.buttons
    let pointEl = null
    const points = [this.x, this.y]
    //  路径线条
    let polyline = el.querySelector('.polyline-active')

    switch (shape) {
      case 'point':
        //  鼠标右键
        if (button === 2) return

        this.isDrawEnd = false

        pointEl = this.drawPoint(svg, points)
        const item = {
          els: [pointEl],
          shape: 'point',
          points: this.submitConvertData([points])
        }

        this.outputData.push(item)
        drawEnd && drawEnd('point', item)

        this.isDrawEnd = true
        this.cleanCurShapeData()
        break

      case 'rect':
        //  鼠标右键
        if (button === 2) return

        this.isDrawEnd = false

        const rect = this.drawRect(svg, {
          x: this.x,
          y: this.y,
          width: 0,
          height: 0,
          stroke: drawColor,
          style: `fill:none;stroke-width: ${lineSize}`
        })

        this.curShape.els = [rect]
        this.curShape.shape = 'rect'
        break

      case 'polygon':
        //  鼠标右键
        if (button === 2) {
          //  this.curPolygonRepeal()
          const els = this.curShape.els.filter(item => item.nodeName !== 'polyline')
          const points = this.curShape.points
          this.curShape = {
            ...this.curShape,
            ...this.curPolygonRepeal(els, points, polyline)
          }
        }

        //  鼠标左键
        if (button === 1) {
          this.isDrawEnd = false
          //  第一个点
          const polygonStartPoint = el.querySelector('.polygon-active-start-point')

          //  点击第一个点闭合  完成多边形绘制
          if (e.target === polygonStartPoint) {
            let curShape = this.curShape
            const points = curShape.points

            //  只有一个点 退出
            if (points.length < 3) {
              alert('多边形点不够，至少3个点')
              //  polyline.parentNode.removeChild(polyline)
              //  this.removeCurShapeEls()
            }
            //  绘画完成
            else {
              curShape.els.forEach(el => {
                if (el.nodeName === 'circle') {
                  el.style.display = 'none'
                }
              })
              curShape.els = curShape.els.filter(item => item.nodeName !== 'polyline')
              svg.removeChild(polyline)
              polygonStartPoint.classList.remove('polygon-active-start-point')

              //  绘制多边形
              const polygon = this.drawPolygon(svg, points, {
                'fill': drawColor
              })

              curShape.els.push(polygon)

              //  填充数据
              const dataPoints = this.submitConvertData(points)
              curShape = {
                ...curShape,
                points: dataPoints
              }
              this.outputData.push(curShape)
              drawEnd && drawEnd('polygon', curShape)

              this.isDrawEnd = true
              this.cleanCurShapeData()
            }
          }
          //  绘制多边形路径以及其他点
          else {
            //  创建第一个点
            if (!polygonStartPoint) {
              pointEl = this.drawPoint(svg, points, {
                class: 'svg-child-not-g polygon-active-start-point'
              })
            }
            //  绘制其他点
            else {
              pointEl = this.drawPoint(svg, points)
              const startClonePoint = polygonStartPoint

              //  将第一个点置于最上层
              svg.removeChild(polygonStartPoint)
              svg.appendChild(startClonePoint)
            }

            this.curShape.els.push(pointEl)
            this.curShape.shape = 'polygon'
            this.curShape.points.push(points)

            const linePoints = this.curShape.points

            // 路径线条不存在  创建
            if (!polyline) {
              polyline = this.drawPolyline(svg, linePoints, {
                'class': 'svg-child-not-g polyline-active',
                'stroke': drawColor
              })
              this.curShape.els.push(polyline)
              return
            }

            polyline.setAttribute('points', linePoints.join(' '))
            polyline.setAttribute('data-position', JSON.stringify(linePoints))
          }
        }

        break

      case 'polyline':
        //  鼠标左键
        if (button === 1) {
          this.isDrawEnd = false
          pointEl = this.drawPoint(svg, points)
          this.curShape.els.push(pointEl)
          this.curShape.shape = 'polyline'
          this.curShape.points.push(points)

          const linePoints = this.curShape.points

          if (!polyline) {
            polyline = this.drawPolyline(svg, linePoints, {
              'class': 'svg-child-not-g polyline-active',
              'stroke': drawColor
            })
            this.curShape.els.push(polyline)

            return
          }

          polyline.setAttribute('points', linePoints.join(' '))
          polyline.setAttribute('data-position', JSON.stringify(linePoints))
        }

        //  鼠标右键
        if (button === 2) {
          let curShape = this.curShape
          const points = curShape.points

          //  只有一个点 删除退出
          if (points.length < 2) {
            //  polyline.parentNode.removeChild(polyline)
            this.removeCurShapeEls()
          } else {
            curShape.els.forEach(el => {
              if (el.nodeName === 'circle') {
                el.style.display = 'none'
              }
            })
            polyline.setAttribute('points', points.join(' '))
				    polyline.classList.remove('polyline-active')

            const dataPoints = this.submitConvertData(points)
            curShape = {
              ...curShape,
              points: dataPoints
            }
            this.outputData.push(curShape)
            drawEnd && drawEnd('polyline', curShape)
          }

          this.isDrawEnd = true
          this.cleanCurShapeData()
        }
        break
      default:
        // statements_def
        break
    }
  }
  //  鼠标移动--绘画
  handleMousemoveDraw(e) {
    if (this.isDrawEnd) return

    //  console.log('handleMousemoveDraw', top, left)
    const { shape, el } = this.config
    const scale = 1 / this.scale
    const offsetX = e.offsetX * scale
    const offsetY = e.offsetY * scale
    let x = 0
    let y = 0
    const curShapePoints = this.curShape.points
    const movePoints = curShapePoints.concat([offsetX, offsetY])
    const polyline = el.querySelector('.polyline-active')

    switch (shape) {
      case 'point':
        break

      case 'rect':
        offsetX > this.x ? x = this.x : x = offsetX
        offsetY > this.y ? y = this.y : y = offsetY
        const width = Math.abs(offsetX - this.x)
        const height = Math.abs(offsetY - this.y)
        const curShapeEl = this.curShape.els[0]
        curShapeEl.setAttribute('x', x)
        curShapeEl.setAttribute('y', y)
        curShapeEl.setAttribute('width', width)
        curShapeEl.setAttribute('height', height)
        this.curShape.points = [
          [x, y],
          [x + width, y],
          [x, y + height],
          [x + width, y + height]
        ]

        break

      case 'polygon':
      case 'polyline':
        polyline && polyline.setAttribute('points', movePoints.join(' '))
        break

      default:
        // statements_def
        break
    }
  }
  //  鼠标弹起--绘画
  handleMouseupDraw(e) {
    const { shape } = this.config
    const button = e.buttons

    switch (shape) {
      case 'point':
        break

      case 'rect':
        this.drawRectEnd()

        break

      case 'polygon':
        break

      case 'polyline':
        //  鼠标左键
        if (button === 1) {

        }
        //  鼠标右键
        if (button === 2) {
          this.isDrawEnd = true
        }
        break
      default:
        this.cleanCurShapeData()
        // statements_def
        break
    }
  }
  //  清空当前绘画
  cleanCurShapeData() {
    this.curShape = {
      els: [],
      shape: '',
      points: []
    }
  }
  //  删除当前SVG元素
  removeCurShapeEls() {
    const curShape = this.curShape
    const els = curShape.els

    els.forEach(el => {
      el.parentNode.removeChild(el)
    })

    this.isDrawEnd = true
    this.cleanCurShapeData()
  }

  drawPoint(parent, points, attrs = {}) {
    const { drawColor, pointSize } = this.config

    let config = {
      'class': `svg-child-not-g`,
      'cx': points[0],
      'cy': points[1],
      'r': pointSize,
      'stroke': drawColor,
      'fill': drawColor,
      'data-index': parent.children.length - parent.getElementsByTagName('g').length + 1,
      'data-position': JSON.stringify(points)
    }
    config = {
      ...config,
      ...attrs
    }

    const point = this.createPoint(config)
    parent.appendChild(point)

    return point
  }
  createPoint(attrs) {
    const { el, drawColor } = this.config
    var circle = makeElementNS('circle', attrs)
    circle.addEventListener('mouseover', function(e) {
      const target = e.target

      if (target === el.querySelector('.polygon-active-start-point')) {
        //  target.style.borderColor = 'black'
        target.setAttribute('stroke', 'yellow')
        target.style.strokeWidth = 20
      }
      target.style.strokeWidth = 10
    })
    circle.addEventListener('mouseout', function(e) {
      const target = e.target
      target.style.strokeWidth = 1
      target.setAttribute('fill', drawColor)
    })

    return circle
  }
  createRect(attrs) {
    const rect = makeElementNS('rect', attrs)

    return rect
  }
  createPolyline(attrs) {
    const polyline = makeElementNS('polyline', attrs)

    return polyline
  }
  createPolygon(attrs) {
    const polygon = makeElementNS('polygon', attrs)

    return polygon
  }
  drawRect(parent, attrs = {}) {
    let config = {
      'class': 'svg-child-not-g'
    }
    config = {
      ...config,
      ...attrs
    }
    const rect = this.createRect(config)
    parent.appendChild(rect)

    return rect
  }
  //  绘制矩形完成回调
  drawRectEnd() {
    if (!this.isDrawEnd) {
      let curShape = this.curShape
      const rect = curShape.els[0]
      const w = rect.getAttribute('width')
      const h = rect.getAttribute('height')

      if (w < this.rectMinWidth || h < this.rectMinHeight) {
        rect.parentNode.removeChild(rect)
      } else {
        curShape = {
          ...curShape,
          points: this.submitConvertData(curShape.points)
        }
        this.outputData.push(curShape)
        const drawEnd = this.config.drawEnd
        drawEnd && drawEnd('rect', curShape)
      }

      this.isDrawEnd = true
      this.cleanCurShapeData()
    }
  }
  drawPolygon(parent, points, attrs = {}) {
    let config = {
      'class': 'svg-child-not-g',
      'points': points.join(' '),
      'style': 'stroke:purple;stroke-width:1;opacity:.3',
      'data-position': JSON.stringify(points)
    }

    config = {
      ...config,
      ...attrs
    }
    const polygon = this.createPolygon(config)
    parent.appendChild(polygon)

    return polygon
  }
  drawPolyline(parent, points, attrs = {}) {
    let config = {
      'points': points.join(' '),
      'fill': 'none',
      'data-index': parent.children.length - parent.getElementsByTagName('g').length + 1,
      'data-position': JSON.stringify(points)
    }
    config = {
      ...config,
      ...attrs
    }
    const polyline = this.createPolyline(config)
    parent.appendChild(polyline)

    return polyline
  }
  //  获取元素style top left
  getImgStyleTopLeft() {
    const { el } = this.config
    const img = el.querySelector('.lbi-img')
    const styleTop = parseFloat(img.style.top)
    const styleLeft = parseFloat(img.style.left)

    return {
      styleTop,
      styleLeft
    }
  }
  //  设置辅助轴线位置
  setAxisPos(offsetX, offsetY) {
    const { el } = this.config
    const axis = el.querySelector('.lbi-axis')
    const xaxis = axis.firstElementChild
    const yaxis = axis.lastElementChild

    xaxis.setAttribute('y1', offsetY)
    xaxis.setAttribute('y2', offsetY)
    yaxis.setAttribute('x1', offsetX)
    yaxis.setAttribute('x2', offsetX)
  }
  //  设置轴线显示与隐藏
  setAxisIsShow(isShow) {
    const { el } = this.config
    const axisBox = el.querySelector('.lbi-axis')
    axisBox.style.display = isShow ? 'block' : 'none'
  }
  clean() {
    //  if (this.config.isLock) return

    const { el, showMask, maskInfo } = this.config
    const svg = el.querySelector('.lbi-svg')
    this.isDrawEnd = true
    this.outputData = []
    this.curShape = {
      els: [],
      shape: '',
      points: []
    }
    svg.innerHTML = ''
    showMask && this.createSvgMask(svg, maskInfo.x, maskInfo.y, maskInfo.w, maskInfo.h, maskInfo.color)
  }
  //  上一步  撤销
  repeal() {
    if (this.config.isLock) return

    const last = this.outputData.pop()

    if (!last) {
      console.log('全部删完了！')

      return
    }

    const els = last.els
    els.forEach(el => {
      const parent = el.parentNode
      parent.removeChild(el)
    })
  }
  //  获取数据
  getData() {
    return this.outputData
  }
  //  当前绘制多边形撤销到上一步
  curPolygonRepeal(els, points, polyline) {
    const popEl = els.pop()

    if (!popEl) {
      console.log('当前没有正在绘制的多边形')
      return {
        els: [],
        points: []
      }
    }

    popEl.parentNode.removeChild(popEl)
    points.pop()

    polyline.setAttribute('points', points.join(' '))

    //  最后一个圆点
    if (els.length === 0) {
      polyline.parentNode.removeChild(polyline)
      this.isDrawEnd = true
      this.cleanCurShapeData()
    }

    return {
      els,
      points
    }
  }
  //  转换数据格式  提交
  submitConvertData(data) {
    const w = this.viewWidth
    const h = this.viewHeight
    const arr = []

    data.forEach(item => {
      const x = item[0] / w
      const y = item[1] / h
      const obj = {
        x,
        y
      }

      arr.push(obj)
    })

    return arr
  }
  //  初始化绘制图形
  initShape(parent, data, w, h) {
    const { drawColor, lineSize } = this.config

    data.forEach(item => {
      const { shape, points, className = '' } = item
      const curShape = {
        shape,
        points
      }

      let drawPoints = deepClone(points).map(point => {
        point.x *= w
        point.y *= h

        return point
      })

      switch (shape) {
        case 'point':
          const pointEl = this.drawPoint(parent, [drawPoints[0].x, drawPoints[0].y])
          curShape.els = [pointEl]
          pointEl.setAttribute('class', className)
          break

        case 'rect':
          const point1 = drawPoints[0]
          const point4 = drawPoints[3]
          const rectEl = this.drawRect(parent, {
            x: point1.x,
            y: point1.y,
            width: point4.x - point1.x,
            height: point4.y - point1.y,
            stroke: drawColor,
            style: `fill:none;stroke-width: ${lineSize}`
          })

          curShape.els = [rectEl]
          rectEl.setAttribute('class', className)
          break

        case 'polyline':
          drawPoints = drawPoints.map(item => {
            const arr = [item.x, item.y]

            return arr
          })
          const polylineEl = this.drawPolyline(parent, drawPoints, {
            'class': 'svg-child-not-g',
            'stroke': drawColor
          })
          curShape.els = [polylineEl]
          polylineEl.setAttribute('class', className)
          break

        case 'polygon':
          drawPoints = drawPoints.map(item => {
            const arr = [item.x, item.y]

            return arr
          })
          const polygonEl = this.drawPolygon(parent, drawPoints, {
            'fill': drawColor
          })
          curShape.els = [polygonEl]
          polygonEl.setAttribute('class', className)
          break

        default:
          break
      }

      this.outputData.push(curShape)
    })
  }
  //  销毁事件
  dispose() {
    this.clean()
    this.removeEvent()
  }
}

export default LabelImg
