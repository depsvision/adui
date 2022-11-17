const state = {
  elementSize: 'medium',
  screenResolution: {
    width: 1920,
    height: 937
  },
  searchConditionExpand: false
}

const mutations = {
  CHANGE_ELE_SIZE: (state, size) => {
    state.elementSize = size
  },
  GET_SCREEN_RESOLUTION: (state, resolution) => {
    state.screenResolution = resolution
  },
  GET_SEARCH_CONDITION_EXPAND: (state, expand) => {
    state.searchConditionExpand = expand
  }
}

const actions = {
  changeEleSize({ commit }, size) {
    commit('CHANGE_ELE_SIZE', size)
  },
  getScreenResolution({ commit }, resolution) {
    commit('GET_SCREEN_RESOLUTION', resolution)
  },
  getSearchConditionExpand({ commit }, expand) {
    commit('GET_SEARCH_CONDITION_EXPAND', expand)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

