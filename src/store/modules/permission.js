import { asyncRoutes, resultRoutes, constantRoutes } from '@/router'
import Authority from '@/utils/authority'
/**
 * Use meta.role to determine if the current user has permission
 * @param Authority
 * @param route
 */
function hasPermission(route, authority) {
  if (route.meta && route.meta.role) {
    return Authority.varifyRouteAuthority(route, authority)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param authority
 */
export function filterAsyncRoutes(routes, authority) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp, authority)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authority)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  permissionRoutes: [],
  accessedRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.permissionRoutes = constantRoutes.concat(routes)
    state.accessedRoutes = routes
  }
}

const actions = {
  generateRoutes({ commit }, authority) {
    return new Promise(resolve => {
      let accessedRoutes
      if (authority.limit === 1) {
        accessedRoutes = [...asyncRoutes, ...resultRoutes] || []
      } else {
        accessedRoutes = [...filterAsyncRoutes(asyncRoutes, authority), ...resultRoutes]
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
