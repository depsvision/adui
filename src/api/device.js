import { get, post } from '@/utils/request'

export default {
  /*
  ******************************************************************************************************************************************************************************************
    All
  ******************************************************************************************************************************************************************************************
  */

  // All 获取 所有服务列表
  getServiceList(params) {
    return get('device/node/service/list', params)
  },

  // All 停止服务
  stopService(params) {
    return post('device/node/service/stop', params)
  },

  /*
  ******************************************************************************************************************************************************************************************
    Console
  ******************************************************************************************************************************************************************************************
  */

  // Console 获取集群服务状态
  getMasterNodes(params) {
    return get('device/node/list', params)
  },

  // Console 获取集群服务数据
  getMasterStatus(params) {
    return get('device/server/status', params)
  },

  // Console 获取服务状态
  getNodeServiceStatus(params) {
    return get('device/node/service/status', params)
  },

  // Console 获取摄像头点位状态
  getCameraStatus(params) {
    return get('device/camera/status', params)
  },

  // Console 获取摄像头树与演示视频
  getCameraMonitor(params) {
    return get('device/camera/monitor', params)
  },

  // Console 通过id获取视频流url
  getDeviceCameraStream(params) {
    return get('device/camera/stream', params)
  },

  // Console 通过Id关闭摄像头
  closeCamera(params) {
    return get('device/camera/stream/close', params)
  },

  /*
  ******************************************************************************************************************************************************************************************
    CalculateNode
  ******************************************************************************************************************************************************************************************
  */

  // CalculateNode 获取Node数据
  getNodeData(params) {
    return get('device/node/search', params)
  },

  // CalculateNode 保存Node数据
  saveNodeData(params, notMessage) {
    return post('device/node/edit', params, notMessage)
  },

  // CalculateNode 删除Node数据
  deleteNodeData(params) {
    return post('device/node/remove', params)
  },

  // CalculateNode 刷新Node数据
  refreshNode(params) {
    return post('device/corerain/refresh', params)
  },
  // CalculateNode 重启Node
  restartNode(params) {
    return post('device/node/restart', params)
  },

  // CalculateNode 保存service数据
  saveServiceData(params, notMessage) {
    return post('device/node/service/edit', params, notMessage)
  },

  // CalculateNode 获取service数据
  getServiceData(params) {
    return get('device/node/service/search', params)
  },

  // CalculateNode 删除Node数据
  deleteServiceData(params) {
    return post('device/node/service/remove', params)
  },

  // CalculateNode 刷新Service数据
  refreshService(params) {
    return post('device/node/service/refresh', params)
  },

  // CalculateNode 重启节点下所有Service
  restartServices(params) {
    return post('device/node/service/restart', params)
  },

  // CalculateNode 查看Service健康状态详情
  getServiceHealthDetail(params) {
    return get('device/node/service/detail', params)
  },

  // CalculateNode 立即执行健康管理规则
  executeHealthRule(params) {
    return post('device/node/health/execute', params)
  },

  // CalculateNode 启用算法
  startRtiasAlgorithm(params) {
    return post('device/node/service/rtias/start', params)
  },

  // CalculateNode 设置健康管理规则
  setHealthFrequencyRules(params) {
    return post('device/node/health/edit', params)
  },

  /*
  ******************************************************************************************************************************************************************************************
    MonitorPoint
  ******************************************************************************************************************************************************************************************
  */

  // MonitorPoint 获取监控点位树数据
  getCameraTree(params) {
    return get('device/camera/group', params)
  },

  // MonitorPoint 拖拽树节点
  moveTree(params) {
    return post('device/camera/group/move', params)
  },

  // MonitorPoint （新增）编辑 树节点
  addCameraInTree(params) {
    return post('device/camera/group/edit', params)
  },

  // MonitorPoint 删除 树节点
  deleteCameraInTree(params) {
    return post('device/camera/group/delete', params)
  },

  // MonitorPoint 获取 树节点下点位数据(点击)
  searchTreeNodeCamera(params) {
    return get('device/camera/group/sub', params)
  },

  // MonitorPoint 获取 树节点下点位数据(搜索)
  searchCamera(params) {
    return get('device/camera/search', params)
  },

  // MonitorPoint 抓取图片
  getCameraPicture(params) {
    return post('device/camera/picture', params)
  },

  // MonitorPoint 编辑点位信息
  editCamera(params) {
    return post('device/camera/edit', params)
  },

  /*
  ******************************************************************************************************************************************************************************************
    videoStreamAnalysis
  ******************************************************************************************************************************************************************************************
  */

  // videoStreamAnalysis 保存抓图信息
  saveDragPicture(params) {
    return post('device/camera/edit/picture', params)
  },

  // MonitorPoint 删除点位
  deleteCamera(params) {
    return post('device/camera/remove', params)
  },

  // MonitorPoint 刷新点位信息
  cameraRefresh(params) {
    return post('device/camera/refresh', params)
  },

  // MonitorPoint 导出点位信息
  exportCamera(params) {
    return post('device/camera/export', params)
  },

  // MonitorPoint 导入点位信息
  importCamera(params) {
    return post('device/camera/import', params)
  },

  // MonitorPoint 保存过滤图片信息
  saveFilterPicture(params) {
    return post('device/camera/filter/edit', params)
  },

  // MonitorPoint 获取视频源数据
  getVideoSourceData(params) {
    return get('device/camera/source', params)
  },

  // MonitorPoint 添加视频源数据
  addVideoSourceData(params) {
    return post('device/camera/source/edit', params)
  },

  // MonitorPoint 删除视频源数据
  deleteVideoSourceData(params) {
    return post('device/camera/source/remove', params)
  },

  // MonitorPoint 刷新视频源树
  refreshVideoSourceData(params) {
    return post('device/camera/source/refresh', params)
  },

  /*
  ******************************************************************************************************************************************************************************************
    VideoRecording
  ******************************************************************************************************************************************************************************************
  */

  // VideoRecording 获取分组下摄像头视频录制状态信息
  getCamerasRecordStatus(params) {
    return get('device/camera/record/sub', params)
  },

  // VideoRecording 获取分组下摄像头视频录制状态信息
  getCameraRecordDetail(params) {
    return get('device/camera/record/detail', params)
  },

  // VideoRecording 获取录像设置基础信息
  getVideoRecordSetting(params) {
    return get('device/camera/record/setting', params)
  },

  // VideoRecording 设置录像设置监控设备
  editVideoRecordCamera(params) {
    return post('device/camera/record/start', params)
  },

  // VideoRecording 设置录像设置自动清理数据
  editVideoRecordAutoClean(params) {
    return post('device/camera/record/setting', params)
  },

  // VideoRecording 删除制定日期键的录制视频
  deleteVideoRecord(params) {
    return post('device/camera/record/delete', params)
  }
}
