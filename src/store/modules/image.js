const state = {
  imageViewer: {
    show: false,
    imgKey: 'url',
    imageHeader: '图片查看',
    listHeader: '列表',
    infoDisplay: {},
    infoComponent: null,
    infoSpecial: {},
    imageList: [],
    imageTools: {},
    appendToBody: false,
    activeImg: {},
    clipImage: [],
    lock: false
  },
  imageViewerRef: null
}

const mutations = {
  INIT_iMAGEVIEWER: (state) => {
    state.imageViewer = Object.assign(state.imageViewer, {
      show: false,
      imgKey: 'url',
      imageHeader: '图片查看',
      listHeader: '列表',
      infoDisplay: {},
      infoComponent: null,
      infoSpecial: {},
      imageList: [],
      imageTools: {},
      appendToBody: false,
      activeImg: {},
      clipImage: [],
      lock: false
    })
  },
  SET_iMAGEVIEWER: (state, img) => {
    state.imageViewer[img.key] = img.value
  },
  ASSIGN_iMAGEVIEWER: (state, img) => {
    state.imageViewer = Object.assign(state.imageViewer, img)
  },
  GET_IMAGE_VIEW_REF: (state, ref) => {
    state.imageViewerRef = ref
  }
}

const actions = {
  initImageViewer({ commit }) {
    commit('INIT_iMAGEVIEWER')
  },
  setImageViewer({ commit }, img) {
    commit('SET_iMAGEVIEWER', img)
  },
  assignImageViewer({ commit }, img) {
    commit('ASSIGN_iMAGEVIEWER', img)
  },
  getImageViewRef({ commit }, ref) {
    commit('GET_IMAGE_VIEW_REF', ref)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

