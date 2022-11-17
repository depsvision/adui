import user from '@/api/user'

export default {
  data() {
    return {
      currentNode: null,
      tree: ''
    }
  },
  methods: {
    treeEvent(params) {
      switch (params.eName) {
        case 'appendNode':
          this.dealNode(params.arg[0], 0)
          break
        case 'editNode':
          this.dealNode(params.arg[0], 1)
          break
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
        this.searchUsersWithNode(currentNode)
      } else {
        this.currentNode = this.tree.getCurrentNode()
        this.searchUsersWithNode(this.currentNode)
      }

      this.tree.setCurrentKey(this.currentNode.groupId)

      const node = this.tree.getNode(this.currentNode)

      if (typeof node.parent.key === 'undefined') {
        node.expand(null, true)
      } else {
        node.parent.expand(null, true)
      }
    },
    searchUserTree() {
      return new Promise((resolve, reject) => {
        this.treeLoading = true
        user.searchUserTree()
          .then(res => {
            const { treeData } = res.data

            treeData[0].disabled = true
            treeData[0].children.forEach(item => {
              if (item.groupId === -1) {
                item.disabled = true
              }
            })

            this.userTreeOption.data = treeData
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
        upId: (node.previousSibling && node.previousSibling.data.groupId !== -1) ? node.previousSibling.data.groupId : null
      }
      user.moveUserTree(defaultParams).then(() => {
        this.afterChangeNode()
      }).catch(() => {
        this.afterChangeNode()
      })
    },
    async dealNode(node, status) {
      const params = {}
      let messagge = ''
      if (status) {
        params.name = node.data.label
        params.id = node.data.groupId
        messagge = '编辑分组'
      } else {
        params.name = node.data.label
        params.parentId = node.parent.data.groupId
        messagge = '新增分组'
      }
      const res = await user.addUserInTree(params).catch(() => {
        !status ? node.remove() : ''
        this.$messageInfo({
          message: messagge + '失败',
          type: 'error'
        })
      })

      if (!res) return

      const requestInfo = res.requestInfo
      if (requestInfo.flag) {
        !status && (node.data.groupId = res.data.groupId)

        this.$messageInfo({
          message: messagge + '成功',
          type: 'success'
        })
      } else {
        this.$messageInfo({
          message: messagge + '失败',
          type: 'error'
        })
      }
    },
    removeNode(node) {
      this.$confirm('删除后相关点位信息将会保留在“未分组”层级下<br />确认要删除当前分组吗?', '删除确认', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'dialog--mini',
        type: 'warning'
      }).then(async() => {
        const params = {
          id: node.data.groupId
        }
        const res = await user.deleteUserInTree(params).catch(() => {
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
      await this.searchUserTree()

      this.$nextTick(() => {
        this.clickNode()
      })
    }
  }
}
