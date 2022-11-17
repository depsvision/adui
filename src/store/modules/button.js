const state = {
  button: {
    value: ''
  },
  scope: {},
  deliver: {}
}

const mutations = {
  LISTEN_CLICK_BUTTON: (state, button) => {
    state.button[button.key] = button.value
  },
  ASSIGN_BUTTON_DATA: (state, button) => {
    state.button = Object.assign(state.button, button)
  },
  ASSIGN_SCOPE_DATA: (state, scope) => {
    state.scope = Object.assign(state.scope, scope)
  },
  DELIVER_DATA: (state, data) => {
    if (data.key && data.value) {
      state.deliver[data.key] = data.value
    } else {
      state.deliver = data
    }
  }
}

const actions = {
  listenClickButton({ commit }, button) {
    commit('LISTEN_CLICK_BUTTON', button)
  },
  assignButtonData({ commit }, button) {
    commit('ASSIGN_BUTTON_DATA', button)
  },
  assignScopeData({ commit }, scope) {
    commit('ASSIGN_SCOPE_DATA', scope)
  },
  deliverData({ commit }, data) {
    commit('DELIVER_DATA', data)
  },
  simulateButton({ commit }, value) {
    let timeout = 500
    if (typeof value === 'object') {
      value = value.value
      timeout = value.time
    }

    commit('ASSIGN_BUTTON_DATA', { value: value })
    // 每次点击完后重置button的value值，防止watch不到变化，同时做到 “节流” 的效果
    setTimeout(() => {
      commit('LISTEN_CLICK_BUTTON', { key: 'value', value: '' })
    }, timeout)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

