import { get, post } from '@/utils/request'

export default {
  // AlarmVoice 获取报警语音，报警弹窗状态
  getAlarmVoiceNotify(params) {
    return get('setting/alert/notify/status', params)
  },

  // AlarmVoice 设置报警语音，报警弹窗状态
  setAlarmVoiceNotify(params) {
    return post('setting/alert/notify/edit', params)
  },

  // AlarmVoice 获取算法语音数据
  getAlarmVoiceData(params) {
    return get('setting/alert/list', params)
  },

  // AlarmVoice 替换报警语音
  replaceAlarmVoice(params) {
    return post('setting/alert/edit', params)
  },

  // AlarmVoice 删除报警语音
  deleteAlarmVoice(params) {
    return post('setting/alert/delete', params)
  },

  // Console 获取logo，平台信息
  getLogoIco(params) {
    return get('setting/server/info', params)
  },

  // SystemSetting 设置系统名称
  setSystemName(params) {
    return post('setting/server/name', params)
  },

  // SystemSetting 获取CRCS,CRIP后台版本信息
  getSystemVision(params) {
    return get('setting/server/version', params)
  },

  // SystemSetting 获取免密登录信息
  getNosecret(params) {
    return get('setting/password/free', params)
  },

  // SystemSetting 修改免密登陆信息
  setNosecret(params) {
    return post('setting/password/free/edit', params)
  }
}
