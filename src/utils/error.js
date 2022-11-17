import { ElMessageBox as MessageBox } from 'element-plus'
import store from '@/store'

const apiwhiteList = ['openness/third/login'] // no logout whitelist

export const handleErrorCode = (code, url) => {
  switch (code) {
    case 2001:
      !apiwhiteList.includes(url) && handleLogined()
      break
    case 2008:
      handleTokenInvalid()
      break
    default:
      break
  }
}

const handleLogined = () => {
  let reloadTimer = setTimeout(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  }, 5000)

  MessageBox('已检测到您的账户在其他设备登录，该设备账号已登出', '账号已登出', {
    confirmButtonText: '重新登录',
    cancelButtonText: '关闭',
    type: 'warning'
  }).then(() => {
    clearTimeout(reloadTimer)
    reloadTimer = null

    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  }).catch(() => {
    clearTimeout(reloadTimer)
    reloadTimer = null

    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })
}

const handleTokenInvalid = () => {
  let reloadTimer = setTimeout(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  }, 5000)

  MessageBox('身份验证信息已过期，请重新登录', '账号已登出', {
    confirmButtonText: '重新登录',
    cancelButtonText: '关闭',
    type: 'warning'
  }).then(() => {
    clearTimeout(reloadTimer)
    reloadTimer = null

    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  }).catch(() => {
    clearTimeout(reloadTimer)
    reloadTimer = null

    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })
}
