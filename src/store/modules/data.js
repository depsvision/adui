
const state = {
  globalData: {
    checkbox: {
      global: []
    },
    appidData: [],
    clone: {
      positionIndex: -1,
      index: [],
      value: []
    }
  }
}

const mutations = {
  INIT_DATA: (state) => {
    state.globalData = {
      checkbox: {
        global: []
      },
      appidData: [],
      clone: {
        positionIndex: -1,
        index: [],
        value: []
      }
    }
  },
  SET_DATA: (state, data) => {
    if (data.key) {
      state.globalData[data.obj][data.key] = data.value
    } else {
      state.globalData[data.obj] = data.value
    }
  }
}

const actions = {
  initData({ commit }) {
    commit('INIT_DATA')
  },
  setData({ commit }, data) {
    commit('SET_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

