import loading from './loading'

const install = function(Vue) {
  Vue.directive('loading-s', loading)
}

if (window.Vue) {
  window['loading-s'] = loading
  Vue.use(install); // eslint-disable-line
}

loading.install = install
export default loading
