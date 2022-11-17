const loadingSvg = (el, binding) => {
  const size = (binding.value && binding.value.size) || 16
  const color = (binding.value && binding.value.color) || '#1872F0'

  el.style.width = size + 'px'
  el.style.height = size + 'px'
  el.style['flex-shrink'] = 0
  el.style['border-radius'] = '50%'
  el.style['border-top'] = el.style['border-right'] = el.style['border-bottom'] = size / 8 + 'px solid #DBDDE0'
  el.style['border-left'] = size / 8 + 'px solid ' + color
  el.style['-webkit-transform'] = el.style['ms-transform'] = el.style['transform'] = 'translateZ(0)'
  el.style['-webkit-animation'] = el.style['animation'] = 'rotate 1.5s linear 0s infinite normal'
}

export default {
  update(el, binding) {
    binding
  },
  inserted(el, binding) {
    loadingSvg(el, binding)
  },
  componentUpdated(el, binding) {
    loadingSvg(el, binding)
  }
}
