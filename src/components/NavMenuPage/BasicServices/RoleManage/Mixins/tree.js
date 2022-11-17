import user from '@/api/user'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      currentNode: null,
      tree: '',
      currentRoleInfo: null
    }
  },
  methods: {
    treeEvent(params) {
      switch (params.eName) {
        case 'removeNode':
          this.removeNode(params.arg[0])
          break
        case 'endDrag':
          this.dragNodeEnd(params.arg)
          break
        case 'node-click':
          this.clickNode(params.arg[0])
          break
        default:
      }
    },
    clickNode(currentNode) {
      this.searchValue = ''

      if (currentNode) {
        this.currentNode = currentNode
        this.tree.setCurrentKey(this.currentNode.groupId)
        this.searchRolesWithNode(currentNode)
      } else {
        this.currentNode = this.tree.getCurrentNode()
        this.searchRolesWithNode(this.currentNode)
      }

      this.tree.setCurrentKey(this.currentNode.groupId)

      const node = this.tree.getNode(this.currentNode)

      if (typeof node.parent.key === 'undefined') {
        node.expand(null, true)
      } else {
        node.parent.expand(null, true)
      }

      this.getRoleData()

      this.setButtonsDisabled()
    },
    getRoleData() {
      if (this.currentNode.groupId !== 0 && this.currentNode.groupId !== 1) {
        user.getRoleInfo({ roleId: this.currentNode.groupId })
          .then(res => {
            const { data } = res

            this.dealRoleData(data)
          })
      }
    },
    dealRoleData(value) {
      const data = this.currentRoleInfo = deepClone(this.roleDialogTemplate.option.data)
      data.name = value.name

      Object.keys(value.manage).forEach(key => {
        const authority = value.manage[key]
        if ((authority & 1) === 1) {
          data.authority[key].push(1)
        }

        if ((authority & 2) === 2) {
          data.authority[key].push(2)
        }
      })

      const radioTransform = {
        task: 'taskGroup',
        log: 'logGroup',
        task_group: 'linkageGroup',
        image_task: 'imageGroup',
        material: 'materialGroup'
      }

      const radioRole = Object.keys(radioTransform)

      radioRole.forEach(radio => {
        if (!value.data[radio].dir.length) {
          data.authority[radioTransform[radio]] = 1
        } else {
          data.authority[radioTransform[radio]] = value.data[radio].dir[0].groupId
        }
      })

      Object.keys(value.data).forEach(key => {
        if (!radioRole.includes(key)) {
          const realyKey = key === 'camera' ? 'point' : key

          value.data[key].dir && value.data[key].dir.forEach(item => {
            data.authority[realyKey + 'Group'].push({
              label: item.name,
              groupId: item.groupId,
              tagType: 'tree',
              tagSvg: ['all-line', 'file-line', 'department-line', 'role-line'][['node', 'point', 'user', 'role'].indexOf(realyKey)],
              tagColor: 'blue',
              nodeKey: 'groupId'
            })
          })

          value.data[key].point && value.data[key].point.forEach(item => {
            data.authority[realyKey + 'Group'].push({
              label: item.name,
              id: item.id,
              tagType: 'node',
              tagSvg: ['node', 'webcam-line', 'people-line'][['node', 'point', 'user'].indexOf(realyKey)],
              tagColor: realyKey === 'node' ? 'green' : 'blue',
              nodeKey: 'id'
            })
          })
        }
      })
    },
    setButtonsDisabled() {
      if (this.currentNode.groupId === 0 || this.currentNode.groupId === 1) {
        this.$set(this.dividerButtonData.buttons[0], 'disabled', true)
        this.$set(this.dividerButtonData.buttons[1], 'disabled', true)
      } else {
        this.$set(this.dividerButtonData.buttons[0], 'disabled', false)
        this.$set(this.dividerButtonData.buttons[1], 'disabled', false)
      }
    },
    searchRoleTree() {
      return new Promise((resolve, reject) => {
        this.treeLoading = true
        user.searchRoleTree()
          .then(res => {
            const { treeData } = res.data

            treeData[0].children.forEach(item => {
              if (item.groupId === 1) {
                item.disabled = true
              }
            })

            this.roleData = treeData

            this.roleTreeOption.data = treeData
            this.treeLoading = false

            resolve()
          })
          .catch(() => {
            this.treeLoading = false

            reject()
          })
      })
    },
    dragNodeEnd(arg) {
      const node = this.tree.getNode(arg[0].data.groupId)
      const defaultParams = {
        id: node.data.groupId,
        parentId: node.parent.data.groupId,
        upId: (node.previousSibling && node.previousSibling.data.groupId !== 1) ? node.previousSibling.data.groupId : null
      }
      user.moveRoleTree(defaultParams).then(() => {
        this.afterChangeNode()
      }).catch(() => {
        this.afterChangeNode()
      })
    },
    removeNode(node) {
      this.$prompt('请输入“删除”二字以确认进行删除角色操作，该操作将删除角色下所有用户权限且无法恢复，请谨慎操作', '删除角色', {
        confirmButtonText: '确定',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        customClass: 'dialog--mini',
        inputValidator: (string) => {
          if (string !== '删除') {
            return '文本不一致'
          } else {
            return true
          }
        },
        inputPlaceholder: '输入“删除”以执行该操作'
      }).then(async() => {
        const params = {
          roleList: [node.data.groupId]
        }
        const res = await user.deleteRoleInTree(params).catch(() => {
          this.$messageInfo({
            type: 'error',
            message: '删除失败'
          })
        })
        if (!res) return

        const requestInfo = res.requestInfo
        if (requestInfo.flag) {
          this.$messageInfo({
            type: 'success',
            message: '删除成功'
          })

          node.remove()

          this.afterChangeNode()
        } else {
          this.$messageInfo({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    async afterChangeNode() {
      await this.searchRoleTree()

      this.$nextTick(() => {
        this.clickNode()
      })
    }
  }
}
