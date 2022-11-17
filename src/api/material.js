import { get, post } from '@/utils/request'

export default {

  // AlgorithmEnhancement 获取算法增强素材分组
  getMaterialGroup() {
    return get('material/search')
  },

  // AlgorithmEnhancement 新增（编辑）算法增强素材分组
  editMaterialGroup(params) {
    return post('material/edit', params)
  },

  // AlgorithmEnhancement 新增（编辑）算法增强素材分组
  removeMaterialGroup(params) {
    return post('material/delete', params)
  },

  // AlgorithmEnhancement 获取分组详情数据
  getMaterialData(params) {
    return get('material/detail', params)
  },

  // AlgorithmEnhancement 增加标签
  addMaterialTag(params) {
    return post('material/tag/edit', params)
  },

  // AlgorithmEnhancement 删除标签
  removeMaterialTag(params) {
    return post('material/tag/delete', params)
  },

  // AlgorithmEnhancement 查询分组下图片
  getMaterialPicture(params) {
    return get('material/tag/detail', params)
  },

  // AlgorithmEnhancement 删除合集内图片
  removeMaterialPicture(params) {
    return post('material/picture/delete', params)
  },

  // AlgorithmEnhancement 合集图片标记
  markMaterialPicture(params) {
    return post('material/picture/tag', params)
  },

  // AlgorithmEnhancement 获取素材下发节点列表
  getMaterialNode(params) {
    return get('material/issue/list', params)
  },

  // AlgorithmEnhancement 素材下发
  synchronizeMaterialPicture(params) {
    return post('material/issue', params)
  },

  // AlgorithmEnhancement 图片裁剪
  cutMaterialPicture(params) {
    return post('material/picture/cut', params)
  }
}
