const state = {
  url: '',
  videoId: {
    open: -1,
    close: -1
  },
  streamUrl: {}
}

const mutations = {
  SET_VIDEO_URL: (state, url) => {
    state.url = url
  },
  SET_VIDEOId: (state, video) => {
    state.videoId[video.key] = video.value
  },

  RECORD_VIDEO_ID: (state, videoId) => {
    state.videoId = Object.assign(state.videoId, videoId)
  },

  STORE_STREAM_URL: (state, video) => {
    state.streamUrl[`${video.id}-${video.name}`] = {
      code: video.code,
      url: video.url
    }
  },
  CHECK_SAME_ID: (state, video) => {
    const keys = Object.keys(state.streamUrl)

    keys.forEach(key => {
      const keyId = key.split('-')[0]
      const keyName = key.split('-')[1]

      if (keyId && keyName) {
        const isSameId = keyId === video.id
        const isSameName = keyName === video.name

        if (isSameId && !isSameName) {
          delete state.streamUrl[key]

          state.streamUrl[`${video.id}-${video.name}`] = {
            code: video.code,
            url: video.url
          }
        }
      } else {
        delete state.streamUrl[key]
      }
    })
  }
}

const actions = {
  setVideoUrl({ commit }, url) {
    commit('SET_VIDEO_URL', url)
  },
  setVideoId({ commit }, video) {
    commit('SET_VIDEOId', video)
  },
  assignVideoId({ commit }, videoId) {
    commit('RECORD_VIDEO_ID', videoId)
  },

  storeStreamUrl({ commit }, video) {
    commit('CHECK_SAME_ID', video)

    commit('STORE_STREAM_URL', video)
  },
  getStreamUrl({ commit }, video) {
    return new Promise(resolve => {
      const videoOption = state.streamUrl[`${video.id}-${video.name}`] ?? null

      resolve(videoOption)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

