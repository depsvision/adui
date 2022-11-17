// import { getCurrentInstance } from 'vue'
import Vuex from 'vuex'
import getters from './getters'


// const Vue = getCurrentInstance()
// Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
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

import app from './modules/app'
import button from './modules/button'
import audio from './modules/audio'
import data from './modules/data'
import dialog from './modules/dialog'
import image from './modules/image'
import menu from './modules/menu'
import permission from './modules/permission'
import resolution from './modules/resolution'
import storage from './modules/storage'
import streamsaver from './modules/streamsaver'
import user from './modules/user'
import video from './modules/video'


const store = new Vuex.Store({
    modules: {app, button, audio, data, dialog, image, menu, permission, resolution, storage, streamsaver, user, video},
    getters
})

export default store
