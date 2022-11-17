import user from '@/api/user'
import Storage from '@/utils/token'
import store from '@/store'
import router, { resetRouter } from '@/router'
import { cleanInit } from '@/utils/interceptors'

const state = {
  accessToken: Storage.getLocal('accessToken'),
  authority: {},
  authTime: 0
}

const mutations = {
  SET_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_AUTHORITY: (state, authority) => {
    state.authority = authority
  },
  SET_AUTHTIME: (state, time) => {
    state.authTime = time
  }
}

const actions = {
  getAuthority({ commit }) {
    return new Promise((resolve) => {
      user.userGetAuthority().then(res => {
        const { data } = res
        commit('SET_AUTHORITY', data)
        resolve(data)
      })
    })
  },

  setAuthTime({ commit }, time) {
    commit('SET_AUTHTIME', time)
  },

  // user login
  login({ commit }, userInfo = {}) {
    return new Promise((resolve, reject) => {
      user.userLogin(userInfo, true)
        .then(response => {
          const { data } = response

          commit('SET_TOKEN', data.accessToken)

          Storage.setLocal('accessToken', data.accessToken)

          Storage.setLocal('userMarks', JSON.stringify(data))
          resolve()
        })
        .catch(err => {
          reject(err.errorMsg)
        })
    })
  },

  // user logout
  logout({ commit }) {
    // const { requestInfo } = await apiUser.userLogout()
    // if (requestInfo.flag) {
    commit('SET_TOKEN', '')
    Storage.removeLocal('accessToken')

    Storage.removeLocal('userMarks')
    commit('SET_AUTHORITY', {})

    resetRouter()

    cleanInit()

    router.push({ path: '/login' }).catch(() => {})
    // }
  },

  noSecretLogin({ commit }, secret = '') {
    return new Promise((resolve, reject) => {
      user.noSecretLogin({ code: secret })
        .then(response => {
          const { data } = response

          commit('SET_TOKEN', data.accessToken)

          Storage.setLocal('accessToken', data.accessToken)

          Storage.setLocal('userMarks', JSON.stringify(data))
          resolve()
        })
        .catch(() => {
          store.dispatch('user/logout')
          reject()
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      Storage.removeLocal('accessToken')

      Storage.removeLocal('userMarks')

      cleanInit()

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
