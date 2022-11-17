import router from './router'
import { asyncRoutes, resultRoutes } from './router'
import store from './store'
import { ElMessage as Message } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Storage from '@/utils/token'
import Authority from '@/utils/authority'
import getPageTitle from '@/utils/getPageTitle'
import { cleanRequestList } from '@/utils/interceptors'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/third', '/third/login'] // no redirect whitelist


const getAsyncRoutesList = (routes, path) => {
    const list = []

    routes.forEach(route => {
        if (route.children) {
            const nextPath = route.path ? `${path ? `${path}/` : ''}${route.path}` : path

            list.push(...getAsyncRoutesList(route.children, nextPath))
        } else {
            list.push(`${path ? `${path}` : ''}${route.path ? `/${route.path}` : ``}`)

            route.name && list.push(route.name)
        }
    })

    return list
}

const filterAccessRoute = async (authority) => {
    const accessRoutes = await store.dispatch('permission/generateRoutes', authority)

    const accessRoutesList = getAsyncRoutesList(accessRoutes)

    const reWriteRedirect = (route, redirect = '') => {
        let redirectNew = redirect

        if (route.path) {
            redirectNew += `${redirect ? '/' : ''}${route.path}`
        }

        if (route.children) {
            redirectNew = reWriteRedirect(route.children[0], redirectNew)
        }

        return redirectNew
    }

    accessRoutes.forEach(item => {
        if (item.redirect && !accessRoutesList.includes(item.redirect)) {
            item.redirect = reWriteRedirect(item)
        }
    })

    return accessRoutes
}

// 授权检查
const judgedNext = async (to, from, next) => {
    try {
        // judge authority
        const authority = await store.dispatch('user/getAuthority')
        // const authority = {
        //     "limit": 1,
        //     "role": {
        //         "alert": 0,
        //         "app": 0,
        //         "callback": 0,
        //         "callbackLog": 0,
        //         "camera": 0,
        //         "console": 0,
        //         "imageTask": 0,
        //         "linkage": 0,
        //         "log": 0,
        //         "material": 0,
        //         "node": 0,
        //         "oss": 0,
        //         "record": 0,
        //         "role": 0,
        //         "setting": 0,
        //         "task": 0,
        //         "user": 0
        //     }
        // }
        const accessRoutes = await filterAccessRoute(authority)

        const routeTo = accessRoutes[0]

        const routes = router.getRoutes()

        accessRoutes.forEach(route => {
          if (!routes.some(item => item.path === route.path)) {
            router.addRoute(route)
          }
        })

        if (to.name === 'FirstRoute' || to.name === 'LoginPage') {
            if (routeTo && routeTo.path !== from.path) {
                next({ ...routeTo, replace: true })
            } else if (routeTo.path === from.path) {
                next(false)
                NProgress.done()
            } else {
                next({ path: '/403' })
            }
        } else {
            const asyncRoutesList = getAsyncRoutesList(asyncRoutes)
            const inRouter = asyncRoutesList.includes(to.path) || asyncRoutesList.includes(to.name)

            const allRoutes = router.getRoutes()
            const inAccessRouter = allRoutes.some(route => route.path === to.path || route.name === to.name)

            if (to.path === '/403' || to.path === '/404') {
                next({ ...to, replace: true })
            } else if (inRouter) {
                if (inAccessRouter) {
                    next({ ...to, replace: true })
                } else {
                    next({ path: '/403' })
                }
            } else {
                next({ path: '/404' })
            }
        }
    } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        Message({
            message: error.message || 'Error',
            type: 'error',
            offset: 70,
            duration: 5 * 1000,
            showClose: true
        })
        next(`/login?redirect=${to.path}`)
        NProgress.done()
    }
}

const noSecretLogin = async (match, next) => {
    await store.dispatch('user/noSecretLogin', match)
        .then(async () => {
            next('/').catch(() => { })
            NProgress.done()
        })
        .catch(() => {
            next(false)
            NProgress.done()
        })
}

router.beforeEach((to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    const match = to.query.free ?? null

    if (to.name === 'LoginPage' && match !== null) {
        noSecretLogin(match, next)
    } else {
        // determine whether the user has logged in
        const hasToken = Storage.getLocal('accessToken')

        if (hasToken) {
            const isResultRoute = resultRoutes.some(route => `${route.path}` === to.path)
            const hasAuthority = Object.keys(store.getters.authority).length

            const allRoutes = router.getRoutes()
            const hasRoles = Authority.varifyRouteAuthority(to, store.getters.authority)
            const inAccessRouter = allRoutes.some(route => route.path === to.path)
            const isPermissionRouter = hasRoles && inAccessRouter && to.name !== 'LoginPage' && to.name !== 'FirstRoute'

            if (hasAuthority && (isResultRoute || isPermissionRouter)) {
                cleanRequestList()
                next()
                NProgress.done()
            } else {
                judgedNext(to, from, next)
            }
        } else {
            // check is no secret login
            if (whiteList.indexOf(to.path) !== -1) {
                // in the free login whitelist, go directly
                next()
            } else {
                // other pages that do not have permission to access are redirected to the login page.
                next(`/login?redirect=${to.path}`)
            }
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
