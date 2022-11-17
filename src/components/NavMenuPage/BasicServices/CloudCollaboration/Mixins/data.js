import cloud from '@/api/cloud'
import device from '@/api/device'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      otherAction: 'add',
      nodeManager: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          form: [
            {
              label: '',
              type: 'FormTable',
              tableData: [],
              selectedData: [],
              containerClass: ['inner-form-table'],
              selectionColumn: {
                fixed: 'left',
                width: 30,
                show: true,
                align: 'left'
              },
              option: {
                maxHeight: 236
              },
              header: [
                {
                  width: 80,
                  align: 'left',
                  label: 'ID',
                  prop: 'id',
                  type: 'span'
                },
                {
                  minWidth: 200,
                  align: 'left',
                  label: '节点名称',
                  prop: 'name',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  minWidth: 140,
                  align: 'left',
                  label: 'IP',
                  prop: 'ip',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  width: 80,
                  align: 'left',
                  label: '内网端口',
                  prop: 'port',
                  type: 'span'
                },
                {
                  width: 80,
                  align: 'left',
                  label: '平台端口',
                  prop: 'platPort',
                  type: 'span'
                }
              ]
            }
          ]
        }
      },
      aiOtherDia: {},
      aiOtherDiaTem: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            ip: '',
            port: '',
            platPort: ''
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ],
            ip: [
              { required: true, message: '请输入内网ip', trigger: ['blur', 'change'] }
            ],
            port: [
              { required: true, message: '请输入内网端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > -1 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入0 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            platPort: [
              { required: true, message: '请输入平台端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > -1 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入0 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: ['blur', 'change']
              }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '节点名称',
              prop: 'name',
              placeholder: '请输入名称'
            },
            {
              type: 'inputAssembly',
              label: '内网ip',
              prop: 'ip',
              placeholder: '请输入ip'
            },
            {
              type: 'inputAssembly',
              label: '内网端口',
              prop: 'port',
              placeholder: '请输入内网端口'
            },
            {
              type: 'inputAssembly',
              label: '平台端口',
              prop: 'platPort',
              placeholder: '请输入平台端口'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      aiPlatPortDia: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            platPort: ''
          },
          rule: {
            platPort: [
              { required: true, message: '请输入平台端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > -1 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入0 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: ['blur', 'change']
              }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '平台端口',
              prop: 'platPort',
              placeholder: '请输入平台端口'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog'
    ])
  },
  watch: {
    'dialog.listenerClick.time': {
      handler(val) {
        val && this.getPointData(val)
      },
      deep: true
    }
  },
  methods: {
    getAipointTree() {
      return new Promise(resolve => {
        device.getCameraTree()
          .then(res => {
            const { treeData } = res.data

            resolve(treeData)
          })
          .catch(() => {
            resolve(null)
          })
      })
    },

    handleClickTab() {
      this[this.activeName].loading = false
    },
    setAiData() {
      this[this.activeName].loading = true

      cloud.getCloudData({ sourceId: Number(this.synchronizeData.data.edgeEnvironment) })
        .then(res => {
          const { node, camera, other } = res.data

          this.aiService.tableData = node
          this.aiPoint.tableData = camera
          this.aiOther.tableData = other

          this.aiPoint.tableData.forEach(item => {
            item.tagType = 'node'
            item.tagSvg = 'webcam-line'
            item.tagColor = 'blue'
            item.nodeKey = 'id'
            item.label = item.name
          })

          this[this.activeName].loading = false
        })
        .catch(() => {
          this[this.activeName].loading = false
        })
    },

    addAiService() {
      const assignObj = {
        title: '添加协同节点',
        show: true,
        name: 'DialogShell',
        width: '758px',
        tip: {
          label: '注意，一个节点同时只能存在于一个边缘环境中，在当前环境选择后，将会从其他环境中移除',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        },
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveAiService',
              type: 'primary',
              loading: true
            }
          ]
        },
        component: {}
      }

      assignObj.component = this.nodeManager

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      this.getNodeData()
    },
    getNodeData() {
      const form = this.dialog.component.option.form

      form[0].tableData = []

      form[0].loading = true

      this.dialog.buttons.buttons[1].loading = true

      device.getNodeData()
        .then(res => {
          const { nodeList } = res.data

          form[0].tableData = nodeList.filter(item => item.frp)

          form[0].loading = false

          this.dialog.buttons.buttons[1].loading = false
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          this.$nextTick(() => {
            form[0].selectedData = [...nodeList.filter(item => item.frp && this.aiService.tableData.some(ai => ai.id === item.id))]
          })
        })
        .catch(() => {
          form[0].loading = false

          this.dialog.buttons.buttons[1].loading = false
          this.dialog.self.$refs.buttonGroup.$forceUpdate()
        })
    },
    saveAiService() {
      const table = this.dialog.self.$refs.component.$refs.component[0]

      const objList = []

      table.selectedData.forEach(td => {
        objList.push(td.id)
      })

      const params = {
        sourceId: this.synchronizeData.data.edgeEnvironment,
        type: 1,
        objList: objList
      }

      cloud.addAiServiceData(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '增加协同节点成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.setAiData()
        })
    },
    editAiServicePlatPort() {
      const assignObj = {
        title: '编辑 AI 计算服务平台端口',
        show: true,
        name: 'DialogShell',
        width: '568px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveAiServicePlatPort',
              type: 'primary'
            }
          ]
        },
        component: this.aiPlatPortDia
      }

      this.aiPlatPortDia.option.data.platPort = this.buttonScope.row.platPort

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveAiServicePlatPort() {
      const params = {
        type: 1,
        objId: this.buttonScope.row.id,
        platPort: this.aiPlatPortDia.option.data.platPort
      }

      cloud.editAiServicePlatPort(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '修改平台端口成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.setAiData()
        })
    },

    async addAiPoint() {
      const aiPointTree = await this.getAipointTree()

      if (!aiPointTree) {
        return
      }

      const treeListDia = {
        name: 'TreeList',
        option: {
          bottomHead: '选择点位',
          placeholder: '搜索点位',
          tagClosable: true,
          resultLoding: false,
          tagData: this.aiPoint.tableData,
          tabData: [
            {
              id: 'tree',
              label: '点位',
              filterBlock: 'rightTree',
              treeData: aiPointTree,
              resultData: []
            }
          ],
          treeOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            highlightCurrent: true,
            currentNode: 0,
            nodeKey: 'groupId',
            expandedKeys: [0],
            tooltip: {
              placement: 'top-start',
              enterable: false
            }
          },
          resultOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            currentNode: 0,
            nodeKey: 'id',
            filterInput: {
              hide: true
            },
            expandedKeys: [0],
            showCheckbox: true,
            tooltip: {
              placement: 'top-start',
              enterable: false
            },
            tagSvg: 'webcam-line',
            tagColor: 'blue'
          }
        }
      }

      const assignObj = {
        title: '选择分析点位',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--small',
        tip: {
          label: '注意，一个点位同时只能存在于一个边缘环境中，在当前环境选择后，将会从其他环境中移除',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        },
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveAipoint',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    getPointData() {
      const that = this
      const tree = this.dialog.listenerClick.refs.currentNode

      const defaultParams = {
        parentId: tree.groupId,
        page: 1,
        size: 99999
      }

      that.dialog.component.option.resultLoding = true
      device.searchTreeNodeCamera(defaultParams)
        .then(res => {
          const { cameraList } = res.data

          cameraList.forEach(item => {
            item.label = item.name
          })

          that.dialog.component.option.tabData[0].resultData = cameraList
          that.dialog.component.option.resultOption.data = cameraList
          that.dialog.component.option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          that.dialog.component.option.resultLoding = false
        })
    },
    saveAipoint() {
      const pointIdList = []
      this.dialog.listenerClick.refs.tagData.forEach(item => {
        pointIdList.push(item.id)
      })

      const params = {
        sourceId: this.synchronizeData.data.edgeEnvironment,
        type: 2,
        objList: pointIdList
      }

      cloud.addAiServiceData(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '增加协同监控点位成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.setAiData()
        })
    },
    editAiPointPlatPort() {
      const assignObj = {
        title: '编辑 AI 监控点位平台端口',
        show: true,
        name: 'DialogShell',
        width: '568px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveAiPointPlatPort',
              type: 'primary'
            }
          ]
        },
        component: this.aiPlatPortDia
      }

      this.aiPlatPortDia.option.data.platPort = this.buttonScope.row.platPort

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveAiPointPlatPort() {
      const params = {
        type: 2,
        objId: this.buttonScope.row.id,
        platPort: this.aiPlatPortDia.option.data.platPort
      }

      cloud.editAiPointPlatPort(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '修改平台端口成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.setAiData()
        })
    },

    addAiOther() {
      // 清空数据
      this.aiOtherDia = deepClone(this.aiOtherDiaTem)

      const assignObj = {
        title: (this.otherAction === 'add' ? '新增' : '编辑') + '其他地址',
        show: true,
        name: 'DialogShell',
        width: '568px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveAiOther',
              type: 'primary'
            }
          ]
        },
        component: this.aiOtherDia
      }

      if (this.otherAction === 'edit') {
        this.aiOtherDia.option.data = deepClone(this.buttonScope.row)
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveAiOther() {
      const params = deepClone(this.aiOtherDia.option.data)

      params.sourceId = this.synchronizeData.data.edgeEnvironment

      cloud.addAiOtherData(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: (this.otherAction === 'add' ? '新增' : '编辑') + '其他地址成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.setAiData()
        })
    },
    deleteAiOther() {
      cloud.deleteAiOtherData({ id: this.buttonScope.row.id })
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除其他地址成功！'
          })

          this.setAiData()
        })
    }
  }
}
