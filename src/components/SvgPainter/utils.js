export const getElementNS = (name, attrs = {}) => {
  const ns = 'http://www.w3.org/2000/svg'
  const el = document.createElementNS(ns, name)

  return setAttrs(el, attrs)
}

export const setAttrs = (el, attrs = {}) => {
  const keys = Object.keys(attrs)

  keys.forEach(key => {
    el.setAttribute(key, attrs[key])
  })

  if (attrs.style) {
    Object.keys(attrs.style).forEach(attr => {
      el.style[attr] = attrs.style[attr]
    })
  }

  return el
}
