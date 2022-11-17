export default {
  setSession(name, session) {
    return sessionStorage.setItem(name, session)
  },

  getSession(name) {
    return sessionStorage.getItem(name)
  },

  removeSession(name) {
    return sessionStorage.removeItem(name)
  },

  setLocal(name, session) {
    return localStorage.setItem(name, session)
  },

  getLocal(name) {
    return localStorage.getItem(name)
  },

  removeLocal(name) {
    return localStorage.removeItem(name)
  }
}
