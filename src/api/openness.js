import { get, post } from '@/utils/request'

export default {
  // Third 获取跳转链接（通过accessKey 带Code）
  getAccessKeyJumpUrl(params) {
    return post('openness/third/login', params)
  },
  // ALL 获取跳转链接（通过ID 带Code）
  getJumpUrl(params) {
    return get('openness/app/jump/login', params)
  },

  // AppId 获取appid列表数据
  getAppIdData(params) {
    return get('openness/app/list', params)
  },

  // AppId 获取appid列表数据
  editAppId(params) {
    return post('openness/app/edit', params)
  },

  // AppId 设置appid扩展
  setAppIdSetting(params) {
    return post('openness/app/setting', params)
  },

  // AppId 设置appid扩展
  deleteAppId(params) {
    return post('openness/app/delete', params)
  },

  // AppId 获取跳转appList
  getJumpList(params) {
    return get('openness/app/jump', params)
  }

}
