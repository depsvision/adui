import { get, post } from '@/utils/request'

export default {
  // All 用户登出
  userLogout(params) {
    return post('user/logout', params)
  },

  // All 用户登录
  userLogin(params, notMessage) {
    return post('user/login', params, notMessage)
  },

  // All 获取用户权限
  userGetAuthority(params) {
    return get('user/limit', params)
  },

  // All 免密登陆
  noSecretLogin(params) {
    return get('user/free/login', params)
  },

  // UserManage 获取用户树形数据
  searchUserTree(params) {
    return get('user/department', params)
  },

  // UserManage 拖拽树节点
  moveUserTree(params) {
    return post('user/department/move', params)
  },

  // UserManage （新增）编辑 树节点
  addUserInTree(params) {
    return post('user/department/edit', params)
  },

  // UserManage 删除 用户树节点
  deleteUserInTree(params) {
    return post('user/department/delete', params)
  },

  // MonitorPoint 获取 树节点下用户数据(点击)
  searchTreeNodeUser(params) {
    return get('user/department/sub', params)
  },

  // UserManage 获取 树节点下用户数据(搜索)
  searchUser(params) {
    return get('user/search', params)
  },

  // UserManage 保存（编辑） 用户数据
  userEdit(params) {
    return post('user/edit', params)
  },

  // UserManage 删除用户
  userRemove(params) {
    return post('user/remove', params)
  },

  // UserManage 禁用用户
  userBan(params) {
    return post('user/black', params)
  },

  // UserManage 移动用户到其他部门
  userMove(params) {
    return post('user/move', params)
  },

  // UserManage 导出用户
  userExport(params) {
    return post('user/export', params)
  },

  // UserManage 导入用户
  userImport(params) {
    return post('user/import', params)
  },

  // UserManage 提取单个用户特征
  extractFeatures(params) {
    return post('user/face/extract/single', params)
  },

  // UserManage 提取所有用户特征
  extractAllFeatures(params) {
    return post('user/face/extract', params)
  },

  // UserManage 新增用户标签
  addUserTag(params) {
    return post('user/face/tag/edit', params)
  },

  // UserManage 删除用户标签
  deleteUserTag(params) {
    return post('user/face/tag/delete', params)
  },

  // UserManage 获取人脸标签
  getFaceTag() {
    return get('user/face/tag')
  },

  // UserManage 修改人脸特征管理配置
  changeFaceConfig(params) {
    return post('user/face/config', params)
  },

  // RoleManage 获取角色树形数据
  searchRoleTree(params) {
    return get('user/role', params)
  },

  // RoleManage 获取 树节点下角色数据(搜索)
  searchTreeNodeRole(params) {
    return get('user/role/sub', params)
  },

  // RoleManage 删除角色树节点
  deleteRoleInTree(params) {
    return post('user/role/delete', params)
  },

  // RoleManage 获取角色权限数据
  getRoleInfo(params) {
    return get('user/role/info', params)
  },

  // RoleManage 保存（编辑） 角色数据
  addRoleInTree(params) {
    return post('user/role/edit', params)
  },

  // RoleManage 添加用户到角色
  userRoleAddUser(params) {
    return post('user/role/add/user', params)
  },

  // RoleManage 将用户从角色移除
  userRoleRemove(params) {
    return post('user/role/remove', params)
  },

  // RoleManage 修改用户密码
  userResetPassword(params) {
    return post('user/reset/password', params)
  }

}
