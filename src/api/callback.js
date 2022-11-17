import { get, post, fetchApi } from '@/utils/request'

export default {
  // CallbackOutput 获取数据
  getCallbackList(params) {
    return get('callback/list', params)
  },

  // CallbackOutput 新增/编辑数据
  saveCallbackData(params) {
    return post('callback/edit', params)
  },

  // CallbackOutput 删除数据
  deleteCallbackData(params) {
    return post('callback/remove', params)
  },

  // CallbackOutput 获取测试模板
  getCallbackTemplate(params) {
    return get('callback/template_data', params)
  },

  // CallbackOutput 测试参数
  testCallback(params) {
    return post('callback/test', params)
  },

  // PushLog 获取（查询）数据
  searchPushLog(params) {
    return get('callback/log/search', params)
  },

  // PushLog 导出 导出数据
  exportPushLog(params, option) {
    return fetchApi('callback/log/export', params, option)
  },

  // PushLog 查询智慧云厅是否开启报警
  getCloudAlarmOpen(notMessage) {
    return get('callback/log/is_shuadh_alarm_open', {}, notMessage)
  },

  // PushLog 查询智慧云厅日志表单数据
  searchCloudLogData(params) {
    return get('callback/log/shuadh_search', params)
  },

  // PushLog 查询加油站是否开启报警
  getOilAlarmOpen(notMessage) {
    return get('callback/log/is_oil_alarm_open', {}, notMessage)
  },

  // PushLog 查询加油站日志表单数据
  searchOilLogData(params) {
    return get('callback/log/oil_log_search', params)
  },

  // PushLog 加油站 报警 执行 销警
  revokeOilAlarm(params) {
    return post('callback/log/cancel_oil_alarm', params)
  }

}
