import { get, post, put, deleteApi } from '@/utils/request'

export default {
  // All 获取异常类型数据
  taskSub(params) {
    return get('task/sub', params)
  },

  // console 获取任务启用状态
  taskStatus(params) {
    return get('task/status', params)
  },

  // VideoStreamAnalysis 获取 task 列表数据
  getTaskList(params) {
    return get('task/search', params)
  },

  // VideoStreamAnalysis 保存 task 数据
  saveTaskData(params) {
    return post('task/edit', params)
  },

  // VideoStreamAnalysis 获取 task 详情数据
  getTaskDetail(params) {
    return get('task/detail', params)
  },

  // VideoStreamAnalysis 删除 task 详情数据
  taskRemove(params) {
    return post('task/remove', params)
  },

  // VideoStreamAnalysis 修改 task 名称
  editTaskName(params) {
    return post('task/edit/name', params)
  },

  // VideoStreamAnalysis 获取 task 状态
  getTaskCheck(params) {
    return get('task/start/check', params)
  },

  // VideoStreamAnalysis 启用 task
  taskStart(params, notMessage) {
    return post('task/start', params, notMessage)
  },

  // VideoStreamAnalysis 停用 task
  taskStop(params) {
    return post('task/stop', params)
  },

  // VideoStreamAnalysis 编辑 task 启用时间
  editEnableTime(params) {
    return post('task/edit/enableTime', params)
  },

  // VideoStreamAnalysis 编辑 task 健康等级
  editHealthLevel(params) {
    return post('task/edit/health', params)
  },

  // VideoStreamAnalysis  获取 task 算法点位配置
  getTaskConfig(params) {
    return get('task/detail/config', params)
  },

  // VideoStreamAnalysis  修改任务算法
  editTaskAlgorithm(params) {
    return post('task/edit/config/algorithm', params)
  },

  // VideoStreamAnalysis  修改任务算法点位
  editTaskAlgorithmPoint(params) {
    return post('task/edit/config/camera', params)
  },

  // VideoStreamAnalysis  修改任务算法点位阈值
  editTaskAlgorithmPointThreshold(params) {
    return post('task/edit/config/threshold', params)
  },

  // VideoStreamAnalysis  修改任务算法点位过滤图片
  editTaskAlgorithmPointFilter(params) {
    return post('task/edit/config/filter', params)
  },

  // VideoStreamAnalysis  修改任务算法点位roi
  editTaskAlgorithmPointRoi(params) {
    return post('task/edit/config/roi', params)
  },

  // VideoStreamAnalysis  修改任务算法点位扩展字段
  editTaskAlgorithmPointOption(params) {
    return post('task/edit/config/option', params)
  },

  // VideoStreamAnalysis  修改任务算法点位点位解码
  editTaskAlgorithmPointFrame(params) {
    return post('task/edit/config/decode', params)
  },

  // VideoStreamAnalysis  修改任务算法点位精细化开关
  editTaskAlgorithmPointEnable(params) {
    return post('task/edit/config/enable', params)
  },

  // VideoStreamAnalysis  导入 task 算法点位配置
  importTaskConfig(params) {
    return post('task/import', params)
  },

  // VideoStreamAnalysis  算法点位配置 算法增强 算法
  setMaterialAlgorithm(params) {
    return post('task/edit/material/algorithm', params)
  },

  // VideoStreamAnalysis  算法点位配置 算法增强 合集
  setTaskConfigMaterial(params) {
    return post('task/edit/material', params)
  },

  // VideoStreamAnalysis  应用算法日志过滤
  setAlgorithmLogFilter(params) {
    return post('task/edit/log/filter', params)
  },

  // VideoStreamAnalysis  导出 task 配置
  exportTaskConfig(params) {
    return post('task/export', params)
  },

  // VideoStreamAnalysis  编辑 analysis 分析配置
  editAnalysisConfig(params) {
    return post('task/edit/analysis', params)
  },

  // VideoStreamAnalysis  编辑 service 自动调度
  editServiceAutoSchedule(params) {
    return post('task/edit/service', params)
  },

  // VideoStreamAnalysis 获取 callback config 数据
  getTaskCallbackConfig(params) {
    return get('task/detail/callback', params)
  },

  // VideoStreamAnalysis 编辑 callback config 数据
  editCallbackConfig(params) {
    return post('task/edit/callback', params)
  },

  // VideoStreamAnalysis 删除 callback config 数据
  removeCallbackConfig(params) {
    return post('task/remove/callback', params)
  },

  // VideoStreamAnalysis 查询 cameraList 帧率方式数据
  getTaskFrameData(params) {
    return post('task/detail/camera', params)
  },

  // VideoStreamAnalysis 编辑算法点位单条转发数据
  editPush(params) {
    return post('task/edit/push', params)
  },

  // VideoStreamAnalysis 编辑算法点位单条推流
  editForward(params) {
    return post('task/edit/forward', params)
  },

  // VideoStreamAnalysis 获取任务启动状态
  getRunningStatus(params) {
    return get('task/running/status', params)
  },

  // VideoStreamAnalysis 获取任务健康状态
  getTaskHealthStatus(params) {
    return get('task/health/status', params)
  },

  // VideoStreamAnalysis 编辑视频片段启动状态
  editVideoClipStatus(params) {
    return post('task/video/enable', params)
  },

  // VideoStreamAnalysis 编辑视频片段间隔与时长
  editVideoClipConfig(params) {
    return post('task/video/config', params)
  },

  // AlgorithmLinkage 获取算法联动任务列表
  getAlgorithmLinkageList(params) {
    return get('task/group/search', params)
  },

  // AlgorithmLinkage 新增算法联动任务
  addAlgorithmLinkage(params) {
    return post('task/group/edit', params)
  },

  // AlgorithmLinkage 启用算法联动任务
  algorithmLinkageStart(params, notMessage) {
    return post('task/group/start', params, notMessage)
  },

  // AlgorithmLinkage 停用算法联动任务
  algorithmLinkageStop(params) {
    return post('task/group/stop', params)
  },

  // AlgorithmLinkage 获取算法联动详情
  getAlgorithmLinkageDetail(params) {
    return get('task/group/detail', params)
  },

  // AlgorithmLinkage 删除算法联动任务
  deleteAlgorithmLinkage(params) {
    return post('task/group/delete', params)
  },

  // AlgorithmLinkage 编辑算法联动callback推送
  editAlgorithmLinkageCallback(params) {
    return post('task/group/edit/callback', params)
  },

  // AlgorithmLinkage 编辑一级任务信息
  editFirstLevel(params) {
    return post('task/group/edit/source', params)
  },

  // AlgorithmLinkage 编辑联动算法类型
  editLinkageAlgorithm(params) {
    return post('task/group/edit/scene', params)
  },

  // AlgorithmLinkage 编辑人脸特征提取、鞋油任务场景配置
  editSceneAssociate(params) {
    return post('task/group/edit/associate', params)
  },

  // AlgorithmLinkage 刷新callback数据
  refreshLinkageCallback(params) {
    return get('task/group/detail/callback', params)
  },

  // AlgorithmLinkage 删除 callback 数据
  removeLinkageCallback(params) {
    return post('task/group/remove/callback', params)
  },

  // MailService 获取邮件服务
  getMailService(params) {
    return get('task/mail', params)
  },

  // MailService 新建邮件服务
  addMailService(params) {
    return post('task/mail', params)
  },

  // MailService 修改邮件服务
  editMailService(params, data) {
    return put('task/mail', params, data)
  },

  // MailService 删除邮件服务
  deleteMailService(params) {
    return deleteApi('task/mail', params)
  },

  // MailService 获取邮件设置
  getMailSetting(params) {
    return get('email/config', params)
  },

  // MailService 设置邮件设置
  setMailSetting(data) {
    return put('email/config', {}, data)
  },

  // PushLog-MailLog 获取邮件日志
  getMailLog(params) {
    return get('email/report', params)
  },

  // PictureAnalysis 获取图片分析数据列表
  getImageList(params) {
    return get('task/image/search', params)
  },

  // PictureAnalysis 获取图片分析详情
  getImageDetail(params) {
    return get('task/image/detail', params)
  },

  // PictureAnalysis 删除图片分析详情数据
  imageTaskRemove(params) {
    return post('task/image/remove', params)
  },

  // PictureAnalysis 新增图片分析任务
  addImageTask(params) {
    return post('task/image/edit', params)
  },

  // PictureAnalysis 修改图片分析名称
  editImageTaskName(params) {
    return post('task/image/edit/name', params)
  },

  // PictureAnalysis 启用图片分析任务
  startImageTask(params, notMessage) {
    return post('task/image/start', params, notMessage)
  },

  // PictureAnalysis 停用图片分析任务
  stopImageTask(params) {
    return post('task/image/stop', params)
  },

  // PictureAnalysis 新增API黑名单
  addApiBlackList(params) {
    return post('task/image/edit/blacklist', params)
  },

  // PictureAnalysis 删除API黑名单
  deleteApiBlackList(params) {
    return post('task/image/remove/blacklist', params)
  },

  // PictureAnalysis 编辑并发限制
  editImageConcurrent(params) {
    return post('task/image/edit/concurrent', params)
  },

  // PictureAnalysis 测试图片分析
  testImageAnalysis(params) {
    return post('task/image/inference', params)
  },

  // PictureAnalysis 修改分析服务节点
  editImageService(params) {
    return post('task/image/edit/service', params)
  },

  // PictureAnalysis 修改分析服务算法类型
  editImageAlgorithm(params) {
    return post('task/image/edit/algorithm', params)
  },

  // PictureAnalysis  设置算法增强 算法
  setImageMaterialAlgorithm(params) {
    return post('task/image/edit/material/algorithm', params)
  },

  // PictureAnalysis  设置算法增强 合集
  setImageMaterial(params) {
    return post('task/image/edit/material', params)
  },

  // PictureAnalysis 设置人脸联动 启用状态、比对对象
  setFaceLinkage(params) {
    return post('task/image/edit/recognize', params)
  },

  // PictureAnalysis 编辑原接口返回
  editImageBack(params) {
    return post('task/image/edit/back', params)
  },

  // PictureAnalysis 编辑算法日志/本机记录
  editImageLog(params) {
    return post('task/image/edit/log', params)
  },

  // PictureAnalysis 编辑图片分析callback推送
  editImageCallback(params) {
    return post('task/image/edit/callback', params)
  },

  // PictureAnalysis 删除图片分析callback推送
  removeImageCallback(params) {
    return post('task/image/remove/callback', params)
  },

  // PictureAnalysis 获取图片分析 callback 数据
  getImageCallback(params) {
    return get('task/image/detail/callback', params)
  },

  // PictureAnalysis 设置图片分析输入方式
  setPictureInputType(params) {
    return post('task/image/edit/input', params)
  },

  // PictureAnalysis 设置图片分析 SDK 抓图参数
  setPictureSdkParams(params) {
    return post('task/image/edit/capture', params)
  },

  // PictureAnalysis 获取 SDK 算法及点位配置
  getPictureSdkConfig(params) {
    return get('task/image/detail/config', params)
  },

  // PictureAnalysis  修改 图片分析 任务算法
  editPictureAlgorithm(params) {
    return post('task/image/edit/config/algorithm', params)
  },

  // PictureAnalysis  修改 图片分析 算法点位
  editPictureAlgorithmPoint(params) {
    return post('task/image/edit/config/camera', params)
  },

  // PictureAnalysis  修改 图片分析 算法点位精细化开关
  editPictureAlgorithmPointEnable(params) {
    return post('task/image/edit/config/enable', params)
  },

  // PictureAnalysis  修改 图片分析 算法点位阈值
  editPictureAlgorithmPointThreshold(params) {
    return post('task/image/edit/config/threshold', params)
  },

  // PictureAnalysis  修改 图片分析 算法点位扩展字段
  editPictureAlgorithmPointOption(params) {
    return post('task/image/edit/config/option', params)
  },

  // PictureAnalysis  修改 图片分析 算法点位roi
  editPictureAlgorithmPointRoi(params) {
    return post('task/image/edit/config/roi', params)
  }
}
