import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
dayjs.extend(Duration)

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
   * @param {number} startTime
   * @param {string} startTimFormat
   * @param {string} endTime
   * @returns {string}
   */
export function countTimer(startTime, endTime, startTimFormat) {
  const day1 = dayjs(startTime, startTimFormat)
  const day2 = endTime ? dayjs(endTime) : dayjs()
  const years = dayjs.duration(day2 - day1).years()
  const months = dayjs.duration(day2 - day1).months()
  const days = dayjs.duration(day2 - day1).days()
  const hours = dayjs.duration(day2 - day1).hours()
  const minutes = dayjs.duration(day2 - day1).minutes()
  const seconds = dayjs.duration(day2 - day1).seconds()
  return { years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds }
}

/**
   * @param {number} time
   * @param {string} Scenes
   * @param {string} file
   * @returns {string}
   */
export function formatDate(time, Scenes, file) {
  const date = new Date(time)
  const YY = date.getFullYear() + '-'
  const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + (file === 'file' ? 'h' : ':')
  const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + (file === 'file' ? 'm' : ':')
  const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + (file === 'file' ? 's' : '')
  return Scenes === 'full' ? YY + MM + DD + ' ' + hh + mm + ss : YY + MM + DD
}

/**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
    )
  }
}

/**
   * @param {string} url
   * @returns {Object}
   */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
   * @param {string} input value
   * @returns {number} output value
   */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
   * @param {Array} actual
   * @returns {Array}
   */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
   * @param {Object} json
   * @returns {Array}
   */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
   * @param {Object} data
   * @param arg
   * @returns {Object}
   */
export function trimObject(data, ...arg) {
  arg.forEach(item => {
    if (typeof data[item] === 'string') {
      data[item] = data[item].replace(/\s*/g, '')
    } else if (typeof data[item] === 'number') {
      data[item] = Number(String(data[item]).replace(/\s*/g, ''))
    }
  })
  return data
}

/**
   * @param {Object} data
   * @param {string} initNum
   * @param {string} recursionCondition
   * @param {string} recursionStatistics
   * @returns {string}
   */
export function recursionTreeTotal(data, initNum, recursionCondition, recursionStatistics) {
  if (Array.isArray(data)) {
    data.forEach(item => {
      initNum += recursionTreeTotal(item, 0, recursionCondition, recursionStatistics)
    })
  } else {
    if (data[recursionCondition]) {
      for (const props in data[recursionCondition]) {
        initNum += recursionTreeTotal(data[recursionCondition][props], 0, recursionCondition, recursionStatistics)
      }
    } else {
      initNum += data[recursionStatistics]
    }
  }

  return initNum
}

/**
   * @param {Object} data
   * @param {string} recursionCondition
   * @param {Object} addObj
   * @returns {string}
   */
export function recursionAddToTree(data, recursionCondition, addObj) {
  data.forEach(item => {
    if (item[recursionCondition]) {
      recursionAddToTree(item[recursionCondition], recursionCondition, addObj)
    }
    for (const props in addObj) {
      item[props] = addObj[props]
    }
  })
  return data
}

/**
   * @param {string} url
   * @returns {Object}
   */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
   * @param {string} val
   * @returns {string}
   */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
   * Merges two objects, giving the last one precedence
   * @param {Object} target
   * @param {(Object|Array)} source
   * @returns {Object}
   */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
   * @param {HTMLElement} element
   * @param {string} className
   */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
        classString.substr(0, nameIndex) +
        classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
   * @param {string} type
   * @returns {Date}
   */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
   * @param {Function} func
   * @param {number} wait
   * @param {boolean} immediate
   * @return {*}
   */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
   * This is just a simple version of deep copy
   * Has a lot of edge cases bug
   * If you want to use a perfect deep copy, use lodash's _.cloneDeep
   * @param {Object} source
   * @returns {Object}
   */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : (source.constructor === RegExp ? new RegExp(source) : {})
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })

  return targetObj
}

/**
   * @param {Array} arr
   * @returns {Array}
   */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
   * @returns {string}
   */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
   * Check if an element has a class
   * @param {HTMLElement} elm
   * @param {string} cls
   * @returns {boolean}
   */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
   * Add class to element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
   * Remove class from element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
   * @param {Array} arr
   *  @param {Number} length

   * @returns {string}
   */
export function splitArray(arr, length) {
  const arrLayout = []
  const arrAmount = Math.ceil(arr.length / length)
  for (let i = 0; i < arrAmount; i++) {
    arrLayout[i] = arr.slice(i * length, (i + 1) * length)
  }
  return arrLayout
}

export function wktToJs(wkt) {
  if (!wkt) {
    return []
  }

  const reg = /\((.+?)\)/g
  const arr = []
  if (reg.test(wkt)) {
    wkt = RegExp.$1.replace('(', '')
    const wktArr = wkt.split(',')
    wktArr.forEach((item) => {
      const newArr = item.split(' ')
      const obj = {
        x: newArr[0],
        y: newArr[1]
      }
      arr.push(obj)
    })

    return arr
  }
}

// 点线框  线字段（line）转 linestring
export function lineToLineString(type) {
  return type === 'line' ? 'linestring' : type
}

export function jsToWkt(data) {
  const strObj = {
    point: 'POINT(',
    linestring: 'LINESTRING(',
    polygon: 'POLYGON((',
    rect: 'POLYGON(('
  }

  const type = lineToLineString(data.shape)
  const endStr = (type === 'polygon' || type === 'rect') ? '))' : ')'

  let startStr = strObj[type]

  data.points.forEach((item, index) => {
    const pointLen = data.points.length

    const x = Number(item.x).toFixed(5)
    const y = Number(item.y).toFixed(5)
    startStr += x + ' ' + y + (index === pointLen - 1 ? '' : ',')
  })

  startStr += endStr

  return startStr
}

export function uint8ArrayToStringChar(data) {
  let result = ''

  data.forEach(d => {
    result += String.fromCharCode(d)
  })

  return result
}

export function uint8ArrayToStringDecoder(data) {
  const dec = new TextDecoder()

  const result = dec.decode(data)

  return result
}

export function stringToBuffer(str) {
  const textEncoder = typeof TextEncoder === 'undefined' ? null : new TextEncoder('utf-8')

  if (typeof str !== 'string') {
    return str
  }

  if (textEncoder) {
    return Buffer.from(textEncoder.encode(str).buffer)
  }

  return Buffer.from(str)
}
/**
   * @param {Element} el
   * @param {Number} position
   * @param {Number} time  // 100ms

   * @returns
  *
*/
export function backToPositon(el, position, time, interval = 10) {
  let intervalPosition = 0

  if (position === 'bottom') {
    intervalPosition = Math.floor((el.scrollHeight - el.offsetHeight - el.scrollTop) * interval / time)
  } else {
    intervalPosition = Math.floor(Math.abs(position - el.scrollTop) * interval / time)
  }

  const scrollAnimation = setInterval(() => {
    let leftPosition = Math.abs(position - el.scrollTop)

    if (position === 'bottom') {
      leftPosition = el.scrollHeight - el.offsetHeight - el.scrollTop
      if (leftPosition < intervalPosition) {
        el.scrollTop += leftPosition
      } else {
        el.scrollTop += intervalPosition
      }
    } else if (el.scrollTop > position) {
      if (leftPosition < intervalPosition) {
        el.scrollTop -= leftPosition
      } else {
        el.scrollTop -= intervalPosition
      }
    } else if (el.scrollTop < position) {
      if (position > el.scrollHeight - el.offsetHeight) {
        leftPosition = el.scrollHeight - el.offsetHeight - el.scrollTop
      }

      if (leftPosition < intervalPosition) {
        el.scrollTop += leftPosition
      } else {
        el.scrollTop += intervalPosition
      }
    }

    if (leftPosition < 1 || el.scrollTop === position) {
      clearInterval(scrollAnimation)
    }
  }, interval)
}

/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export function isHexColor(color) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}

/**
 * Transform a HEX color to its RGB representation
 * @param {string} hex The color to transform
 * @returns The RGB representation of the passed color
 */
export function hexToRGB(hex) {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
    }
    return 'RGB(' + sColorChange.join(',') + ')'
  }
  return sHex
}

/**
 * Calculates luminance of an rgb color
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 */
function luminanace(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * Calculates contrast between two rgb colors
 * @param {string} rgb1 rgb color 1
 * @param {string} rgb2 rgb color 2
 */
function contrast(rgb1, rgb2) {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}

/**
 * Determines what the best text color is (black or white) based con the contrast with the background
 * @param hexColor - Last selected color by the user
 */
export function calculateBestTextColor(hexColor) {
  const rgbColor = hexToRGB(hexColor)
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * 深度优先
 * @param el 绑定的dom元素
 * @param name 需要对比的tagName
 */
export function traverseDomTagName(el, name) {
  const length = el.children.length

  if (el.tagName === name) {
    return el
  } else {
    if (length > 0) {
      let result = null
      for (let i = 0; i < length; i++) {
        result = traverseDomTagName(el.children[i], name)

        if (result !== null) {
          break
        }
      }

      return result
    } else {
      return null
    }
  }
}

/**
 * @param url 压缩图片
 * @param format 压缩后的格式
 * @param quality 压缩后质量
 */
export const trasformImage = (url = '', format = 'png', quality = 0.92) => {
  return new Promise(resolve => {
    const image = new Image()
    image.crossOrigin = ''
    image.src = url

    image.onload = () => {
      const originCanvas = document.createElement('canvas')
      originCanvas.width = image.naturalWidth
      originCanvas.height = image.naturalHeight
      const originCtx = originCanvas.getContext('2d')
      originCtx.drawImage(image, 0, 0)
      const imageData = originCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight)

      const newCanvas = document.createElement('canvas')
      newCanvas.width = image.naturalWidth
      newCanvas.height = image.naturalHeight

      const newCtx = newCanvas.getContext('2d')
      newCtx.putImageData(imageData, 0, 0)

      const src = newCanvas.toDataURL(`image/${format}`, quality)

      resolve(src)
    }

    image.onerror = () => {
      resolve(url)
    }
  })
}
