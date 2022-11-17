import device from '@/api/device'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      currentNode: null,
      tree: '',
      systemTree: [],
      isSystemTree: true,
      videoSource: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          form: [
            {
              label: '',
              type: 'FormTable',
              loading: false,
              tableData: [],
              containerClass: ['inner-form-table'],
              option: {
                maxHeight: 236
              },
              header: [
                {
                  width: 110,
                  align: 'left',
                  fixed: 'right',
                  label: '操作',
                  type: 'buttonGroup',
                  buttonGroup: {
                    buttons: [
                      {
                        label: '编辑',
                        value: 'editSource',
                        type: 'text'
                      },
                      {
                        label: '删除',
                        value: 'deleteSource',
                        type: 'text',
                        popoverclass: 'is-danger',
                        tip: '删除视频源后，所有关联的点位也将会被删除，请谨慎操作！',
                        svgIcon: 'warning',
                        width: 400
                      }
                    ]
                  }
                },
                {
                  minWidth: 140,
                  align: 'left',
                  label: '名称',
                  prop: 'name',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  width: 120,
                  align: 'left',
                  label: '视频源',
                  prop: 'sourceString',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  minWidth: 200,
                  align: 'left',
                  label: '请求地址',
                  prop: 'address',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  width: 150,
                  align: 'left',
                  label: '自动刷新',
                  prop: 'autoRefreshString',
                  type: 'span'
                }
              ],
              top: {
                type: 'ButtonGroup',
                disabled: false,
                buttons: [
                  {
                    label: '新增',
                    value: 'addSource',
                    type: 'text',
                    disabled: false,
                    class: 'is-black',
                    svgIconLeft: 'plus'
                  }
                ]
              }
            }
          ]
        }
      },
      sourceAction: 'add',
      sourceOptionDia: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            platform: 1,
            name: '',
            address: '',
            username: '',
            password: '',
            deptId: '',
            auto: false,
            refresh: null,
            autoRefreshTime: '',
            tryRefreshTimes: null,
            autoUpdateTask: true
          },
          rule: {
            platform: [
              { required: true, message: '请选择来源', trigger: ['change'] }
            ],
            name: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ],
            address: [
              { required: true, message: '请输入地址', trigger: ['blur', 'change'] }
            ],
            username: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ],
            password: [
              { required: true, message: '请输入地址', trigger: ['blur', 'change'] }
            ]
          },
          form: [],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'buttonScope'
    ])
  },
  watch: {
    'sourceOptionDia.option.data.platform': {
      handler(val) {
        const option = this.sourceOptionDia.option

        option.data.refresh = null

        option.data.autoRefreshTime = ''
        option.data.tryRefreshTimes = null

        if (val === 1) {
          option.form = [
            {
              type: 'selectAssembly',
              label: '来源',
              prop: 'platform',
              size: 'medium',
              placeholder: '视频源',
              option: [
                {
                  label: 'CRMP',
                  value: 1
                },
                {
                  label: '沃家神眼',
                  value: 2
                }
              ]
            },
            {
              type: 'inputAssembly',
              label: '名称',
              prop: 'name',
              placeholder: '视频源名称'
            },
            {
              type: 'inputAssembly',
              label: '地址',
              prop: 'address',
              placeholder: '请求地址'
            },
            {
              type: 'switchAssembly',
              label: '自动刷新',
              prop: 'auto',
              bottom: {
                type: 'inputAssembly',
                valueType: 'Number',
                min: 0,
                prop: 'refresh',
                isInlineError: true,
                style: {
                  width: '120px'
                },
                suffixSpan: '分钟',
                placeholder: '1440'
              }
            }
          ]
        } else if (val === 2) {
          option.form = [
            {
              type: 'selectAssembly',
              label: '来源',
              prop: 'platform',
              size: 'medium',
              placeholder: '视频源',
              option: [
                {
                  label: 'CRMP',
                  value: 1
                },
                {
                  label: '沃家神眼',
                  value: 2
                }
              ]
            },
            {
              type: 'inputAssembly',
              label: '名称',
              prop: 'name',
              placeholder: '视频源名称'
            },
            {
              type: 'inputAssembly',
              label: '地址',
              prop: 'address',
              placeholder: '请求地址'
            },
            {
              type: 'inputAssembly',
              label: '用户名',
              prop: 'username',
              placeholder: '用户名'
            },
            {
              type: 'inputAssembly',
              label: '密码',
              prop: 'password',
              placeholder: '密码'
            },
            {
              type: 'inputAssembly',
              label: '默认 Dept ID',
              prop: 'deptId',
              placeholder: '请输入 Dept ID'
            },
            {
              type: 'switchAssembly',
              label: '自动刷新',
              prop: 'auto',
              bottom: [
                {
                  type: 'timeSelect',
                  timeType: 'picker',
                  label: '刷新时间',
                  prop: 'autoRefreshTime',
                  format: 'HH:mm',
                  valueFormat: 'HH:mm',
                  style: {
                    width: '152px'
                  },
                  placeholder: '02:00'
                },
                {
                  type: 'inputAssembly',
                  label: '重试次数',
                  valueType: 'Number',
                  min: 0,
                  max: 5,
                  prop: 'tryRefreshTimes',
                  isInlineError: true,
                  style: {
                    width: '152px'
                  },
                  placeholder: '3'
                }
              ]
            },
            {
              type: 'switchAssembly',
              label: '自动更新任务',
              prop: 'autoUpdateTask',
              labelSvg: 'info-fill',
              labelInfo: '视频源更新完成后，将自动重启关联任务',
              labelInfoStyle: {
                'margin-left': '8px',
                color: 'rgba(218, 227, 240, 1)'
              }
            }
          ]
        }

        this.checkAuto()
      },
      immediate: true
    },
    'sourceOptionDia.option.data.auto': {
      handler(val) {
        this.checkAuto()
      },
      immediate: true
    }
  },
  methods: {
    checkAuto() {
      const option = this.sourceOptionDia.option

      const auto = option.form.find(item => item.prop === 'auto')

      if (option.data.platform === 1) {
        auto.bottom.type = option.data.auto ? 'inputAssembly' : ''
      } else if (option.data.platform === 2) {
        auto.bottom[0].type = option.data.auto ? 'timeSelect' : ''
        auto.bottom[1].type = option.data.auto ? 'inputAssembly' : ''
      }
    },
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
        this.searchCamerasWithNode(currentNode)
      } else {
        this.currentNode = this.tree.getCurrentNode()
        this.searchCamerasWithNode(this.currentNode)
      }

      this.tree.setCurrentKey(this.currentNode.groupId)

      const node = this.tree.getNode(this.currentNode)

      if (typeof node.parent.key === 'undefined') {
        node.expand(null, true)
      } else {
        node.parent.expand(null, true)
      }

      this.dealReadonly(currentNode)
    },
    dealReadonly(currentNode) {
      const current = currentNode || this.currentNode

      const root = this.tree.getNodePath(current)[0]

      const typeHead = this.AiMonitoringPointOption.header.find(head => head.prop === 'typeString')

      if (root && root.readonly) {
        this.dividerButtonData.buttons = []
        this.AiMonitoringPointOption.selectionColumn = undefined

        typeHead.hide = true

        this.AiMonitoringPointOption.header[0].buttonGroup.buttons = [
          {
            label: '编辑',
            value: 'edit',
            type: 'text'
          },
          {
            label: '直播流',
            value: 'view',
            type: 'text'
          }
        ]

        this.isSystemTree = false
      } else {
        this.dividerButtonData.buttons = deepClone(this.dividerButtonsCache)
        this.AiMonitoringPointOption.selectionColumn = {
          fixed: 'left',
          width: 30,
          show: true,
          align: 'left'
        }

        typeHead.hide = false

        this.AiMonitoringPointOption.header[0].buttonGroup.buttons = [
          {
            label: '编辑',
            value: 'edit',
            type: 'text'
          },
          {
            label: '刷新',
            value: 'refreshOne',
            type: 'text'
          },
          {
            label: '直播流',
            value: 'view',
            type: 'text'
          },
          {
            label: '删除',
            value: 'deleteOne',
            type: 'text',
            popoverclass: 'is-danger',
            tip: '请确认是否删除该点位?',
            svgIcon: 'warning'
          }
        ]

        this.isSystemTree = true
      }

      this.$refs.formTable.reRenderTable = String(Date.now())
    },
    searchCameraTree(node) {
      return new Promise((resolve, reject) => {
        this.treeLoading = true
        device.getCameraTree()
          .then(res => {
            const { treeData } = res.data

            treeData.forEach(tree => {
              if (tree.groupId === 0) {
                tree.disabled = true
                tree.children.forEach(item => {
                  if (item.groupId === -1) {
                    item.disabled = true
                  }
                })

                this.systemTree = [tree]
              } else {
                tree.readonly = true
              }
            })

            this.treeOption.data = treeData
            this.treeLoading = false

            if (node) {
              this.treeOption.expandedKeys = [0, node.data.groupId]
            } else {
              this.treeOption.expandedKeys = [0]
            }

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
      device.moveTree(defaultParams).then(() => {
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
      const res = await device.addCameraInTree(params).catch(() => {
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
        const res = await device.deleteCameraInTree(params).catch(() => {
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
    async afterChangeNode(node) {
      await this.searchCameraTree(node)

      this.$nextTick(() => {
        this.clickNode()
      })
    },

    refreshNode(node) {
      node.collapse()

      this.$set(node.data, 'loadingS', { size: 12 })

      device.refreshVideoSourceData({ id: node.data.source })
        .then(res => {
          this.$set(node.data, 'loadingS', false)

          this.$messageInfo({
            type: 'success',
            message: '刷新 ' + node.data.label + ' 成功!'
          })

          this.afterChangeNode(node)
        })
    },
    videoSourceSetting() {
      const form = this.videoSource.option.form
      form[0].loading = true
      form[0].top.disabled = true
      form[0].tableData = []

      const assignObj = {
        title: '视频源管理',
        show: true,
        name: 'DialogShell',
        width: '900px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.videoSource
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      this.getVideoSourceData()
    },
    getVideoSourceData(flag) {
      const form = this.videoSource.option.form

      if (flag) {
        form[0].loading = true
        form[0].top.disabled = true
      }

      device.getVideoSourceData()
        .then(res => {
          const { source } = res.data

          source.forEach(out => {
            if (out.id === 0) {
              out.name = '系统'
              out.sourceString = '系统'
              out.address = '--'
              out.autoRefreshString = '--'
              out.hide = ['editSource', 'deleteSource']
            } else {
              out.sourceString = ['', 'CRMP', '沃家神眼'][out.platform]
              switch (out.platform) {
                case 1:
                  out.autoRefreshString = `${['关闭', '开启'][out.autoRefresh]}${out.autoRefresh ? ', ' + out.refreshMin + 'min' : ''}`
                  break
                case 2:
                  out.autoRefreshString = `${['关闭', '开启'][out.autoRefresh]}${out.autoRefresh ? ', ' + out.autoRefreshTime : ''}`
                  break
                default:
                  break
              }
              out.auto = !!out.autoRefresh
              out.refresh = out.refreshMin
              out.autoUpdateTask = !!out.autoUpdateTask
            }
          })

          form[0].tableData = source

          form[0].loading = false
          form[0].top.disabled = false
        })
        .catch(() => {
          form[0].loading = false
          form[0].top.disabled = false
        })
    },
    addSource() {
      const option = this.sourceOptionDia.option

      option.data = {
        platform: 1,
        name: '',
        address: '',
        username: '',
        password: '',
        deptId: '',
        auto: false,
        refresh: null,
        autoRefreshTime: '',
        tryRefreshTimes: null,
        autoUpdateTask: true
      }

      const assignObj = {
        title: `${this.sourceAction === 'add' ? '新增' : '编辑'}视频源`,
        show: true,
        name: 'DialogShell',
        modal: true,
        level: 2,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
        width: '392px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveSource',
              type: 'primary'
            }
          ]
        },
        component: this.sourceOptionDia
      }

      if (this.sourceAction === 'edit') {
        option.data = deepClone(this.buttonScope.row)
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveSource() {
      const data = this.sourceOptionDia.option.data

      const params = {
        platform: data.platform,
        name: data.name,
        address: data.address,
        autoRefresh: data.auto ? 1 : 0
      }

      if (data.platform === 1) {
        params.refreshMin = data.auto ? (data.refresh ?? 1440) : null
      } else if (data.platform === 2) {
        params.username = data.username
        params.password = data.password
        params.deptId = data.deptId
        params.autoRefreshTime = data.auto ? (data.autoRefreshTime || '02:00') : ''
        params.tryRefreshTimes = data.auto ? (data.tryRefreshTimes ?? 3) : null
        params.autoUpdateTask = data.autoUpdateTask ? 1 : 0
      }

      if (this.sourceAction === 'edit') {
        params.id = data.id
      }

      this.sourceOptionDia.option.ref.validate(valid => {
        let autoRefreshValid = true

        if (data.platform === 1 && data.auto) {
          autoRefreshValid = params.refreshMin >= 0
        }

        if (data.platform === 2 && data.auto) {
          autoRefreshValid = params.tryRefreshTimes >= 0 && params.tryRefreshTimes <= 5
        }

        if (valid && autoRefreshValid) {
          this.dialog.dialog.buttons.buttons[1].loading = true
          this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()

          device.addVideoSourceData(params)
            .then(res => {
              this.dialog.dialog.buttons.buttons[1].loading = false
              this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()
              this.$store.dispatch('dialog/initDialogData', true)

              this.getVideoSourceData(true)
              this.afterChangeNode()
            })
            .catch(() => {
              this.dialog.dialog.buttons.buttons[1].loading = false
              this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()
            })
        }
      })
    },
    deleteSource() {
      const form = this.videoSource.option.form
      form[0].loading = true
      form[0].top.disabled = true

      device.deleteVideoSourceData({ id: this.buttonScope.row.id })
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除成功！'
          })

          this.getVideoSourceData(true)
          this.afterChangeNode()
        })
        .catch(() => {
          form[0].loading = false
          form[0].top.disabled = false
        })
    }
  }
}
