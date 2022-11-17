/*
 * @Descripttion:
 * @version:
 * @Author: Jianyong Wang
 * @Date: 2021-05-08 12:05:02
 * @LastEditors: Jianyong Wang
 * @LastEditTime: 2021-05-12 16:03:49
 */
export const merge = function(def, opt) {
  for (const key in opt) {
    if (opt.hasOwnProperty(key)) {
      def[key] = opt[key]
    }
  }

  return def
}

//  创建xml元素
export const makeElementNS = (name, attrs) => {
  const ns = 'http://www.w3.org/2000/svg'
  const el = document.createElementNS(ns, name)

  for (const key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      el.setAttribute(key, attrs[key])
    }
  }

  return el
}

//  获取兄弟元素
export const getSiblings = (nodes, target) => {
  let siblings = []
  siblings = Array.from(nodes).filter(item => {
    return item !== target
  })

  return siblings
}

//  事件绑定兼容
export const addHandle = (dom, type, fn) => {
  if (document.addEventListener) {
    dom.addEventListener(type, fn, false)
  } else if (document.attachEvent) {
    dom.attachEvent('on' + type, fn)
  } else {
    const oldDomFun = dom['on' + type]
    dom['on' + type] = function() {
      oldDomFun()
      fn && fn()
    }
  }
}

//  事件解绑
export const removeHandle = (dom, type, fn) => {
  if (document.removeEventListener) {
    dom.removeEventListener(type, fn)
  } else if (document.detachEvent) {
    dom.detachEvent('on' + type, fn)
  } else {
    dom['on' + type] = null
  }
}

export const deepClone = (source, dest) => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  dest = dest || (source.constructor === Array ? [] : {})
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object') {
        dest[key] = source[key].constructor === Array ? [] : {}
        deepClone(source[key], dest[key])
      } else {
        dest[key] = source[key]
      }
    }
  }
  return dest
}
