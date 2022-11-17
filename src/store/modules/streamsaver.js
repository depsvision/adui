const state = {
  streamSaver: {
    writer: {}
  }
}

const mutations = {
  INIT_STREAM_SAVER: (state) => {
    state.streamSaver = {
      write: []
    }
  },
  SET_WRITER: (state, writer) => {
    state.streamSaver.writer[String(writer.time)] = writer.writer
  },
  CLOSE_WRITER: (state, time) => {
    state.streamSaver.writer[String(time)].close()
  },
  CLOSE_ALL_WRITER: (state) => {
    const writerKeys = Object.keys(state.streamSaver.writer)

    writerKeys.forEach(time => {
      state.streamSaver.writer[String(time)].close()
    })
  },
  ABORT_WRITER: (state, time) => {
    state.streamSaver.writer[String(time)].abort()
  },
  ABORT_ALL_WRITER: (state) => {
    const writerKeys = Object.keys(state.streamSaver.writer)

    writerKeys.forEach(time => {
      state.streamSaver.writer[String(time)].abort()
    })
  },
  DELETE_WRITER: (state, time) => {
    delete state.streamSaver.writer[String(time)]
  },
  DELETE_ALL_WRITER: (state) => {
    const writerKeys = Object.keys(state.streamSaver.writer)

    writerKeys.forEach(time => {
      delete state.streamSaver.writer[String(time)]
    })
  }
}

const actions = {
  initStreamSaver({ commit }) {
    commit('INIT_STREAM_SAVER')
  },
  setWriter({ commit }, writer) {
    commit('SET_WRITER', writer)
  },
  closeWriter({ commit }, time) {
    commit('CLOSE_WRITER', time)
  },
  closeAllWriter({ commit }) {
    commit('CLOSE_WRITER')
  },
  abortWriter({ commit }, time) {
    commit('ABORT_WRITER', time)
  },
  abortAllWriter({ commit }) {
    commit('ABORT_ALL_WRITER')
  },
  deleteWriter({ commit }, time) {
    commit('DELETE_WRITER', time)
  },
  deleteAllWriter({ commit }) {
    commit('DELETE_ALL_WRITER')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
