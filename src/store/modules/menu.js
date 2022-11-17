const state = {
  aside: {
    collapse: false
  }
}

const mutations = {
  CHANGE_ASIDE_DATA: (state, aside) => {
    state.aside[aside.key] = aside.value
  }
}

const actions = {
  changeAsideData({ commit }, aside) {
    commit('CHANGE_ASIDE_DATA', aside)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

