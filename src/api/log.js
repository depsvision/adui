import { get, post, fetchApi } from '@/utils/request'

export default {

  // console 获取全时段报警统计
  getAlarmStatisticsData() {
    return get('log/annual')
  },

  // console 获取全时段报警统计
  getRealtime(params) {
    return get('log/realtime', params)
  },

  // AlgorithmLog 获取算法日志数据
  searchException(params) {
    return get('log/search', params)
  },

  // AlgorithmLog 获取算法日志页面自动清理数据
  getLogAutoClean(params) {
    return get('log/auto/clean/config', params)
  },

  // AlgorithmLog 导出日志
  exportLogs(url, params, option) {
    return fetchApi(url, params, option)
  },

  // AlgorithmLog 手动清理日志
  deleteLog(params) {
    return post('log/delete', params)
  },

  // AlgorithmLog 设置自动清理日志
  postAutoClean(params) {
    return post('log/auto/clean', params)
  },

  // AlgorithmLog 获取图片算法日志数据
  getLogData(params) {
    return get('log/image/search', params)
  }
}
