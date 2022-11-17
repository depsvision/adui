import { get, post } from '@/utils/request'

export default {
  // CloudCollaboration 获取云边协同配置
  getCloudConfig() {
    return get('cloud/frp')
  },

  // CloudCollaboration  新增（编辑）云边协同配置
  editCloudConfig(params) {
    return post('cloud/frp/edit', params)
  },

  // CloudCollaboration  删除云边协同配置
  deleteCloudConfig(params) {
    return post('cloud/frp/delete', params)
  },

  // CloudCollaboration  获取云边协同同步数据
  getCloudData(params) {
    return get('cloud/frp/data', params)
  },

  // CloudCollaboration  同步边缘环境到边缘端
  synchronizeCloudDataToEdge(params) {
    return post('cloud/frp/data/issued', params)
  },

  // CloudCollaboration  增加AI计算服务数据
  addAiServiceData(params) {
    return post('cloud/frp/data/edit', params)
  },

  // CloudCollaboration  增加AI监控点位数据
  addAiPointData(params) {
    return post('cloud/frp/data/edit', params)
  },

  // CloudCollaboration  修改AI计算服务平台端口
  editAiServicePlatPort(params) {
    return post('cloud/frp/data/port/edit', params)
  },

  // CloudCollaboration  修改AI监控点位端口
  editAiPointPlatPort(params) {
    return post('cloud/frp/data/port/edit', params)
  },

  // CloudCollaboration  新增（编辑）其他地址数据
  addAiOtherData(params) {
    return post('cloud/frp/service/edit', params)
  },

  // CloudCollaboration  删除其他地址数据
  deleteAiOtherData(params) {
    return post('cloud/frp/service/delete', params)
  }
}
