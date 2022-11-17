
import { ElLoading as Loading } from 'element-plus'

const state = {
  dialog: {
    name: '',
    show: false,
    modal: true,
    clickClose: false,
    pressClose: false,
    showClose: true,
    listenerData: null,
    listenerKey: null,
    listenerDataTime: null,
    listenerClick: null,
    dialog: null
  },
  checkStart: {
    waitting: false
  },
  closeDialogName: ''
}

const mutations = {
  SET_DIALOG_DATA: (state, dialog) => {
    if (dialog.level) {
      let dialogLevel = state.dialog

      for (let i = 1; i < dialog.level; i++) {
        dialogLevel = dialogLevel.dialog
      }

      dialogLevel[dialog.key] = dialog.value
    } else {
      state.dialog[dialog.key] = dialog.value
    }
  },
  ASSIGN_DIALOG_DATA: (state, dialog) => {
    state.dialog = Object.assign(state.dialog, dialog)
  },
  INIT_DIALOG_DATA: (state, dialog) => {
    if (dialog) {
      state.dialog.dialog = null
    } else {
      state.dialog = {
        name: '',
        show: false,
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        listenerData: null,
        listenerKey: null,
        listenerDataTime: null,
        listenerClick: null,
        dialog: null
      }
    }
  },
  SET_DIALOG_COMPONENT_DATA: (state, data) => {
    state[data.obj][data.key] = data.value
  },
  SET_DIALOG_NAME: (state, name) => {
    state.closeDialogName = name
  },
  ADD_DIALOG_LOADING: (state, text) => {
    state.dialog.loading = Loading.service({
      target: document.querySelector('.el-dialog'),
      text: text,
      background: 'rgba(255, 255, 255, .9)'
    })
  },
  REFRESH_BUTTONS_STATUS: (state) => {
    state.dialog.self.$refs.buttonGroup.$forceUpdate()
  }
}

const actions = {
  initDialogData({ commit }, dialog) {
    commit('INIT_DIALOG_DATA', dialog)
  },
  setDialogData({ commit }, dialog) {
    commit('SET_DIALOG_DATA', dialog)
  },
  assignDialogData({ commit }, dialog) {
    commit('ASSIGN_DIALOG_DATA', dialog)
  },
  setDialogComponentData({ commit }, data) {
    commit('SET_DIALOG_COMPONENT_DATA', data)
  },
  setDialogName({ commit }, name) {
    commit('SET_DIALOG_NAME', name)
  },
  addDialogLoading({ commit }, text) {
    commit('ADD_DIALOG_LOADING', text)
  },
  refreshButtonsStatus({ commit }) {
    commit('REFRESH_BUTTONS_STATUS')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

