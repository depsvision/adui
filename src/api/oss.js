import { get, post } from '@/utils/request'

export default {
  // OSS 获取对象存储服务列表
  getOssList(params) {
    return get('oss/list', params)
  },

  // OSS 编辑对象存储服务
  editOssService(params) {
    return post('oss/edit', params)
  },

  // OSS 删除对象存储服务
  deleteOssService(params) {
    return post('oss/delete', params)
  },

  // OSS 验证对象存储服务
  testOssService(params, notMessage) {
    return post('oss/test', params, notMessage)
  }

}
