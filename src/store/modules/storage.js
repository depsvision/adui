const state = {
  session: {
    logo: null
  }
}

const mutations = {
  LISTEN_SESSION_STORAGE: (state, session) => {
    state.session[session.key] = session.value
  },
  ASSIGN_SESSION_STORAGE: (state, session) => {
    state.session = Object.assign(state.scope, session)
  }
}

const actions = {
  listenSessionStorage({ commit }, session) {
    commit('LISTEN_SESSION_STORAGE', session)
  },
  assignSessionStorage({ commit }, session) {
    commit('ASSIGN_SESSION_STORAGE', session)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

