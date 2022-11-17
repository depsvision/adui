import device from '@/api/device'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

import configuration from '@/setting'

export default {
  data() {
    return {
      nodeDialog: {},
      nodeDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          alert: {
            title: '',
            type: 'warning',
            closable: false,
            showIcon: true,
            buttons: [
              {
                label: '查看详情',
                value: 'linkToLicense',
                type: 'text'
              }
            ]
          },
          data: {
            name: '',
            ip: '',
            port: '',
            isCloud: false,
            platPort: ''
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ],
            ip: [
              { required: true, message: '请输入ip', trigger: ['blur', 'change'] }
            ],
            port: [
              { required: true, message: '请输入节点端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > 1023 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入1024 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            platPort: [
              { required: true, message: '请输入端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > 0 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入1 - 65535 之间的值')
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
              label: '节点IP',
              prop: 'ip',
              placeholder: '请输入ip'
            },
            {
              type: 'inputAssembly',
              label: '节点端口',
              prop: 'port',
              placeholder: '请输入端口'
            },
            {
              type: 'switchAssembly',
              label: '云边协同',
              prop: 'isCloud'
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
      'dialog',
      'buttonScope'
    ])
  },
  watch: {
    'nodeDialog.option.data.isCloud'(val) {
      this.dealPlatform(val)
    }
  },
  methods: {
    getNodeData(removeLoading) {
      if (!removeLoading) {
        this.pageLoading = true

        this.nodeManager.option.form[0].top.buttons[0].disabled = true
        this.$set(this.nodeManager.option.form[0], 'loading', true)
      }

      device.getNodeData()
        .then(res => {
          const { nodeList } = res.data

          nodeList.forEach(item => {
            item.NMStatus = item.status ? '在线' : '离线'

            const hasServiceAlive = item.serviceList.some(serve => serve.online)

            if (item.serviceStatus !== undefined) {
              if (hasServiceAlive) {
                item.serviceRun = ['在线', '在线(上次重启失败)', '重启中'][item.serviceStatus]
              } else {
                item.serviceRun = '离线'
              }
            } else {
              item.serviceRun = '无'
            }

            item.data = item
            item.form = []

            item.serviceList.forEach(service => {
              service.nodeId = item.id
              service.tasksString = service.tasks

              this.dealTableData(service)
            })

            item.tableOption = {}
            this.$set(item.tableOption, 'defaultSort', { prop: 'serviceId', order: 'ascending' })

            item.tableOption.tableData = item.serviceList

            item.isCloud = !!item.frp

            item.platPortClass = ['is-grey', 'is-green'][item.frp]

            item.platPort = item.platPort ?? '无'
          })

          this.physicalNode = nodeList

          this.dealData()

          this.nodeManager.option.form[0].top.buttons[0].disabled = false
          this.$set(this.nodeManager.option.form[0], 'loading', false)

          this.pageLoading = false
        })
        .catch(() => {
          this.nodeManager.option.form[0].top.buttons[0].disabled = false
          this.$set(this.nodeManager.option.form[0], 'loading', false)

          this.pageLoading = false
        })
    },
    dealTableData(service) {
      service.serviceTypeResult = ['', 'RTVAS', 'RTIAS', 'RTVRS', 'RTICS'][service.serviceType]
      service.tasks.length === 0 && (service.tasksString = '-')

      service.autoServicePort = 0

      if (service.caisa) {
        service.caisaName = service.caisa.join(', ')
      }

      if (service.serviceType === 3) {
        service.caisaName = '-'
      }

      if (service.runningAlgorithm) {
        service.activatedAlgorithm = ''
        service.runningAlgorithm.forEach((al, alIndex) => {
          service.activatedAlgorithm += al.name + (service.runningAlgorithm.length - 1 === alIndex ? '' : ', ')

          al.label = al.name
          al.tagType = 'node'
          al.tagSvg = configuration.algorithmSvg[al.id] || 'normal'
          al.tagColor = 'blue'
          al.nodeKey = 'id'
        })
        service.activatedAlgorithmContent = service.activatedAlgorithm
      } else {
        service.activatedAlgorithm = '未启用'

        service.runningAlgorithm = []
      }

      if (service.serviceType === 2) {
        if (service.run === 'run') {
          service.hide = []
          service.loadingS = []
        } else if (service.run === 'stop') {
          service.hide = []
          service.loadingS = []
          service.activatedAlgorithm = '未启用'
        } else if (service.run) {
          service.hide = ['changeAlgorithm']
          service.loadingS = ['activatedAlgorithm']
          service.activatedAlgorithm = '等待中'
        } else {
          service.hide = []
          service.loadingS = []
          service.activatedAlgorithm = '-'
        }
      } else {
        service.hide = ['changeAlgorithm']
        service.loadingS = []
        service.activatedAlgorithm = '-'
      }

      if (service.online) {
        service.occupyStatus = service.occupy ? '占用(' + service.occupy + ')' : '空闲'
        service.occupyStatusClass = service.occupy ? 'is-yellow' : 'is-green'

        service.runStatus = service.run
        service.runStatusClass = (() => {
          let className = ''
          switch (service.run) {
            case 'run':
              className = 'is-green'
              break
            case 'stop':
              className = 'is-grey'
              break
            case 'starting':
              className = 'is-blue'
              break
            case 'ending':
              className = 'is-orange'
              break
            default:
          }
          return className
        })()

        service.healthStatus = !service.health ? '异常' : service.health === 1 ? '正常' : '注意'
        service.healthStatusClass = !service.health ? 'is-red' : service.health === 1 ? 'is-green' : 'is-orange'
      } else {
        service.occupyStatus = service.runStatus = service.healthStatus = '-'
        this.$set(service, 'rowColumn', false)
      }
    },
    dealData() {
      this.physicalNode.forEach(item => {
        const buttonsArr = deepClone(this.commonPhysicalNodeButtons)

        item.itemStyle = {
          'margin-right': '48px'
        }

        item.form = deepClone(this.commonPhysicalNodeForm)

        const hasServiceAlive = item.serviceList.some(serve => serve.online)

        if (item.serviceStatus !== undefined) {
          if (hasServiceAlive) {
            item.form[4].loadingS = [false, false, true][item.serviceStatus]
            if (item.serviceStatus !== 2) {
              item.form[4].class = 'status-mark is-green'
            } else {
              item.form[4].class = ''
            }
          } else {
            item.form[4].class = 'status-mark is-grey'
          }
        }

        item.form[3].class += item.status ? ' is-green' : ' is-grey'

        item.form[4].class += item.frp ? ' is-green' : ' is-grey'

        item.tableOption.header = deepClone(this.commonServiceTableHeader)

        item.leftButtons = {
          buttons: buttonsArr
        }

        if (!item.status) {
          this.$set(item.leftButtons.buttons[3], 'disabled', true)
          this.$set(item.leftButtons.buttons[2], 'disabled', true)
        } else if (!item.tableOption.tableData.length) {
          this.$set(item.leftButtons.buttons[2], 'disabled', true)
        } else if (item.serviceStatus === 2) {
          this.$set(item.leftButtons.buttons[2], 'disabled', true)
        } else {
          this.$set(item.leftButtons.buttons[3], 'disabled', false)
          this.$set(item.leftButtons.buttons[2], 'disabled', false)
        }
      })

      const table = this.nodeManager.option.form[0]
      table.tableData = []

      table.tableData = this.physicalNode

      table.tableData.forEach(td => {
        td.NMStatusClass = td.status ? 'is-green' : 'is-grey'
      })
    },
    showNodeDia() {
      // 清空数据
      this.nodeDialog = deepClone(this.nodeDialogTemplate)

      const assignObj = {
        title: '新增节点',
        show: true,
        name: 'DialogShell',
        width: '568px',
        modal: true,
        level: 2,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveNode',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      const option = this.nodeDialog

      if (this.action === 'edit') {
        assignObj.title = '编辑节点'
        option.option.data = Object.assign(option.option.data, this.buttonScope.row.data)

        this.dealPlatform(this.nodeDialog.option.data.isCloud)
      }

      assignObj.component = option

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveNode() {
      this.nodeDialog.option.alert.title = ''

      this.nodeDialog.option.ref.validate(valid => {
        if (valid) {
          this.dialog.dialog.buttons.buttons[1].loading = true
          this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()

          const params = {
            name: this.nodeDialog.option.data.name,
            ip: this.nodeDialog.option.data.ip,
            port: Number(this.nodeDialog.option.data.port),
            frp: this.nodeDialog.option.data.isCloud ? 1 : 0,
            platPort: this.nodeDialog.option.data.platPort ?? ''
          }

          if (this.action === 'edit') {
            params.id = this.buttonScope.row.id
          }
          device.saveNodeData(params, true)
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: this.dialog.dialog.title + '成功！'
              })

              this.nodeDialog.option.alert.title = ''
              this.dialog.dialog.buttons.buttons[1].loading = false
              this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()

              this.$store.dispatch('dialog/initDialogData', true)

              this.getNodeData(false)
            })
            .catch(err => {
              if (err.errorCode === 2004) {
                // this.nodeDialog.option.alert.title = err.errorMsg.replaceAll('\n', '<br />')
              } else {
                this.$messageInfo({
                  type: 'error',
                  message: err.errorMsg
                })
              }

              this.dialog.dialog.buttons.buttons[1].loading = false
              this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()
            })
        }
      })
    },
    dealPlatform(flag) {
      const data = this.nodeDialog.option.data
      const form = this.nodeDialog.option.form
      const hasPlatform = form.some(form => form.prop === 'platPort')

      if (data.platPort === '无') {
        data.platPort = ''
      }

      if (flag) {
        !hasPlatform && form.push({
          type: 'inputAssembly',
          label: '平台端口',
          prop: 'platPort',
          placeholder: '请输入端口'
        })
      } else {
        hasPlatform && form.pop()
      }
    },
    deleteNode() {
      this.pageLoading = true
      device.deleteNodeData({ id: this.buttonScope.row.id })
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除成功！'
          })

          this.getNodeData(false)
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    restartNode() {
      this.$confirm('重启“物理”节点即重启物理机, 该操作将会中断当前所有任务, ' + '<br /> ' + ' 并重启硬件及服务', '重启节点', {
        confirmButtonText: '重启',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        this.activeTableIndex = this.physicalNode.findIndex(item => item.data.id === this.buttonScope.id)
        this.$set(this.physicalNode[this.activeTableIndex], 'loading', true)

        device.restartNode({ id: this.buttonScope.id })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '重启节点成功！'
            })

            this.$set(this.physicalNode[this.activeTableIndex], 'loading', false)
          })
          .catch(() => {
            this.$set(this.physicalNode[this.activeTableIndex], 'loading', false)
          })
      })
    }
  }
}
