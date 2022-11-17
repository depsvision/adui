import authorityConfig from '@/setting'

export default {

  /**
   * @param {Object} authority
   * @param {Object} resultAuthority
   * @param {String} authoritySelfKey
   * @returns {Object}
   */
  decomposeAuthority(authority, resultAuthority = {}, authoritySelfKey) {
    const authorityKeys = Object.keys(authority)
    if (authorityKeys.length > 0) {
      authorityKeys.forEach(item => {
        if (item === 'root') {
          resultAuthority[authoritySelfKey] = { root: authority[item] }
        } else {
          if (Object.keys(authority[item]).length > 0) {
            Object.keys(authority[item])[0] !== 'root' && (resultAuthority[item] = authorityConfig.authority.view)
            this.decomposeAuthority(authority[item], resultAuthority, item)
          } else {
            resultAuthority[item] = authority[item]
          }
        }
      })
    }
    return resultAuthority
  },

  /**
   * @param {Object} route
   * @param {Object} authority
   * @returns {Boolean}
   */
  varifyRouteAuthority(route, authority) {
    const view = authorityConfig.authority.view

    let transformRoleInner = false
    const decompose = this.decomposeAuthority(authority)

    if (route.meta && route.meta.role) {
      transformRoleInner = route.meta.role.some(role => {
        return decompose[role] && (Object.keys(decompose[role]).length > 0 || (decompose[role] & view) === view)
      })
    }

    return authority.limit === 1 || transformRoleInner
  }
}
