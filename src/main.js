import { createApp } from "vue";
// element ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import Cookies from 'js-cookie'
// import './icons'
import 'virtual:svg-icons-register'
import App from './App.vue'

const Vue = createApp(App)
const app = Vue
app.use(ElementPlus)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


import router from './router'

import Vuex from 'vuex'
import store from './store'

// import 'element-plus/lib/theme-chalk/index.css'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import * as echarts from 'echarts'

import Duration from "dayjs/plugin/duration";
import QuarterOfYear  from 'dayjs/plugin/quarterOfYear'
import CustomParseFormat  from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
// const duration = require('dayjs/plugin/duration')
// const quarterOfYear = require('dayjs/plugin/quarterOfYear')
// const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(CustomParseFormat)
dayjs.extend(Duration)
dayjs.extend(QuarterOfYear)

import Storage from '@/utils/token'
import Authority from '@/utils/authority'

import '@/assets/icon/iconfont.css'

import '@/styles/index.scss' // global css

import SvgIcon from '@/components/SvgIcon' // icon

app.component('svg-icon', SvgIcon)
import * as filters from './filters' // global filters
import './permission' // permission control

import axios from 'axios'

import VueClipboard from 'vue-clipboard2'



// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)

// // you do not need `import app from './modules/app'`
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//     // set './app.js' => 'app'
//     const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//     const value = modulesFiles(modulePath)
//     modules[moduleName] = value.default
//     return modules
// }, {})

// const store = new Vuex.Store({
//     modules,
//     getters
// })

app.use(VueClipboard)

import streamSaver from '@/components/StreamSaver'

app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$storage = Storage
app.config.globalProperties.$authority = Authority
app.config.globalProperties.$axios = axios
app.config.globalProperties.$streamSaver = streamSaver

// Vue.use(Element, {
//     // size: Cookies.get('size') || 'medium' // set element-ui default size
//     // locale: enLang // 如果使用中文，无需设置，请删除
// })

app.config.globalProperties.$messageInfo = function (msg) {
    const change = {
        showClose: true,
        offset: 70
    }
    const option = Object.assign(msg, change)
    app.config.globalProperties.$message(option)
}

// register global utility filters
Object.keys(filters).forEach(key => {
    app.config.globalProperties[key] = filters[key]
})

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')


app.use(store).use(router).mount('#app')