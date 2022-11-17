import color from './color'

const install = function(Vue) {
  Vue.directive('png-color', color)
}

if (window.Vue) {
  window['png-color'] = color
  Vue.use(install); // eslint-disable-line
}

color.install = install
export default color
